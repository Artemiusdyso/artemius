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
  const submitButton=bookingForm.querySelector('#booking-submit');
  const formStatus=bookingForm.querySelector('#form-status');
  const languageIsEnglish=document.documentElement.lang==='en';
  const originalButtonText=submitButton ? submitButton.textContent : '';

  const showFormStatus=(type,text)=>{
    if(!formStatus) return;
    formStatus.className='form-status show '+type;
    formStatus.textContent=text;
  };

  bookingForm.addEventListener('submit',async event=>{
    // Use FormSubmit's documented AJAX endpoint so the visitor gets a clear
    // response instead of a silent page transition or a button that appears stuck.
    event.preventDefault();
    if(!bookingForm.reportValidity()) return;
    if(submitButton && submitButton.disabled) return;

    const sendingText=languageIsEnglish?'Sending your request…':'Envoi de votre demande…';
    if(submitButton){
      submitButton.disabled=true;
      submitButton.textContent=sendingText;
    }
    showFormStatus('sending',sendingText);

    try{
      const payload={};
      new FormData(bookingForm).forEach((value,key)=>{
        if(typeof value==='string') payload[key]=value;
      });

      const response=await fetch('https://formsubmit.co/ajax/leaetartemius@gmail.com',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Accept':'application/json'
        },
        body:JSON.stringify(payload)
      });
      const result=await response.json().catch(()=>null);
      const success=result && String(result.success).toLowerCase()==='true';

      if(!response.ok || !success){
        const detail=result && typeof result.message==='string' ? result.message : '';
        const activationNeeded=/activat/i.test(detail);
        const message=activationNeeded
          ? (languageIsEnglish
              ? 'FormSubmit needs to be activated first. It has sent an activation email to the receiving address. Open that email and click “Activate Form”; submissions will be delivered after activation.'
              : 'FormSubmit doit d’abord être activé. Un e-mail d’activation a été envoyé à l’adresse de réception. Ouvre cet e-mail et clique sur « Activate Form » ; les demandes seront ensuite transmises.')
          : (detail || (languageIsEnglish
              ? 'Your request could not be sent. Please try again or use the direct email button below.'
              : 'Votre demande n’a pas pu être envoyée. Réessaie ou utilise le bouton e-mail direct ci-dessous.'));
        showFormStatus('error',message);
        return;
      }

      bookingForm.reset();
      if(fallbackLink) fallbackLink.href=buildMailto(new FormData(bookingForm));
      showFormStatus('success',languageIsEnglish
        ? 'Your request has been sent successfully. Thank you — we will get back to you by email.'
        : 'Votre demande a bien été envoyée. Merci ! Nous vous répondrons par e-mail.');
    }catch(error){
      console.error('Booking form submission failed:',error);
      showFormStatus('error',languageIsEnglish
        ? 'A network error prevented the request from being sent. Please try again or use the direct email button below.'
        : 'Une erreur de connexion a empêché l’envoi. Réessaie ou utilise le bouton e-mail direct ci-dessous.');
    }finally{
      if(submitButton){
        submitButton.disabled=false;
        submitButton.textContent=originalButtonText;
      }
    }
  });

  bookingForm.addEventListener('input',()=>{
    if(fallbackLink) fallbackLink.href=buildMailto(new FormData(bookingForm));
  });
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
  const words=[...title.querySelectorAll('.feature-word')];

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    title.classList.add('is-live');
    return;
  }

  let timers=[];
  let cycleTimer=null;
  let active=false;

  const clearTimers=()=>{
    timers.forEach(t=>clearTimeout(t));
    timers=[];
    if(cycleTimer){clearInterval(cycleTimer);cycleTimer=null;}
  };

  const resetWords=()=>{
    words.forEach(w=>w.classList.remove('is-off','is-flash'));
  };

  const pulseWord=(word,delay=0)=>{
    timers.push(setTimeout(()=>{
      word.classList.add('is-off');
      timers.push(setTimeout(()=>{
        word.classList.remove('is-off');
        word.classList.add('is-flash');
        timers.push(setTimeout(()=>word.classList.remove('is-flash'),520));
      },420+Math.random()*380));
    },delay));
  };

  const runCycle=()=>{
    if(!active) return;
    resetWords();

    const shuffled=[...words].sort(()=>Math.random()-.5);
    const count=Math.max(2,Math.min(words.length,2+Math.floor(Math.random()*words.length)));

    shuffled.slice(0,count).forEach((word,i)=>{
      pulseWord(word,180+i*(260+Math.random()*260));
    });
  };

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        active=true;
        title.classList.add('is-live');
        runCycle();
        if(!cycleTimer){
          cycleTimer=setInterval(runCycle,3600+Math.random()*1800);
        }
      }else{
        active=false;
        clearTimers();
        resetWords();
      }
    });
  },{threshold:.35});

  observer.observe(title);
});
