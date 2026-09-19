const leads=[
['30/09/2026','Marcos Oliveira','Construtora Vale','(98) 99123-4567','Escavadeira','Novo Lead','Qualificação','Site'],
['30/09/2026','Ana Paula Santos','Transportes Lima','(11) 98765-4321','Munck','Em Atendimento','Diagnóstico','WhatsApp'],
['29/09/2026','Carlos Mendes','Mendes Engenharia','(62) 99876-1234','Motoniveladora','Proposta Enviada','Proposta','LinkedIn'],
['29/09/2026','João Ribeiro','Ribeiro Terraplenagem','(85) 99654-3210','Caminhão Basculante','Negociação','Negociação','Indicação'],
['28/09/2026','Fernanda Costa','Costa Logística','(31) 98987-6543','Retroescavadeira','Cliente','Fechado','Site']
];
function badge(v){return `<span class="badge" data-status="${v}">${v}</span>`}
function renderRecent(){
 document.querySelector('#leadRows').innerHTML=leads.slice(0,5).map((x,n)=>`<tr><td>${n+1}</td>${x.map((v,i)=>`<td>${i===5?badge(v):v}</td>`).join('')}<td class="actions">◉ ✎ ▣</td></tr>`).join('');
}
function renderAll(a=leads){
 document.querySelector('#allLeads').innerHTML=a.map(x=>`<tr><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td><td>${x[4]}</td><td>${badge(x[5])}</td></tr>`).join('');
}
renderRecent(); renderAll();
const heights=[38,54,48,66,42,72,58,47,78,52,69,43,62,86,55,49,74,44,67,59,82,51,70,91];
heights.forEach(h=>{const b=document.createElement('i');b.style.height=h+'%';document.querySelector('#bars').appendChild(b)});
function go(id){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.querySelector('#'+id).classList.add('active');document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.view===id))}
document.querySelectorAll('.nav').forEach(n=>n.onclick=()=>go(n.dataset.view));
document.querySelectorAll('[data-go]').forEach(n=>n.onclick=()=>go(n.dataset.go));
const d=document.querySelector('#leadDialog');
document.querySelector('#newLead').onclick=()=>d.showModal();
document.querySelector('#quickLead').onclick=()=>d.showModal();
document.querySelector('#save').onclick=()=>{
 const n=document.querySelector('#name').value.trim(); if(!n)return;
 leads.unshift(['Hoje',n,document.querySelector('#company').value,document.querySelector('#phone').value,document.querySelector('#interest').value,'Novo Lead','Qualificação','Manual']);
 renderRecent(); renderAll();
};
document.querySelector('#search').oninput=e=>{const q=e.target.value.toLowerCase();renderAll(leads.filter(x=>x.join(' ').toLowerCase().includes(q)))};
