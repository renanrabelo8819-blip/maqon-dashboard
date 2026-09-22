const STORAGE_KEY='maqon_leads_v1';
const seedLeads=[
['30/09/2026','Marcos Oliveira','Construtora Vale','(98) 99123-4567','Escavadeira','Novo Lead','Qualificação','Site'],
['30/09/2026','Ana Paula Santos','Transportes Lima','(11) 98765-4321','Munck','Em Atendimento','Diagnóstico','WhatsApp'],
['29/09/2026','Carlos Mendes','Mendes Engenharia','(62) 99876-1234','Motoniveladora','Proposta Enviada','Proposta','LinkedIn'],
['29/09/2026','João Ribeiro','Ribeiro Terraplenagem','(85) 99654-3210','Caminhão Basculante','Negociação','Negociação','Indicação'],
['28/09/2026','Fernanda Costa','Costa Logística','(31) 98987-6543','Retroescavadeira','Cliente','Fechado','Site']
];
let leads=loadLeads(); let editingIndex=null;
function loadLeads(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(x)?x:seedLeads.map(x=>[...x])}catch(e){return seedLeads.map(x=>[...x])}}
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(leads))}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function badge(v){return `<span class="badge" data-status="${esc(v)}">${esc(v)}</span>`}
function renderRecent(){document.querySelector('#leadRows').innerHTML=leads.slice(0,5).map((x,n)=>`<tr><td>${n+1}</td>${x.map((v,i)=>`<td>${i===5?badge(v):esc(v)}</td>`).join('')}<td class="actions"><button type="button" data-edit="${n}" title="Editar">✎</button> <button type="button" data-delete="${n}" title="Excluir">▣</button></td></tr>`).join('')}
function renderAll(a=leads){document.querySelector('#allLeads').innerHTML=a.map(x=>{const idx=leads.indexOf(x);return `<tr><td>${esc(x[1])}</td><td>${esc(x[2])}</td><td>${esc(x[3])}</td><td>${esc(x[4])}</td><td>${badge(x[5])}</td><td>${esc(x[6])}</td><td>${esc(x[7])}</td><td class="actions"><button type="button" data-edit="${idx}" title="Editar">✎</button> <button type="button" data-delete="${idx}" title="Excluir">▣</button></td></tr>`}).join('')}
function updateKPIs(){const total=leads.length, service=leads.filter(x=>x[5]==='Em Atendimento').length, proposal=leads.filter(x=>x[5]==='Proposta Enviada').length, negotiation=leads.filter(x=>x[5]==='Negociação').length, clients=leads.filter(x=>x[5]==='Cliente').length; const set=(id,v)=>{const e=document.querySelector(id);if(e)e.textContent=v};set('#kpiTotal',total);set('#kpiNew',leads.filter(x=>x[5]==='Novo Lead').length);set('#kpiService',service);set('#kpiProposal',proposal);set('#kpiClient',clients);set('#kpiConversion',total?`${(clients/total*100).toFixed(1).replace('.',',')}%`:'0,0%'); const donut=document.querySelector('.donut b');if(donut)donut.textContent=total; const funnelValues=[total,service,proposal,negotiation,clients];document.querySelectorAll('.funnel>div').forEach((row,i)=>{const value=funnelValues[i]??0;const b=row.querySelector('b'),small=row.querySelector('small');if(b)b.textContent=value;if(small)small.textContent=(i===0?(total?100:0):(total?Math.round(value/total*100):0))+'%'})}
function render(){renderRecent();renderAll();updateKPIs()}
render();
const heights=[38,54,48,66,42,72,58,47,78,52,69,43,62,86,55,49,74,44,67,59,82,51,70,91];
heights.forEach(h=>{const b=document.createElement('i');b.style.height=h+'%';document.querySelector('#bars').appendChild(b)});
function go(id){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.querySelector('#'+id).classList.add('active');document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.view===id))}
document.querySelectorAll('.nav').forEach(n=>n.onclick=()=>go(n.dataset.view));document.querySelectorAll('[data-go]').forEach(n=>n.onclick=()=>go(n.dataset.go));
const d=document.querySelector('#leadDialog'),form=document.querySelector('#leadForm');
function openLead(index=null){editingIndex=index;document.querySelector('#leadDialogTitle').textContent=index===null?'Novo Lead':'Editar Lead';if(index===null){form.reset();document.querySelector('#leadStatus').value='Novo Lead';document.querySelector('#leadPhase').value='Qualificação';document.querySelector('#leadOrigin').value='Manual'}else{const x=leads[index];document.querySelector('#name').value=x[1];document.querySelector('#company').value=x[2];document.querySelector('#phone').value=x[3];document.querySelector('#interest').value=x[4];document.querySelector('#leadStatus').value=x[5];document.querySelector('#leadPhase').value=x[6]||'Qualificação';document.querySelector('#leadOrigin').value=x[7]||'Manual'}d.showModal()}
document.querySelector('#newLead').onclick=()=>openLead();document.querySelector('#quickLead').onclick=()=>openLead();document.querySelector('#cancelLead').onclick=()=>d.close();
form.addEventListener('submit',e=>{e.preventDefault();const n=document.querySelector('#name').value.trim();if(!n)return;const status=document.querySelector('#leadStatus').value;const phase=document.querySelector('#leadPhase').value;const origin=document.querySelector('#leadOrigin').value;const row=[new Date().toLocaleDateString('pt-BR'),n,document.querySelector('#company').value.trim(),document.querySelector('#phone').value.trim(),document.querySelector('#interest').value,status,phase,origin];if(editingIndex===null)leads.unshift(row);else leads[editingIndex]=[leads[editingIndex][0],...row.slice(1)];persist();render();d.close();form.reset()});
document.addEventListener('click',e=>{const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');if(edit)openLead(Number(edit.dataset.edit));if(del){const i=Number(del.dataset.delete);if(confirm(`Excluir o lead ${leads[i][1]}?`)){leads.splice(i,1);persist();render()}}});
document.querySelector('#search').oninput=e=>{const q=e.target.value.toLowerCase();renderAll(leads.filter(x=>x.join(' ').toLowerCase().includes(q)))};

const EQUIPMENT_KEY='maqon_equipamentos_v1';
const seedEquipment=[
['Escavadeira Hidráulica','Komatsu','PC210','2024','0','900000','0','0','95','Disponível'],
['Retroescavadeira','John Deere','310L','2024','0','480000','0','0','95','Disponível'],
['Motoniveladora','CASE','845B','2024','0','1250000','0','0','95','Disponível'],
['Pá Carregadeira','Caterpillar','966L','2024','0','1450000','0','0','95','Disponível'],
['Trator de Esteiras','Komatsu','D61EX','2024','0','1600000','0','0','95','Disponível'],
['Guindaste Rodoviário','SANY','STC250T5','2024','0','3800000','0','0','96','Disponível'],
['Munck','IVECO','Tector + Munck','2024','0','520000','0','0','95','Disponível'],
['Caminhão Basculante','Mercedes-Benz','Atego 2730','2024','0','720000','0','0','95','Disponível'],
['Caminhão Pipa','Volkswagen','24.280','2024','0','650000','0','0','95','Disponível'],
['Outros Equipamentos','Genérico','Empilhadeira','2024','0','280000','0','0','95','Disponível']
];
let equipments=loadEquipment(),editingEquipment=null;
(function syncMaqonCatalog(){
 const canon=seedEquipment.map(x=>[...x]);
 canon.forEach(c=>{
   const ix=equipments.findIndex(e=>String(e[0]).toLowerCase()===String(c[0]).toLowerCase()&&String(e[1]).toLowerCase()===String(c[1]).toLowerCase()&&String(e[2]).toLowerCase()===String(c[2]).toLowerCase());
   if(ix>=0) equipments[ix]=c; else equipments.push(c);
 });
 persistEquipment();
})();
function loadEquipment(){try{const x=JSON.parse(localStorage.getItem(EQUIPMENT_KEY));return Array.isArray(x)?x:seedEquipment.map(x=>[...x])}catch(e){return seedEquipment.map(x=>[...x])}}
function persistEquipment(){localStorage.setItem(EQUIPMENT_KEY,JSON.stringify(equipments))}
function brl(v){const n=Number(v);return Number.isFinite(n)?n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}):''}
function renderEquipment(a=equipments){const body=document.querySelector('#equipmentRows');if(!body)return;body.innerHTML=a.map(x=>{const i=equipments.indexOf(x);return `<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td><td>${esc(x[2])}</td><td>${esc(x[3])}</td><td>${esc(x[4])} h</td><td>${brl(x[5])}</td><td>${esc(x[6])} L/h</td><td>${brl(x[7])}/h</td><td>${esc(x[8])}%</td><td>${esc(x[9])}</td><td class="actions"><button type="button" data-eq-edit="${i}" title="Editar">✎</button> <button type="button" data-eq-delete="${i}" title="Excluir">▣</button></td></tr>`}).join('')}
const eqd=document.querySelector('#equipmentDialog'),eqf=document.querySelector('#equipmentForm');
function openEquipment(i=null){editingEquipment=i;document.querySelector('#equipmentDialogTitle').textContent=i===null?'Novo Equipamento':'Editar Equipamento';if(i===null)eqf.reset();else{const x=equipments[i];['eqCategory','eqMaker','eqModel','eqYear','eqHours','eqValue','eqConsumption','eqMaintenance','eqAvailability','eqStatus'].forEach((id,n)=>document.querySelector('#'+id).value=x[n])}eqd.showModal()}
document.querySelector('#newEquipment').onclick=()=>openEquipment();
document.querySelector('#cancelEquipment').onclick=()=>eqd.close();
eqf.addEventListener('submit',e=>{e.preventDefault();const ids=['eqCategory','eqMaker','eqModel','eqYear','eqHours','eqValue','eqConsumption','eqMaintenance','eqAvailability','eqStatus'];const row=ids.map(id=>document.querySelector('#'+id).value.trim());if(!row[1]||!row[2])return;if(editingEquipment===null)equipments.unshift(row);else equipments[editingEquipment]=row;persistEquipment();renderEquipment();populateComparators();analysisOptions();eqd.close();eqf.reset()});
document.addEventListener('click',e=>{const ed=e.target.closest('[data-eq-edit]'),del=e.target.closest('[data-eq-delete]');if(ed)openEquipment(Number(ed.dataset.eqEdit));if(del){const i=Number(del.dataset.eqDelete);if(confirm(`Excluir o equipamento ${equipments[i][1]} ${equipments[i][2]}?`)){equipments.splice(i,1);persistEquipment();renderEquipment();populateComparators();analysisOptions()}}});
document.querySelector('#equipmentSearch').oninput=e=>{const q=e.target.value.toLowerCase();renderEquipment(equipments.filter(x=>x.join(' ').toLowerCase().includes(q)))};
renderEquipment();

