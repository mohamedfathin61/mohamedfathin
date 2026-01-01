const pageOrder = ["profile","skills","analytics","projects","contact"];

function qs(sel, root=document){return root.querySelector(sel)}
function qsa(sel, root=document){return [...root.querySelectorAll(sel)]}

/* -------------------- Navigation -------------------- */
function showPage(name){
  qsa('.page').forEach(p=>{p.classList.toggle('active', p.id===name)})
  qsa('.menu-item').forEach(b=>b.classList.toggle('active', b.dataset.target===name))
  qsa('.bn-item').forEach(b=>b.classList.toggle('active', b.dataset.target===name))
  qs('.breadcrumbs').textContent = name.charAt(0).toUpperCase()+name.slice(1)
}

qsa('.menu-item').forEach(btn=>{
  btn.addEventListener('click', ()=> showPage(btn.dataset.target))
})
qsa('.bn-item').forEach(btn=>{
  btn.addEventListener('click', ()=> showPage(btn.dataset.target))
})

/* -------------------- Parallax BG -------------------- */
const layers = qsa('#bg-layers .bg-layer')
document.addEventListener('mousemove', (e)=>{
  const x = (e.clientX / window.innerWidth) - 0.5
  const y = (e.clientY / window.innerHeight) - 0.5
  layers.forEach((el,i)=>{
    const speed = (i+1) * 5
    el.style.transform = `translate3d(${x*speed}vw, ${y*speed}vh, 0) rotate(${x*10}deg)`
  })
})

/* -------------------- 3D Tilt on Cards -------------------- */
function applyTilt(el, e){
  const rect = el.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width
  const py = (e.clientY - rect.top) / rect.height
  const rx = (py - 0.5) * -10
  const ry = (px - 0.5) * 12
  el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`
  el.style.boxShadow = `${-ry}px ${Math.abs(rx)}px 30px rgba(11,20,40,0.5)`
}
qsa('[data-tilt]').forEach(el=>{
  el.addEventListener('mousemove', (e)=> applyTilt(el,e))
  el.addEventListener('mouseleave', ()=>{ el.style.transform=''; el.style.boxShadow=''; })
})

/* -------------------- Mobile Swipe Navigation -------------------- */
let touchStartX = 0
document.addEventListener('touchstart',(e)=>{ touchStartX = e.touches[0].clientX })
document.addEventListener('touchend',(e)=>{
  const dx = e.changedTouches[0].clientX - touchStartX
  if(Math.abs(dx) < 50) return
  const active = document.querySelector('.page.active')?.id || 'profile'
  let idx = pageOrder.indexOf(active)
  idx += dx < 0 ? 1 : -1
  if(idx < 0) idx = 0
  if(idx >= pageOrder.length) idx = pageOrder.length -1
  showPage(pageOrder[idx])
})

/* -------------------- Charts (Chart.js) -------------------- */
function createCharts(){
  // Skills vs Progress (horizontal bar)
  const skillsCtx = qs('#skillsChart').getContext('2d')
  new Chart(skillsCtx, {
    type:'bar',
    data:{labels:['Python','JS','React','SQL','ML'], datasets:[{data:[88,76,68,82,72],backgroundColor:['#60a5fa','#8b5cf6','#6ee7ff','#7c3aed','#22c55e'],borderRadius:8}]},
    options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{max:100,ticks:{color:'#bcd6ff'}},y:{ticks:{color:'#bcd6ff'}}},animation:{duration:900,easing:'easeOutQuart'}}
  })

  // Monthly Activity (line)
  const monthlyCtx = qs('#monthlyChart').getContext('2d')
  new Chart(monthlyCtx, {
    type:'line',
    data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],datasets:[{label:'Activity',data:[120,160,240,200,320,420,380,460],fill:true,backgroundColor: 'linear-gradient(180deg,#60a5fa33,#8b5cf633)',borderColor:'#60a5fa',tension:0.3,pointRadius:3}]},
    options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#bcd6ff'}},y:{ticks:{color:'#bcd6ff'}}},animation:{duration:1200}}
  })

  // Engagement (doughnut)
  const engCtx = qs('#engagementChart').getContext('2d')
  new Chart(engCtx, {
    type:'doughnut',
    data:{labels:['Read','Interact','Share'],datasets:[{data:[62,28,10],backgroundColor:['#60a5fa','#8b5cf6','#22c55e']} ]},
    options:{plugins:{legend:{position:'bottom',labels:{color:'#bcd6ff'}}},animation:{duration:800}}
  })
}

window.addEventListener('load', ()=>{
  createCharts()
  // small entry animation
  document.body.style.opacity = 1
})

/* -------------------- Micro-interactions -------------------- */
qsa('.cta').forEach(b=>{
  b.addEventListener('mouseenter', ()=> b.animate([{transform:'translateY(0)'},{transform:'translateY(-3px)'}],{duration:180,fill:'forwards'}))
})

/* Expose showPage globally for debugging */
window.showPage = showPage
