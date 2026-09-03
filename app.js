const $ = (s, scope=document) => scope.querySelector(s);
const $$ = (s, scope=document) => [...scope.querySelectorAll(s)];

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
},{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

// Cursor ambience
const glow = $('#cursorGlow');
window.addEventListener('pointermove', e=>{ if(glow){ glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px'; } });

// Counters
const counterIO = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target, target=Number(el.dataset.target||0); let n=0;
    const step=Math.max(1,Math.ceil(target/24));
    const t=setInterval(()=>{ n=Math.min(target,n+step); el.textContent=n+'+'; if(n>=target) clearInterval(t); },55);
    counterIO.unobserve(el);
  });
},{threshold:.7});
$$('.counter').forEach(el=>counterIO.observe(el));

// Trend chart
const ctx = $('#trendChart');
let chart;
const dataSets={
  revenue:{label:'Ingresos (MM)',data:[240,272,301,328,356,395,420,468,501,536,588,642],color:'#36d7ff',fill:'rgba(54,215,255,.10)'},
  conversion:{label:'Conversión (%)',data:[8.2,8.8,9.1,9.5,9.7,10.2,10.8,11.1,11.4,11.9,12.2,12.7],color:'#9a70ff',fill:'rgba(154,112,255,.10)'}
};
function renderChart(key='revenue'){
  if(!ctx || typeof Chart==='undefined') return;
  const d=dataSets[key]; if(chart) chart.destroy();
  chart=new Chart(ctx,{type:'line',data:{labels:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],datasets:[{label:d.label,data:d.data,borderColor:d.color,backgroundColor:d.fill,fill:true,tension:.42,borderWidth:2.3,pointRadius:2.5,pointHoverRadius:6}]},options:{maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false},tooltip:{backgroundColor:'#071526',titleColor:'#fff',bodyColor:'#cfe7f8',borderColor:'rgba(54,215,255,.25)',borderWidth:1}},scales:{x:{grid:{display:false},ticks:{color:'#6f8aa2'}},y:{grid:{color:'rgba(130,175,210,.08)'},ticks:{color:'#6f8aa2'}}}}});
}
renderChart();
$$('[data-chart-switch] button').forEach(btn=>btn.addEventListener('click',()=>{ $$('[data-chart-switch] button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderChart(btn.dataset.series); }));

// Funnel interaction
const funnelDetail=$('#funnelDetail');
$$('#funnel button').forEach((btn,i,all)=>btn.addEventListener('click',()=>{
  all.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const v=Number(btn.dataset.value); const initial=Number(all[0].dataset.value); const rate=((v/initial)*100).toFixed(1);
  funnelDetail.innerHTML=`<strong>${btn.dataset.stage}:</strong> ${v.toLocaleString('es-CO')} registros · ${rate}% sobre los leads iniciales.`;
}));

// Channel interaction
$$('.channel').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.channel').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  $('#channelName').textContent=btn.dataset.channel; $('#channelRoas').textContent=btn.dataset.roas+'x'; $('#channelCpl').textContent=btn.dataset.cpl;
}));

// Interactive map
if(typeof L!=='undefined' && $('#map')){
  const map=L.map('map',{scrollWheelZoom:false,zoomControl:true}).setView([4.7,-74.1],5.35);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap &copy; CARTO'}).addTo(map);
  const cities=[
    {name:'Bogotá',lat:4.711,lng:-74.072,status:'Alta oportunidad',conv:'14.2%',vol:'5.8K',color:'#55e6b0'},
    {name:'Medellín',lat:6.244,lng:-75.581,status:'Alta oportunidad',conv:'13.4%',vol:'3.1K',color:'#55e6b0'},
    {name:'Cali',lat:3.451,lng:-76.532,status:'Media',conv:'10.9%',vol:'2.4K',color:'#ffb75b'},
    {name:'Barranquilla',lat:10.968,lng:-74.781,status:'Estable',conv:'11.6%',vol:'1.9K',color:'#36d7ff'},
    {name:'Bucaramanga',lat:7.119,lng:-73.122,status:'Media',conv:'10.2%',vol:'1.3K',color:'#ffb75b'},
    {name:'Pereira',lat:4.814,lng:-75.694,status:'Estable',conv:'12.1%',vol:'980',color:'#36d7ff'},
    {name:'Cartagena',lat:10.391,lng:-75.479,status:'Media',conv:'9.8%',vol:'1.1K',color:'#ffb75b'}
  ];
  cities.forEach(c=>{
    const marker=L.circleMarker([c.lat,c.lng],{radius:9,color:c.color,weight:2,fillColor:c.color,fillOpacity:.42});
    marker.bindPopup(`<div style="font-family:Inter,sans-serif"><strong>${c.name}</strong><br><span style="color:#8fa8bd">${c.status}</span><br>Conversión: <b>${c.conv}</b><br>Volumen: <b>${c.vol}</b></div>`).addTo(map);
  });
}

$('#year').textContent=new Date().getFullYear();
