const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('.menu');
if(toggle&&menu){toggle.addEventListener('click',()=>{menu.classList.toggle('open');toggle.setAttribute('aria-expanded',menu.classList.contains('open'));});}
document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>menu?.classList.remove('open')));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  const submitBtn = document.querySelector('#booking-submit');
  const statusBox = document.querySelector('#form-status');
  const fallbackLink = document.querySelector('#email-fallback');
  const setStatus = (message, type) => {statusBox.textContent = message;statusBox.className = `form-status show ${type}`;};
  const buildMailto = (data) => {
    const subject = `Demande de booking — ${data.get('nom') || 'Lea & Artemius'}`;
    const body = [`Nom / organisation : ${data.get('nom') || ''}`,`Email : ${data.get('email') || ''}`,`Téléphone : ${data.get('telephone') || ''}`,`Type d'événement : ${data.get('type') || ''}`,`Date / période : ${data.get('date') || ''}`,`Ville / lieu : ${data.get('lieu') || ''}`,'','Projet :',data.get('message') || ''].join('\n');
    return `mailto:leaetartemius@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  bookingForm.addEventListener('input', () => {const data = new FormData(bookingForm);fallbackLink.href = buildMailto(data);});
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const data = new FormData(bookingForm);fallbackLink.href = buildMailto(data);submitBtn.disabled = true;submitBtn.textContent = 'Envoi en cours…';setStatus('Envoi de votre demande…', 'sending');
    const payload = Object.fromEntries(data.entries());
    try {
      const response = await fetch('https://formsubmit.co/ajax/leaetartemius@gmail.com', {method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === 'false' || result.success === false) throw new Error(result.message || 'Envoi refusé');
      setStatus('Merci ! Votre demande a bien été envoyée. Nous vous répondrons dès que possible.', 'success');
      bookingForm.reset();
      fallbackLink.href = 'mailto:leaetartemius@gmail.com?subject=Demande%20de%20booking%20Lea%20%26%20Artemius';
    } catch (error) {
      setStatus("L'envoi automatique n'a pas abouti. Cliquez sur « Écrire directement par e-mail » juste en dessous : votre message est déjà préparé.", 'error');
    } finally {submitBtn.disabled = false;submitBtn.textContent = 'Envoyer la demande →';}
  });
}