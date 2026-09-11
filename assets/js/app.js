/* ================= Vylonium AI Builder — vanilla, zero deps ================= */
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

function toast(msg){
  const t=document.createElement('div');t.className='toast';t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),320)},3000);
}

/* preloader */
window.addEventListener('load',()=>setTimeout(()=>$('#pre').classList.add('done'),reduced?0:350));
setTimeout(()=>{const p=$('#pre');if(p&&!p.classList.contains('done'))p.classList.add('done')},2400);

/* scroll progress + pill shadow */
const sprog=document.createElement('div');sprog.className='sprog';document.body.appendChild(sprog);
const pill=$('.pill');
addEventListener('scroll',()=>{
  const h=document.documentElement,m=h.scrollHeight-h.clientHeight;
  sprog.style.width=(m>0?h.scrollTop/m*100:0)+'%';
  if(pill)pill.classList.toggle('scrolled',h.scrollTop>20);
},{passive:true});

/* mobile menu */
const mm=$('.m-menu');
if($('#burger')){
  $('#burger').addEventListener('click',()=>mm.classList.toggle('open'));
  if(mm)$$('a',mm).forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')));
}

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
$$('.reveal').forEach(el=>io.observe(el));

/* counters */
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

/* FAQ accordion */
$$('.qa').forEach(qa=>{
  const btn=$('button',qa),ans=$('.ans',qa);
  btn.addEventListener('click',()=>{
    const open=qa.classList.contains('open');
    $$('.qa.open').forEach(o=>{o.classList.remove('open');$('.ans',o).style.maxHeight='0'});
    if(!open){qa.classList.add('open');ans.style.maxHeight=ans.scrollHeight+'px'}
  });
});

/* pricing toggle */
const tgl=$('#billingToggle');
if(tgl){
  tgl.addEventListener('click',()=>{
    tgl.classList.toggle('on');
    const annual=tgl.classList.contains('on');
    $$('[data-m]').forEach(el=>el.textContent=annual?el.dataset.y:el.dataset.m);
    $$('[data-cycle]').forEach(el=>el.textContent=annual?el.dataset.cycleY:el.dataset.cycleM);
    const lb=$('#lblBulanan'),lt=$('#lblTahunan');
    if(lb&&lt){lb.classList.toggle('dim',annual);lt.classList.toggle('dim',!annual)}
  });
}

/* prompt card */
const prompt=$('#promptCard');
if(prompt){
  const ta=$('#mainPrompt'),go=$('#goBtn'),at=$('.attach');
  /* placeholder mengetik */
  const demos=[
    'Buatkan situs portfolio minimalis yang responsif dan elegan…',
    'Rancang toko online fokus konversi dengan daftar produk terlaris…',
    'Buat dashboard analitik dengan mode gelap dan grafik statistik…',
    'Bangun landing page produk SaaS dengan pricing 3 paket…'
  ];
  if(reduced){ta.placeholder=demos[0]}
  else{
    let di=0,ci=0,del=false;
    const tick=()=>{
      const w=demos[di];ci+=del?-1:1;
      ta.placeholder=w.slice(0,ci);
      let d=del?26:55;
      if(!del&&ci===w.length){del=true;d=2300}
      else if(del&&ci===0){del=false;di=(di+1)%demos.length;d=400}
      setTimeout(tick,d);
    };
    tick();
  }
  /* saran prompt */
  $$('.sugs button').forEach(b=>b.addEventListener('click',()=>{
    ta.value=b.dataset.prompt;ta.focus();
    toast('Prompt terisi — klik "Mulai Buat" saat siap.');
  }));
  /* lampiran */
  if(at){
    $('.attach-btn',at).addEventListener('click',()=>at.classList.toggle('open'));
    $$('.attach-menu button',at).forEach(b=>b.addEventListener('click',()=>{at.classList.remove('open');toast('Unggahan berkas tersedia di versi lengkap.')}));
    document.addEventListener('click',e=>{if(!at.contains(e.target))at.classList.remove('open')});
  }
  /* submit */
  const goTxt=$('#goTxt');
  let busy=false;
  const startBuild=()=>{
    if(busy)return;
    const v=ta.value.trim();
    if(!v){toast('Tulis dulu idemu, sependek apa pun.');ta.focus();return}
    busy=true;go.classList.add('loading');goTxt.textContent='Merakit…';
    setTimeout(()=>{
      go.classList.remove('loading');goTxt.textContent='Mulai Buat';
      busy=false;
      toast('Ide tercatat! Ini demo — builder AI Vylonium segera hadir.');
    },2100);
  };
  go.addEventListener('click',startBuild);
  ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();startBuild()}});
}

/* 3D tilt */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced){
  const initTilt=el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      el.style.transform='perspective(800px) rotateX('+(-y*4).toFixed(2)+'deg) rotateY('+(x*4).toFixed(2)+'deg)';
    });
    el.addEventListener('mouseleave',()=>{el.style.transform=''});
  };
  $$('.stat').forEach(initTilt);
  const mk=$('.mock');
  if(mk)initTilt(mk);
}

/* form kontak */
const form=$('#cForm');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const d={nama:$('#cNama').value.trim(),email:$('#cEmail').value.trim(),pesan:$('#cPesan').value.trim()};
    if(!d.nama||!d.email||!d.pesan){toast('Lengkapi nama, email, dan pesan dulu ya.');return}
    const body=encodeURIComponent('Nama: '+d.nama+'\nEmail: '+d.email+'\n\n'+d.pesan);
    const a=document.createElement('a');
    a.href='mailto:hello@vylonium.dev?subject='+encodeURIComponent('Tanya Vylonium — '+d.nama)+'&body='+body;
    a.click();
    toast('Terima kasih! Aplikasi email akan terbuka untuk mengirim pesanmu.');
    form.reset();
  });
}

/* year */
$$('.year').forEach(y=>y.textContent=new Date().getFullYear());
