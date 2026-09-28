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
    const subject=`Demande de booking — ${data.get('nom')||'Lea & Artemius'}`;
    const body=[`Nom / organisation : ${data.get('nom')||''}`,`Email : ${data.get('email')||''}`,`Téléphone : ${data.get('telephone')||''}`,`Type d'événement : ${data.get('type')||''}`,`Date / période : ${data.get('date')||''}`,`Ville / lieu : ${data.get('lieu')||''}`,'','Projet :',data.get('message')||''].join('\n');
    return `mailto:leaetartemius@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  bookingForm.addEventListener('input',()=>{fallbackLink.href=buildMailto(new FormData(bookingForm));});
}
