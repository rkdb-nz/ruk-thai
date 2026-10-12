// Cloudflare Pages Functions: access gate for every route, including static assets.
// Set secrets GATE_PASSWORD and GATE_SESSION_KEY on the production deployment.
// IMPORTANT: previously deployed immutable preview URLs are separate deployments.
const encoder = new TextEncoder();
const cookieName = "ruk_preview";
const ttlSeconds = 8 * 60 * 60;
const header = {"Cache-Control":"no-store, private","X-Robots-Tag":"noindex, nofollow","Referrer-Policy":"no-referrer","X-Content-Type-Options":"nosniff"};
const bytesToHex = bytes => Array.from(bytes, b => b.toString(16).padStart(2,"0")).join("");
async function sign(message, secret) {
  const key = await crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  return bytesToHex(new Uint8Array(await crypto.subtle.sign("HMAC",key,encoder.encode(message))));
}
function fixedEqual(a,b) {
  if(a.length!==b.length)return false;
  let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);
  return diff===0;
}
async function validCookie(request,secret) {
  const raw = request.headers.get("Cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith(cookieName+"="))?.slice(cookieName.length+1);
  if(!raw)return false;
  const [expiry,signature,...extra]=raw.split(".");
  if(extra.length || !/^\d{10,13}$/.test(expiry) || !/^[a-f0-9]{64}$/.test(signature||""))return false;
  if(Number(expiry)<Date.now() || Number(expiry)>Date.now()+ttlSeconds*1000)return false;
  const expected=await sign(expiry,secret);
  return fixedEqual(signature,expected);
}
async function gatePage(env,url,status=200) {
  const [original,shield] = await Promise.all([
    env.ASSETS.fetch(new Request(new URL("/index.html",url).toString())),
    env.ASSETS.fetch(new Request(new URL("/holding.html",url).toString()))
  ]);
  if(!original.ok || !shield.ok)return new Response("Private preview unavailable",{status:503,headers:header});
  const html=(await original.text()).replace('<main id="main">','<main id="main" inert aria-hidden="true">');
  const fragment=await shield.text();
  if(!html.includes("</body>"))return new Response("Private preview unavailable",{status:503,headers:header});
  return new Response(html.replace("</body>",fragment+"</body>"),{status,headers:{...header,"Content-Type":"text/html; charset=utf-8","Content-Security-Policy":"frame-ancestors 'none'"}});
}
export async function onRequest(context) {
  const {request,env,next}=context;
  if(!env.GATE_PASSWORD || !env.GATE_SESSION_KEY || env.GATE_SESSION_KEY.length<32)
    return new Response("Private preview not configured.",{status:503,headers:header});
  const url=new URL(request.url);
  if(url.pathname==="/_ruk_unlock") {
    if(request.method!=="POST")return new Response("Method not allowed",{status:405,headers:header});
    if(Number(request.headers.get("content-length")||0)>2048)return new Response("Request too large",{status:413,headers:header});
    const type=request.headers.get("content-type")||"";
    if(!type.startsWith("application/x-www-form-urlencoded"))return new Response("Unsupported media type",{status:415,headers:header});
    const form=await request.formData();
    const supplied=String(form.get("password")||"");
    const actual=env.GATE_PASSWORD;
    const match=fixedEqual(await sign(supplied,env.GATE_SESSION_KEY),await sign(actual,env.GATE_SESSION_KEY));
    if(!match) return Response.redirect(new URL("/?incorrect=1",url),303);
    const expiry=String(Date.now()+ttlSeconds*1000);
    const signature=await sign(expiry,env.GATE_SESSION_KEY);
    return new Response(null,{status:303,headers:{...header,Location:"/","Set-Cookie":`${cookieName}=${expiry}.${signature}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${ttlSeconds}`}});
  }
  if(!await validCookie(request,env.GATE_SESSION_KEY))return gatePage(env,url);
  if(url.pathname==="/holding.html")return Response.redirect(new URL("/",url),302);
  const response=await next();
  const headers=new Headers(response.headers);
  headers.set("X-Robots-Tag","noindex, nofollow");
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
