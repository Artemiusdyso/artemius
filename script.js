const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('.menu');
if(toggle&&menu){toggle.addEventListener('click',()=>{menu.classList.toggle('open');toggle.setAttribute('aria-expanded',menu.classList.contains('open'));});}
document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>menu?.classList.remove('open')));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const bookingForm=document.querySelector('#booking-form');
if(bookingForm){
  const fallbackLink=document.querySelector('#email-fallback');
  const buildMailto=(data)=>{
    const en=document.documentElement.lang==='en';
    const subject=en?`Booking request — ${data.get('nom')||'Lea & Artemius'}`:`Demande de booking — ${data.get('nom')||'Lea & Artemius'}`;
    const body=en?[`Name / organisation: ${data.get('nom')||''}`,`Email: ${data.get('email')||''}`,`Phone: ${data.get('telephone')||''}`,`Event type: ${data.get('type')||''}`,`Date / period: ${data.get('date')||''}`,`City / venue: ${data.get('lieu')||''}`,'','Project:',data.get('message')||'']:[`Nom / organisation : ${data.get('nom')||''}`,`Email : ${data.get('email')||''}`,`Téléphone : ${data.get('telephone')||''}`,`Type d'événement : ${data.get('type')||''}`,`Date / période : ${data.get('date')||''}`,`Ville / lieu : ${data.get('lieu')||''}`,'','Projet :',data.get('message')||''];
    const bodyText=body.join('\n');
    return `mailto:leaetartemius@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  };
  bookingForm.addEventListener('input',()=>{fallbackLink.href=buildMailto(new FormData(bookingForm));});
}

const excerptToggle=document.querySelector('.source-excerpt-toggle');
const excerptBox=document.querySelector('.source-excerpt');
if(excerptToggle&&excerptBox){
  excerptToggle.addEventListener('click',()=>{
    const collapsed=excerptBox.getAttribute('data-collapsed')!=='false';
    excerptBox.setAttribute('data-collapsed',collapsed?'false':'true');
    excerptToggle.setAttribute('aria-expanded',collapsed?'true':'false');
    const symbol=excerptToggle.querySelector('.source-excerpt-symbol');
    const label=excerptToggle.querySelector('.source-excerpt-label');
    if(symbol) symbol.textContent=collapsed?'−':'+';
    if(label){const en=document.documentElement.lang==='en';label.textContent=collapsed?(en?'Show less':'Réduire'):(en?'Read more':'Lire la suite');}
  });
}

const amazonMiniLink=document.querySelector('.amazon-mini-link');
if(amazonMiniLink && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const runAmazonSheen=()=>{
    amazonMiniLink.classList.remove('is-sheen');
    void amazonMiniLink.offsetWidth;
    amazonMiniLink.classList.add('is-sheen');
    setTimeout(()=>amazonMiniLink.classList.remove('is-sheen'),1300);
  };
  setTimeout(runAmazonSheen,900);
  setInterval(runAmazonSheen,8500);
}

// Premium Amazon star twinkle
const amazonButton=document.querySelector('.amazon-mini-under-book');
if(amazonButton){
  const starLayer=amazonButton.querySelector('.amazon-stars');
  if(starLayer && !starLayer.children.length){
    const starCount=14;
    for(let n=0;n<starCount;n++){
      const star=document.createElement('i');
      star.className='amazon-star';
      star.style.left=(6+Math.random()*88)+'%';
      star.style.top=(15+Math.random()*70)+'%';
      star.style.setProperty('--dur',(1.8+Math.random()*2.6)+'s');
      star.style.setProperty('--delay',(-Math.random()*3.5)+'s');
      starLayer.appendChild(star);
    }
  }
}


// Animated featured home title
document.querySelectorAll('[data-feature-title]').forEach(title=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    title.classList.add('is-live');
    return;
  }
  const titleObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        title.classList.add('is-live');
        setTimeout(()=>title.classList.add('is-glow'),900);
        setTimeout(()=>title.classList.remove('is-glow'),2200);
        titleObserver.unobserve(entry.target);
      }
    });
  },{threshold:.45});
  titleObserver.observe(title);
});