function equipmentName(x){return x?`${x[1]} ${x[2]} — ${x[0]}`:''}
function eqNum(v){const n=Number(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0}
function populateComparators(){
 const sels=[1,2,3].map(i=>document.querySelector('#compare'+i)); if(sels.some(s=>!s))return;
 const opts='<option value="">Selecione um equipamento</option>'+equipments.map((x,i)=>`<option value="${i}">${esc(equipmentName(x))}</option>`).join('');
 sels.forEach((s,i)=>{const v=s.value;s.innerHTML=opts;if(v!==''&&equipments[Number(v)])s.value=v;else if(equipments[i])s.value=String(i)});
 renderComparison();
}
function renderComparison(){
 const sels=[1,2,3].map(i=>document.querySelector('#compare'+i)),body=document.querySelector('#compareRows');if(!body||sels.some(s=>!s))return;
 const c=sels.map(s=>s.value===''?null:equipments[Number(s.value)]||null);
 c.forEach((x,i)=>document.querySelector('#compareHead'+(i+1)).textContent=x?equipmentName(x):`Máquina ${i+1}`);
 const rows=[['Categoria',0,v=>v],['Fabricante',1,v=>v],['Modelo',2,v=>v],['Ano',3,v=>v],['Horímetro',4,v=>v+' h'],['Valor de compra',5,v=>brl(v)],['Consumo',6,v=>v+' L/h'],['Manutenção / hora',7,v=>brl(v)+'/h'],['Disponibilidade',8,v=>v+'%'],['Situação',9,v=>v]];
 body.innerHTML=rows.map(([l,k,f])=>`<tr><th>${l}</th>${c.map(x=>`<td>${x?f(esc(x[k])):'—'}</td>`).join('')}</tr>`).join('');
 const v=c.filter(Boolean),s=document.querySelector('#compareSummary');
 if(v.length<2){s.innerHTML='<b>Selecione pelo menos 2 máquinas para gerar o resumo comparativo.</b>';return}
 const min=(k)=>v.reduce((a,b)=>eqNum(a[k])<=eqNum(b[k])?a:b),max=(k)=>v.reduce((a,b)=>eqNum(a[k])>=eqNum(b[k])?a:b);
 const a=min(5),b=min(6),m=min(7),d=max(8);
 s.innerHTML=`<b>Resumo automático:</b> menor valor: <strong>${esc(equipmentName(a))}</strong> (${brl(a[5])}); menor consumo: <strong>${esc(equipmentName(b))}</strong> (${esc(b[6])} L/h); menor manutenção: <strong>${esc(equipmentName(m))}</strong> (${brl(m[7])}/h); maior disponibilidade: <strong>${esc(equipmentName(d))}</strong> (${esc(d[8])}%).`;
}
[1,2,3].forEach(i=>{const s=document.querySelector('#compare'+i);if(s)s.addEventListener('change',renderComparison)});
populateComparators();

// MAQON Engine — Análises Técnicas
function analysisOptions(){
 const s=document.querySelector('#analysisEquipment'); if(!s)return;
 const current=s.value;
 s.innerHTML='<option value="">Selecione um equipamento</option>'+equipments.map((x,i)=>`<option value="${i}">${esc(equipmentName(x))}</option>`).join('');
 if(current!==''&&equipments[Number(current)])s.value=current; else if(equipments.length)s.value='0';
 renderAnalysis();
}
function analysisScore(x){
 const availability=Math.max(0,Math.min(100,eqNum(x[8])));
 const consumption=eqNum(x[6]),maintenance=eqNum(x[7]),hours=eqNum(x[4]),year=eqNum(x[3]);
 const currentYear=new Date().getFullYear();
 const age=Math.max(0,currentYear-year);
 const availabilityScore=availability;
 const consumptionScore=Math.max(0,100-consumption*2.2);
 const maintenanceScore=Math.max(0,100-maintenance*1.15);
 const hoursScore=Math.max(0,100-hours/60);
 const ageScore=Math.max(0,100-age*7);
 return Math.round(availabilityScore*.35+consumptionScore*.20+maintenanceScore*.20+hoursScore*.10+ageScore*.15);
}
function renderAnalysis(){
 const sel=document.querySelector('#analysisEquipment'),rows=document.querySelector('#analysisRows'); if(!sel||!rows)return;
 const x=sel.value===''?null:equipments[Number(sel.value)]||null;
 const cost=document.querySelector('#analysisCost'),avail=document.querySelector('#analysisAvailability'),scoreEl=document.querySelector('#analysisScore'),summary=document.querySelector('#analysisSummary');
 if(!x){cost.textContent=avail.textContent=scoreEl.textContent='—';rows.innerHTML='';summary.textContent='Selecione um equipamento para gerar a análise técnica.';return}
 const fuel=eqNum(x[6]),maint=eqNum(x[7]);
 // custo operacional parcial com os dados hoje cadastrados: consumo físico + manutenção/hora.
 // combustível não é monetizado porque o cadastro atual não possui preço do litro.
 const score=analysisScore(x);
 cost.textContent=brl(maint)+'/h + combustível'; avail.textContent=eqNum(x[8]).toLocaleString('pt-BR')+'%'; scoreEl.textContent=score+'/100';
 const indicators=[['Equipamento',equipmentName(x)],['Ano',x[3]],['Horímetro',x[4]+' h'],['Valor de compra',brl(x[5])],['Consumo',x[6]+' L/h'],['Manutenção por hora',brl(x[7])+'/h'],['Disponibilidade',x[8]+'%'],['Situação',x[9]],['Score MAQON',score+'/100']];
 rows.innerHTML=indicators.map(([a,b])=>`<tr><th>${esc(a)}</th><td>${esc(b)}</td></tr>`).join('');
 let level=score>=85?'desempenho técnico elevado':score>=70?'desempenho técnico consistente':score>=55?'desempenho técnico intermediário':'indicadores que exigem atenção';
 summary.innerHTML=`<b>Resumo técnico automático:</b> ${esc(equipmentName(x))} apresenta <strong>${level}</strong>, com disponibilidade de <strong>${esc(x[8])}%</strong>, consumo informado de <strong>${esc(x[6])} L/h</strong> e manutenção informada de <strong>${brl(x[7])}/h</strong>. O Score MAQON atual é <strong>${score}/100</strong>. <small>O custo/hora total ainda não inclui combustível, depreciação, operador, pneus/rodante, seguros e outros custos porque esses dados ainda não fazem parte do cadastro.</small>`;
}
const analysisSel=document.querySelector('#analysisEquipment'); if(analysisSel)analysisSel.addEventListener('change',renderAnalysis);
const runAnalysis=document.querySelector('#runAnalysis'); if(runAnalysis)runAnalysis.onclick=renderAnalysis;
analysisOptions();



// MAQON - Propostas Comerciais
const PROPOSAL_KEY='maqon_propostas_v1';
let proposals=loadProposals(),editingProposal=null;
function loadProposals(){try{const x=JSON.parse(localStorage.getItem(PROPOSAL_KEY));return Array.isArray(x)?x:[]}catch(e){return []}}
function persistProposals(){localStorage.setItem(PROPOSAL_KEY,JSON.stringify(proposals))}
function proposalNumber(i){return 'PROP-'+String(i+1).padStart(4,'0')}
function renderProposals(a=proposals){const body=document.querySelector('#proposalRows');if(!body)return;body.innerHTML=a.map(p=>{const i=proposals.indexOf(p);return `<tr><td>${proposalNumber(i)}</td><td>${esc(p.client)}</td><td>${esc(p.company)}</td><td>${esc(p.equipment)}</td><td>${esc(p.mode)}</td><td>${brl(p.value)}</td><td>${esc(p.validity||'—')}</td><td>${badge(p.status)}</td><td class="actions"><button data-pr-view="${i}" title="Visualizar">▤</button> <button data-pr-edit="${i}" title="Editar">✎</button> <button data-pr-delete="${i}" title="Excluir">▣</button></td></tr>`}).join('');document.querySelector('#proposalCount').textContent=proposals.length;document.querySelector('#proposalSentCount').textContent=proposals.filter(p=>['Enviada','Em negociação','Aprovada'].includes(p.status)).length}
function proposalOptions(){const c=document.querySelector('#proposalClient'),e=document.querySelector('#proposalEquipment');if(!c||!e)return;c.innerHTML='<option value="">Selecione o cliente / lead</option>'+leads.map((x,i)=>`<option value="${i}">${esc(x[1])}${x[2]?' — '+esc(x[2]):''}</option>`).join('');e.innerHTML='<option value="">Selecione o equipamento</option>'+equipments.map((x,i)=>`<option value="${i}">${esc(equipmentName(x))}</option>`).join('')}
const pd=document.querySelector('#proposalDialog'),pf=document.querySelector('#proposalForm');
const proposalEquipmentSelect=document.querySelector('#proposalEquipment');
if(proposalEquipmentSelect) proposalEquipmentSelect.addEventListener('change',()=>{
 const eq=equipments[Number(proposalEquipmentSelect.value)];
 if(eq){const v=document.querySelector('#proposalValue');if(v)v.value=eq[5]||'';}
});
function openProposal(i=null){editingProposal=i;proposalOptions();document.querySelector('#proposalDialogTitle').textContent=i===null?'Nova Proposta':'Editar Proposta';if(i===null){pf.reset();const d=new Date();d.setDate(d.getDate()+15);document.querySelector('#proposalValidity').value=d.toISOString().slice(0,10);document.querySelector('#proposalStatus').value='Rascunho'}else{const p=proposals[i],li=leads.findIndex(x=>x[1]===p.client&&x[2]===p.company),ei=equipments.findIndex(x=>equipmentName(x)===p.equipment);document.querySelector('#proposalClient').value=li>=0?li:'';document.querySelector('#proposalEquipment').value=ei>=0?ei:'';document.querySelector('#proposalMode').value=p.mode;document.querySelector('#proposalScope').value=p.scope||'';document.querySelector('#proposalValue').value=p.value;document.querySelector('#proposalValidity').value=p.validity||'';document.querySelector('#proposalTerms').value=p.terms||'';document.querySelector('#proposalStatus').value=p.status}pd.showModal()}
function viewProposal(i){
 const p=proposals[i];if(!p)return;
 const num=proposalNumber(i),eq=equipments.find(x=>equipmentName(x)===p.equipment)||null;
 const category=(eq?.[0]||'Equipamento').trim(),maker=(eq?.[1]||'').trim(),model=(eq?.[2]||'').trim();
 const validity=p.validity?new Date(p.validity+'T12:00:00').toLocaleDateString('pt-BR'):'—';
 const issue=new Date().toLocaleDateString('pt-BR');
 const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const key=norm(category+' '+maker+' '+model);
 let visual='outro',desc='Equipamento selecionado conforme especificações cadastradas na plataforma MAQON.';
 let specs=[['ANO',eq?.[3]||'—'],['HORÍMETRO',(eq?.[4]||'—')+' h'],['DISPONIBILIDADE',(eq?.[8]||'—')+'%']];
 let scopeLead=`Aquisição do ${maker} ${model} conforme especificação.`;
 if(key.includes('pc210')||key.includes('escavadeira hidraulica')){
   visual='escavadeira';desc='Escavadeira hidráulica para escavação, carregamento e terraplenagem com alta produtividade.';
   specs=[['POTÊNCIA','165 hp'],['PESO OPERACIONAL','22.000 kg'],['CAÇAMBA','1,0 m³']];
 }else if(key.includes('310l')||key.includes('retroescavadeira')){
   visual='retroescavadeira';desc='Retroescavadeira versátil para escavação, carregamento e apoio em obras.';
   specs=[['POTÊNCIA','100 hp'],['PESO OPERACIONAL','8.200 kg'],['CAÇAMBA','1,0 m³']];
 }else if(key.includes('845b')||key.includes('motoniveladora')){
   visual='motoniveladora';desc='Motoniveladora para nivelamento, acabamento e conformação de vias e terrenos.';
   specs=[['POTÊNCIA','205 hp'],['PESO OPERACIONAL','17.500 kg'],['LÂMINA','4,27 m']];
 }else if(key.includes('966l')||key.includes('pa carregadeira')){
   visual='pa-carregadeira';desc='Pá carregadeira para carregamento e movimentação de materiais com alta produtividade.';
   specs=[['POTÊNCIA','308 hp'],['PESO OPERACIONAL','24.000 kg'],['CAÇAMBA','4,2 m³']];
 }else if(key.includes('d61ex')||key.includes('trator de esteiras')){
   visual='trator-esteiras';desc='Trator de esteiras para terraplenagem, corte, empurramento e preparação de terrenos.';
   specs=[['POTÊNCIA','168 hp'],['PESO OPERACIONAL','18.700 kg'],['LÂMINA','3,81 m']];
 }else if(key.includes('stc250t5')||key.includes('guindaste')){
   visual='guindaste';desc='Guindaste rodoviário para içamento, movimentação e posicionamento seguro de cargas.';
   specs=[['CAPACIDADE DE CARGA','250 t'],['POTÊNCIA','320 hp'],['ALTURA DA LANÇA','47 m']];
 }else if(key.includes('munck')){
   visual='munck';desc='Conjunto para transporte, içamento e movimentação de cargas.';
   specs=[['CAPACIDADE','12 t'],['ALCANCE','13,5 m'],['GIRO','400°']];
 }else if(key.includes('basculante')){
   visual='caminhao-basculante';desc='Caminhão basculante para transporte e descarga eficiente de materiais.';
   specs=[['POTÊNCIA','286 cv'],['CAPACIDADE','16 m³'],['TRAÇÃO','6x4']];
 }else if(key.includes('pipa')){
   visual='caminhao-pipa';desc='Caminhão pipa para abastecimento, umectação de vias e apoio operacional.';
   specs=[['POTÊNCIA','280 cv'],['CAPACIDADE','15.000 L'],['TRAÇÃO','6x2']];
 }
 const photo=`maqon-${visual}.jpg`;
 const scope=[
   p.scope||scopeLead,
   'Suporte na análise técnica e comparativa com outras opções de mercado.',
   'Orientação sobre manutenção preventiva e custo operacional.',
   'Acompanhamento no processo de aquisição e entrega do equipamento.',
   'Treinamento operacional básico (conforme fabricante).'
 ];
 const w=window.open('','_blank');if(!w)return alert('Autorize pop-ups para visualizar a proposta.');
 const html=`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(num)} - MAQON</title><style>
 *{box-sizing:border-box}html,body{margin:0;background:#061015;font-family:Arial,Helvetica,sans-serif}.toolbar{height:56px;background:#071218;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 20px;position:sticky;top:0;z-index:20;border-bottom:1px solid #c9a600}.toolbar button{border:0;border-radius:5px;padding:10px 15px;font-weight:800;cursor:pointer;margin-left:8px}.gold{background:#f4c400}.dark{background:#263740;color:#fff}.stage{padding:14px;display:flex;justify-content:center}.sheet{position:relative;width:min(1024px,100%);aspect-ratio:2/3;background:#061015 url('maqon-proposta-master.png') center top/100% 100% no-repeat;box-shadow:0 12px 45px #000;overflow:hidden}.mask{position:absolute;background:#07161c;z-index:5}.heroClean{left:42.8%;top:0;width:39.1%;height:21.55%;background:transparent}.txt{position:absolute;z-index:7;color:#fff;font-weight:700;line-height:1.15}.photo{position:absolute;z-index:6;background:url('${photo}') center/cover no-repeat}.heroPhoto{left:42.8%;top:0;width:39.1%;height:21.55%}.heroLabel{left:43.5%;top:1.2%;width:37%;padding:5px 8px;background:rgba(4,12,16,.72);font-size:2.15vw;color:#ffd400}.heroLabel small{display:block;color:#fff;font-size:1.45vw;margin-top:2px}.clientMask{left:7.5%;top:24.05%;width:43%;height:4.4%}.companyMask{left:52%;top:24.05%;width:44%;height:4.4%}.metaMask{left:7.5%;top:29.0%;width:88.5%;height:4.5%}.client{left:10%;top:25.35%;font-size:1.65vw}.company{left:59.8%;top:25.35%;font-size:1.65vw}.mode{left:10%;top:30.45%;font-size:1.6vw}.validity{left:43.2%;top:30.45%;font-size:1.6vw}.issue{left:72.8%;top:30.45%;font-size:1.6vw}.equipPhoto{left:3.25%;top:36.9%;width:45.2%;height:17.0%;border-radius:11px}.infoMask{left:50.0%;top:36.8%;width:46.3%;height:17.4%}.eqtitle{left:52.1%;top:38.4%;width:41.5%;font-size:1.85vw;color:#fff}.desc{left:52.1%;top:42.0%;width:41%;font-size:1.13vw;font-weight:400;line-height:1.35}.specs{position:absolute;z-index:7;left:52.1%;top:47.1%;width:41.2%;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;color:#fff}.spec{border-right:1px solid #5a7078;padding-right:6px}.spec:last-child{border:0}.spec small{display:block;font-size:.85vw;color:#c3d0d5;min-height:2.1em}.spec b{display:block;margin-top:6px;font-size:1.45vw}.priceMask{left:9.2%;top:56.9%;width:38.8%;height:10.6%}.value{left:13.4%;top:60.0%;font-size:3.0vw;color:#ffd400;font-weight:900}.priceNote{left:13.4%;top:64.3%;font-size:1.1vw;font-weight:400}.termsMask{left:50.4%;top:56.9%;width:45.2%;height:10.7%}.term{left:59.5%;font-size:1.25vw}.term1{top:59.25%}.term2{top:62.25%}.term3{top:65.2%}.scopeMask{left:7.6%;top:70.6%;width:88.2%;height:11.6%}.scope{left:10.0%;top:72.25%;width:78%;font-size:1.03vw;font-weight:400;line-height:1.55}.scope div:before{content:'✓';color:#ffd400;font-weight:900;margin-right:8px}.numMask{right:3.2%;top:4.7%;width:16%;height:2.4%}.proposalnum{right:4.3%;top:5.35%;font-size:1.2vw}
 @media(min-width:1024px){.heroLabel{font-size:22px}.heroLabel small{font-size:15px}.client,.company{font-size:17px}.mode,.validity,.issue{font-size:16px}.eqtitle{font-size:19px}.desc{font-size:12px}.spec small{font-size:9px}.spec b{font-size:15px}.value{font-size:31px}.priceNote{font-size:11px}.term{font-size:13px}.scope{font-size:10.5px}.proposalnum{font-size:12px}}
 @media print{.toolbar{display:none}.stage{padding:0}.sheet{width:100vw;box-shadow:none}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}@page{size:A4 portrait;margin:0}}
 </style></head><body><header class="toolbar"><b>Proposta Comercial — ${esc(num)}</b><div><button class="dark" onclick="window.close()">Fechar</button><button class="gold" onclick="window.print()">Imprimir / Salvar PDF</button></div></header><main class="stage"><article class="sheet">
 <div class="mask heroClean"></div>
 <div class="mask clientMask"></div><div class="mask companyMask"></div><div class="mask metaMask"></div>
 <div class="txt client">${esc(p.client)}</div><div class="txt company">${esc(p.company||'—')}</div><div class="txt mode">${esc(p.mode)}</div><div class="txt validity">${esc(validity)}</div><div class="txt issue">${esc(issue)}</div>
 <div class="photo equipPhoto"></div><div class="mask infoMask"></div>
 <div class="txt eqtitle">${esc(maker)} ${esc(model)} — ${esc(category)}</div><div class="txt desc">${esc(desc)}</div>
 <div class="specs">${specs.map(s=>`<div class="spec"><small>${esc(s[0])}</small><b>${esc(s[1])}</b></div>`).join('')}</div>
 <div class="mask priceMask"></div><div class="txt value">${brl(p.value||eq?.[5])}</div><div class="txt priceNote">Investimento conforme proposta comercial<br><span style="opacity:.85">(Valores sujeitos a alteração)</span></div>
 <div class="mask termsMask"></div><div class="txt term term1">${esc(p.terms||'A combinar / financiamento')}</div><div class="txt term term2">A combinar</div><div class="txt term term3">Conforme fabricante</div>
 <div class="mask scopeMask"></div><div class="txt scope">${scope.map(x=>`<div>${esc(x)}</div>`).join('')}</div>
 <div class="mask numMask"></div><div class="txt proposalnum">Nº: ${esc(num)}</div>
 </article></main></body></html>`;
 w.document.open();w.document.write(html);w.document.close();
}
document.querySelector('#newProposal').onclick=()=>openProposal();document.querySelector('#cancelProposal').onclick=()=>pd.close();
pf.addEventListener('submit',e=>{e.preventDefault();const li=Number(document.querySelector('#proposalClient').value),ei=Number(document.querySelector('#proposalEquipment').value);if(!leads[li]||!equipments[ei])return;const l=leads[li],row={client:l[1],company:l[2],equipment:equipmentName(equipments[ei]),mode:document.querySelector('#proposalMode').value,scope:document.querySelector('#proposalScope').value.trim(),value:document.querySelector('#proposalValue').value,validity:document.querySelector('#proposalValidity').value,terms:document.querySelector('#proposalTerms').value.trim(),status:document.querySelector('#proposalStatus').value};if(editingProposal===null)proposals.unshift(row);else proposals[editingProposal]=row;persistProposals();renderProposals();pd.close()});
document.addEventListener('click',e=>{const ed=e.target.closest('[data-pr-edit]'),del=e.target.closest('[data-pr-delete]'),v=e.target.closest('[data-pr-view]');if(ed)openProposal(Number(ed.dataset.prEdit));if(v)viewProposal(Number(v.dataset.prView));if(del){const i=Number(del.dataset.prDelete);if(confirm(`Excluir a proposta ${proposalNumber(i)} de ${proposals[i].client}?`)){proposals.splice(i,1);persistProposals();renderProposals()}}});
document.querySelector('#proposalSearch').oninput=e=>{const q=e.target.value.toLowerCase();renderProposals(proposals.filter(p=>Object.values(p).join(' ').toLowerCase().includes(q)))};
const qp=[...document.querySelectorAll('.quick button')].find(b=>b.textContent.includes('Gerar Proposta'));if(qp)qp.onclick=()=>{go('propostas');openProposal()};
proposalOptions();renderProposals();
