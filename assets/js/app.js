/* ================= Clincoo — vanilla, zero deps ================= */
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Toast ---------- */
function toast(msg){
  const t=document.createElement('div');t.className='toast';t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),320)},2800);
}

/* ---------- Preloader ---------- */
window.addEventListener('load',()=>setTimeout(()=>$('#pre').classList.add('done'),reduced?0:350));
setTimeout(()=>{const p=$('#pre');if(p&&!p.classList.contains('done'))p.classList.add('done')},2400);

/* ---------- Scroll progress + navbar ---------- */
const sprog=document.createElement('div');sprog.className='sprog';document.body.appendChild(sprog);
const nav=$('.nav');
addEventListener('scroll',()=>{
  const h=document.documentElement,m=h.scrollHeight-h.clientHeight;
  sprog.style.width=(m>0?h.scrollTop/m*100:0)+'%';
  if(nav)nav.classList.toggle('scrolled',h.scrollTop>10);
},{passive:true});

/* ---------- Mobile menu ---------- */
const mm=$('.m-menu');
if($('#burger')){
  $('#burger').addEventListener('click',()=>mm.classList.toggle('open'));
  $$('a',mm).forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')));
}

/* ---------- Reveal ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

/* ---------- Counters ---------- */
function animateCount(el){
  const to=parseFloat(el.dataset.count||'0'),suf=el.dataset.suffix||'',dec=(el.dataset.dec||'0');
  const fmt=v=>Number(v.toFixed(+dec)).toLocaleString('id-ID')+suf;
  if(reduced){el.textContent=fmt(to);return}
  const t0=performance.now(),dur=1100;
  const step=n=>{const p=Math.min(1,(n-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=fmt(to*e);if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
}
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){animateCount(e.target);cio.unobserve(e.target)}}),{threshold:.4});
$$('[data-count]').forEach(el=>cio.observe(el));

/* ---------- Typing effect ---------- */
const typeEl=$('.typing');
if(typeEl){
  const words=typeEl.dataset.words?JSON.parse(typeEl.dataset.words):['Rekam Medis'];
  if(reduced){typeEl.textContent=words[0]}
  else{
    let wi=0,ci=0,del=false;
    const tick=()=>{
      const w=words[wi];
      ci+=del?-1:1;
      typeEl.textContent=w.slice(0,ci);
      let d=del?38:75;
      if(!del&&ci===w.length){del=true;d=1900}
      else if(del&&ci===0){del=false;wi=(wi+1)%words.length;d=420}
      setTimeout(tick,d);
    };
    tick();
  }
}

/* ---------- FAQ accordion ---------- */
$$('.qa').forEach(qa=>{
  const btn=$('button',qa),ans=$('.ans',qa);
  btn.addEventListener('click',()=>{
    const open=qa.classList.contains('open');
    $$('.qa.open').forEach(o=>{o.classList.remove('open');$('.ans',o).style.maxHeight='0'});
    if(!open){qa.classList.add('open');ans.style.maxHeight=ans.scrollHeight+'px'}
  });
});

/* ---------- Testimonial slider ---------- */
const slides=$$('.tslide');
if(slides.length){
  let idx=0,timer;
  const dots=$('.tdots');
  const render=i=>{
    slides.forEach((s,n)=>s.classList.toggle('on',n===i));
    if(dots)$$('button',dots).forEach((d,n)=>d.classList.toggle('on',n===i));
  };
  const next=()=>{idx=(idx+1)%slides.length;render(idx)};
  const start=()=>{timer=setInterval(next,5200)};
  const stop=()=>clearInterval(timer);
  if(dots)slides.forEach((_,n)=>{
    const b=document.createElement('button');
    b.setAttribute('aria-label','Testimoni '+(n+1));
    b.addEventListener('click',()=>{stop();idx=n;render(idx);start()});
    dots.appendChild(b);
  });
  render(0);
  if(!reduced)start();
  const tc=$('.testi');
  if(tc){tc.addEventListener('mouseenter',stop);tc.addEventListener('mouseleave',()=>{if(!reduced)start()})}
}

/* ---------- Pricing toggle ---------- */
const tgl=$('#planToggle');
if(tgl){
  tgl.addEventListener('click',()=>{
    tgl.classList.toggle('on');
    const yearly=tgl.classList.contains('on');
    $$('.plan .price b').forEach(p=>{
      const m=+p.dataset.m,y=+p.dataset.y;
      p.textContent=(yearly?y:m).toLocaleString('id-ID');
    });
    $('#perLbl').textContent=yearly?'/bulan, ditagih tahunan':'/bulan';
    $$('.tgl-lbl').forEach(l=>l.classList.toggle('dim',!yearly));
  });
}

/* ---------- 3D tilt ---------- */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced){
  const initTilt=el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      el.style.transform='perspective(700px) rotateX('+(-y*5).toFixed(2)+'deg) rotateY('+(x*5).toFixed(2)+'deg)';
    });
    el.addEventListener('mouseleave',()=>{el.style.transform=''});
  };
  $$('.stat,.value,.step').forEach(initTilt);
  const mk=$('.mock-in');
  if(mk)initTilt(mk);
}

/* ---------- Mock bars animasi saat terlihat ---------- */
const mb=$('.m-bars');
if(mb){
  const bio=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      $$('i',mb).forEach((b,n)=>{b.style.height=(35+Math.sin(n*1.3)*10+n*7)%85+'%';setTimeout(()=>b.style.transform='scaleY(1)',n*80)});
      bio.unobserve(mb);
    }
  }),{threshold:.3});
  bio.observe(mb);
}

/* ---------- Form kontak ---------- */
const form=$('#cForm');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const d={nama:$('#cNama').value.trim(),email:$('#cEmail').value.trim(),klinik:$('#cKlinik').value.trim(),pesan:$('#cPesan').value.trim()};
    if(!d.nama||!d.email||!d.pesan){toast('Lengkapi nama, email, dan pesan dulu ya.');return}
    const body=encodeURIComponent('Nama: '+d.nama+'\nEmail: '+d.email+'\nKlinik: '+(d.klinik||'-')+'\n\n'+d.pesan);
    const a=document.createElement('a');
    a.href='mailto:halo@clincoo.id?subject='+encodeURIComponent('Tanya Clincoo — '+d.nama)+'&body='+body;
    a.click();
    toast('Terima kasih! Aplikasi email akan terbuka untuk mengirim pesanmu.');
    form.reset();
  });
}

/* ---------- Year ---------- */
$$('.year').forEach(y=>y.textContent=new Date().getFullYear());
