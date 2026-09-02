const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
const isMenu=page==='menu.html';
const isDirections=page==='directions.html';

if(isMenu||isDirections){
  const destinationCss=document.createElement('link');
  destinationCss.rel='stylesheet';
  destinationCss.href='destination-pages.css';
  document.head.appendChild(destinationCss);
  document.body.classList.add('destination-page',isMenu?'menu-page':'directions-page');

  const brand=document.querySelector('.site-header .brand');
  if(brand) brand.href='index.html';

  const nav=document.querySelector('.desktop-nav');
  if(nav){
    nav.innerHTML='<a href="index.html">Home</a><a href="menu.html">Menu</a><a href="directions.html">Directions</a><a href="https://www.facebook.com/taurangarukthai/" target="_blank" rel="noopener">Facebook</a>';
  }

  const headerCall=document.querySelector('.header-call');
  if(headerCall) headerCall.href='tel:+6475796180';

  const mobileBar=document.querySelector('.mobile-bar');
  if(mobileBar){
    mobileBar.innerHTML='<a href="index.html">Home</a><a href="menu.html">Menu</a><a href="directions.html">Directions</a>';
  }

  if(isMenu){
    document.title='Ruk Thai Menu | Greerton, Tauranga';
    const menu=document.querySelector('#menu');
    if(menu) menu.setAttribute('aria-label','Ruk Thai menu');
  }

  if(isDirections){
    document.title='Ruk Thai Directions | Greerton, Tauranga';
    const visit=document.querySelector('#visit');
    if(visit) visit.setAttribute('aria-label','Ruk Thai location and directions');
  }
}

const els=[...document.querySelectorAll('.menu-section,.lunch,.visit')].filter(el=>getComputedStyle(el).display!=='none');
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){
  els.forEach(el=>el.classList.add('reveal'));
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target);}
  }),{threshold:.08});
  els.forEach(el=>io.observe(el));
}

const links=[...document.querySelectorAll('.menu-nav a[href^="#"]')];
const sections=[...document.querySelectorAll('.menu-section')];
if('IntersectionObserver'in window&&links.length&&sections.length){
  const io2=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
    }
  }),{rootMargin:'-30% 0px -60% 0px'});
  sections.forEach(section=>io2.observe(section));
}
