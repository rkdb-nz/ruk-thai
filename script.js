const portraitCss=document.createElement('link');
portraitCss.rel='stylesheet';
portraitCss.href='mobile-portrait.css';
document.head.appendChild(portraitCss);

const hero=document.querySelector('.hero');
const heroCopy=hero?.querySelector('.hero-copy');
const heroActions=hero?.querySelector('.hero-actions');
const siteHeader=document.querySelector('.site-header');

if(heroCopy&&!heroCopy.querySelector('.mobile-hero-logo')){
  const logo=document.createElement('a');
  logo.className='mobile-hero-logo';
  logo.href='#top';
  logo.setAttribute('aria-label','Ruk Thai home');
  logo.innerHTML='<img src="assets/brand/ruk-thai-logo-banner.png" alt="Ruk Thai">';
  const img=logo.querySelector('img');
  img.addEventListener('error',()=>{if(!img.dataset.fallback){img.dataset.fallback='1';img.src='01_Ruk_Thai_Logo_Banner.png';}});
  heroCopy.prepend(logo);
}

if(heroActions){
  const call=heroActions.querySelector('a[href^="tel:"]');
  const menu=heroActions.querySelector('a[href="#menu"]');
  const directions=[...heroActions.querySelectorAll('a')].find(a=>a.href.includes('google.com/maps'));

  if(call){
    call.href='tel:+6475796180';
    call.setAttribute('aria-label','Call Ruk Thai on 07 579 6180');
    call.innerHTML='<span class="cta-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg></span><span class="cta-title">CALL TO ORDER</span><span class="cta-phone">07 579 6180</span>';
  }

  if(menu){
    menu.innerHTML='<span class="cta-secondary-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3.5h6a2 2 0 0 1 2 2V21a2.5 2.5 0 0 0-2.5-2.5H4z"/><path d="M20 3.5h-6a2 2 0 0 0-2 2V21a2.5 2.5 0 0 1 2.5-2.5H20z"/><path d="M6.5 7h3M6.5 10h3M14.5 7h3M14.5 10h3"/></svg></span><span>View Menu</span>';
  }

  if(directions){
    directions.innerHTML='<span class="cta-secondary-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.4A2.4 2.4 0 1 1 12 6.6a2.4 2.4 0 0 1 0 4.8z"/></svg></span><span>Directions</span>';
    directions.setAttribute('aria-label','Directions to Ruk Thai, 123 Chadwick Road, Greerton, Tauranga');
  }
}

if(siteHeader&&!siteHeader.querySelector('.mobile-menu-toggle')){
  const toggle=document.createElement('button');
  toggle.type='button';
  toggle.className='mobile-menu-toggle';
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-controls','mobile-menu-drawer');
  toggle.setAttribute('aria-label','Open navigation menu');
  toggle.innerHTML='<span class="mobile-menu-toggle-lines" aria-hidden="true"></span>';

  const drawer=document.createElement('nav');
  drawer.id='mobile-menu-drawer';
  drawer.className='mobile-menu-drawer';
  drawer.setAttribute('aria-label','Mobile navigation');
  drawer.innerHTML='<a href="#menu">Menu</a><a href="#visit">Visit</a><a href="https://www.facebook.com/taurangarukthai/" target="_blank" rel="noopener">Facebook</a><a href="tel:+6475796180">Call to Order · 07 579 6180</a>';

  siteHeader.append(toggle,drawer);

  const closeMenu=()=>{
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation menu');
    drawer.classList.remove('is-open');
    document.body.classList.remove('mobile-nav-open');
  };

  toggle.addEventListener('click',()=>{
    const opening=toggle.getAttribute('aria-expanded')!=='true';
    toggle.setAttribute('aria-expanded',String(opening));
    toggle.setAttribute('aria-label',opening?'Close navigation menu':'Open navigation menu');
    drawer.classList.toggle('is-open',opening);
    document.body.classList.toggle('mobile-nav-open',opening);
  });

  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
}

const els=[...document.querySelectorAll('.menu-section,.editorial-food,.lunch,.food-break,.visit')];
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(el=>el.classList.add('reveal'));const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});els.forEach(el=>io.observe(el));}
const links=[...document.querySelectorAll('.menu-nav a[href^="#"]')];const sections=[...document.querySelectorAll('.menu-section')];if('IntersectionObserver'in window){const io2=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}})},{rootMargin:'-30% 0px -60% 0px'});sections.forEach(s=>io2.observe(s));}
