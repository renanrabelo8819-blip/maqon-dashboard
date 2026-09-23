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
const seedEquipment=[['Escavadeira','Caterpillar','320','2024','1250','850000','18.5','42','94','Ativo'],['Pá Carregadeira','Volvo','L90H','2023','2100','780000','15.8','38','92','Ativo'],['Guindaste','SANY','STC250T5','2024','980','1250000','22','55','96','Disponível']];
let equipments=loadEquipment(),editingEquipment=null;
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
function openProposal(i=null){editingProposal=i;proposalOptions();document.querySelector('#proposalDialogTitle').textContent=i===null?'Nova Proposta':'Editar Proposta';if(i===null){pf.reset();const d=new Date();d.setDate(d.getDate()+15);document.querySelector('#proposalValidity').value=d.toISOString().slice(0,10);document.querySelector('#proposalStatus').value='Rascunho'}else{const p=proposals[i],li=leads.findIndex(x=>x[1]===p.client&&x[2]===p.company),ei=equipments.findIndex(x=>equipmentName(x)===p.equipment);document.querySelector('#proposalClient').value=li>=0?li:'';document.querySelector('#proposalEquipment').value=ei>=0?ei:'';document.querySelector('#proposalMode').value=p.mode;document.querySelector('#proposalScope').value=p.scope||'';document.querySelector('#proposalValue').value=p.value;document.querySelector('#proposalValidity').value=p.validity||'';document.querySelector('#proposalTerms').value=p.terms||'';document.querySelector('#proposalStatus').value=p.status}pd.showModal()}

// MAQON — imagem automática obrigatoriamente vinculada à MARCA + MODELO.
function maqonEquipmentImage(eq){
  const brand=String(eq?.[1]||'').trim();
  const model=String(eq?.[2]||'').trim();
  const cat=String(eq?.[0]||'').trim();
  const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ');
  const id=norm(brand+' '+model);

  // Modelos cadastrados: correspondência exata/prioritária.
  const byModel=[
    [/volvo.*l90h|l90h.*volvo/,'maqon-volvo-l90h.jpg'],
    [/caterpillar.*966l|cat.*966l|966l.*caterpillar/,'maqon-caterpillar-966l.jpg'],
    [/komatsu.*pc210|pc210.*komatsu/,'maqon-komatsu-pc210.jpg'],
    [/sany.*stc250t5|stc250t5.*sany/,'maqon-sany-stc250t5.jpg']
  ];
  for(const [rx,file] of byModel) if(rx.test(id)) return file;

  // Fallback por categoria apenas quando ainda não existe foto específica do modelo.
  const k=norm(cat);
  if(k.includes('retroescavadeira')) return 'maqon-retroescavadeira.jpg';
  if(k.includes('motoniveladora')) return 'maqon-motoniveladora.jpg';
  if(k.includes('pa carregadeira')||k.includes('carregadeira')) return 'maqon-pa-carregadeira.jpg';
  if(k.includes('trator de esteiras')) return 'maqon-trator-esteiras.jpg';
  if(k.includes('guindaste')) return 'maqon-guindaste.jpg';
  if(k.includes('munck')) return 'maqon-munck.jpg';
  if(k.includes('caminhao basculante')||k.includes('basculante')) return 'maqon-caminhao-basculante.jpg';
  if(k.includes('caminhao pipa')||k.includes('pipa')) return 'maqon-caminhao-pipa.jpg';
  if(k.includes('escavadeira')) return 'maqon-escavadeira.jpg';
  return 'maqon-outro.jpg';
}

function viewProposal(i){
 const p=proposals[i];if(!p)return;
 const num=proposalNumber(i),eq=equipments.find(x=>equipmentName(x)===p.equipment)||null;
 const category=(eq?.[0]||'Equipamento').trim(),maker=(eq?.[1]||'').trim(),model=(eq?.[2]||'').trim();
 const year=eq?.[3]||'—',hours=eq?.[4]||'—',availability=eq?.[8]||'—';
 const validity=p.validity?new Date(p.validity+'T12:00:00').toLocaleDateString('pt-BR'):'—';
 const issue=new Date().toLocaleDateString('pt-BR');
 const key=category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 let visual='outro',desc='Equipamento selecionado conforme especificações cadastradas na plataforma MAQON.',spec1=['ANO',year],spec2=['HORÍMETRO',hours+' h'],spec3=['DISPONIBILIDADE',availability+'%'];
 if(key.includes('retro')){visual='retroescavadeira';desc='Equipamento versátil para escavação, carregamento e apoio em obras.'}
 else if(key.includes('motonivel')){visual='motoniveladora';desc='Alta produtividade em nivelamento, acabamento e conformação de vias e terrenos.'}
 else if(key.includes('carregadeira')){visual='pa-carregadeira';desc='Alta produtividade para carregamento e movimentação de materiais.'}
 else if(key.includes('trator')){visual='trator-esteiras';desc='Alta tração para terraplenagem, corte, empurramento e preparação de terrenos.'}
 else if(key.includes('guindaste')){visual='guindaste';desc='Solução para içamento, movimentação e posicionamento seguro de cargas.'}
 else if(key.includes('munck')){visual='munck';desc='Solução integrada para transporte, içamento e movimentação de cargas.'}
 else if(key.includes('basculante')){visual='caminhao-basculante';desc='Transporte e descarga eficiente de materiais em obras e terraplenagem.'}
 else if(key.includes('pipa')){visual='caminhao-pipa';desc='Abastecimento, umectação de vias e apoio operacional em obras.'}
 else if(key.includes('escav')){visual='escavadeira';desc='Alta produtividade e confiabilidade para escavação e terraplenagem.'}
 const photo=`maqon-${visual}.jpg`;
 const w=window.open('','_blank');if(!w)return alert('Autorize pop-ups para visualizar a proposta.');
 const html=`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(num)} - MAQON</title><style>
 *{box-sizing:border-box}html,body{margin:0;background:#061015;color:#fff;font-family:Arial,Helvetica,sans-serif}.toolbar{height:58px;background:#0b1820;display:flex;align-items:center;justify-content:space-between;padding:0 22px;position:sticky;top:0;z-index:20}.toolbar button{border:0;border-radius:5px;padding:10px 16px;font-weight:800;cursor:pointer;margin-left:8px}.gold{background:#f4c400}.dark{background:#263740;color:#fff}.stage{padding:14px;display:flex;justify-content:center}.sheet{position:relative;width:min(760px,100%);background:linear-gradient(135deg,#061015 0%,#071115 72%,#171504 100%);box-shadow:0 12px 45px #000;border:1px solid #263942;overflow:hidden}.sheet:after{content:'';position:absolute;right:-45px;bottom:25px;width:150px;height:330px;background:linear-gradient(135deg,transparent 42%,rgba(238,190,0,.16) 43%,rgba(238,190,0,.04) 54%,transparent 55%);pointer-events:none}.hero{height:230px;position:relative;background:linear-gradient(90deg,rgba(2,8,11,.18),rgba(2,8,11,.05)),url('${photo}') center/cover no-repeat;border-bottom:3px solid #e7ba00}.hero:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.32) 0%,transparent 58%,rgba(0,0,0,.4) 100%)}.brand{position:absolute;left:28px;top:24px;z-index:2;font-size:48px;font-weight:900;letter-spacing:2px;text-shadow:0 3px 8px #000}.brand b{color:#f5c400}.tag{position:absolute;left:30px;top:80px;z-index:2;font-size:12px;font-weight:800;text-shadow:0 2px 5px #000}.strategy{position:absolute;left:30px;top:101px;z-index:2;font-size:9px;letter-spacing:1.5px;text-shadow:0 2px 5px #000}.future{position:absolute;left:30px;bottom:22px;z-index:2;font-size:12px;color:#f5c400}.future b{display:block;font-size:17px}.proposal{position:absolute;right:0;top:0;width:178px;height:100%;z-index:2;padding:16px 16px;background:linear-gradient(100deg,rgba(4,11,14,.55),rgba(4,11,14,.98));border-left:2px solid #e7ba00}.proposal h1{font-size:18px;margin:0}.proposal h1 b{display:block;color:#f5c400;font-size:24px}.proposal p{font-size:13px;line-height:1.5}.content{padding:10px 24px 0;background:linear-gradient(135deg,#071015,#0a1212)}.section{display:flex;align-items:center;gap:12px;color:#f5c400;font-size:14px;font-weight:900;margin:8px 0 10px}.section:after{content:"";height:2px;background:#d8ad00;flex:1}.grid2,.grid3{display:grid;gap:9px}.grid2{grid-template-columns:1fr 1fr}.grid3{grid-template-columns:repeat(3,1fr)}.card{background:#0a171d;border:1px solid #344b54;border-radius:7px;padding:9px 11px}.card small{display:block;color:#a9bbc2;font-size:10px;text-transform:uppercase;margin-bottom:5px}.card strong{font-size:12px}.equipment{display:grid;grid-template-columns:48% 52%;gap:11px}.machine{min-height:190px;border:1px solid #8b7100;border-radius:7px;background:url('${photo}') center/cover no-repeat}.eqinfo{background:#09161c;border:1px solid #344b54;border-radius:7px;padding:12px}.eqinfo h2{font-size:15px;margin:5px 0 8px}.eqinfo p{font-size:10px;line-height:1.45}.specs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;border-top:1px solid #31434b;margin-top:15px;padding-top:15px}.spec small{display:block;color:#9fb1b9;font-size:9px}.spec b{font-size:15px}.investment{display:grid;grid-template-columns:49% 51%;gap:11px}.price{border:1px solid #e7ba00;border-left:10px solid #f5c400;border-radius:8px;padding:16px 14px;background:linear-gradient(120deg,#4a3909,#0b1214 72%)}.price small{font-size:14px}.price strong{display:block;color:#f5c400;font-size:30px;margin:9px 0}.conditions .card{margin-bottom:6px}.scope{background:#09161c;border:1px solid #344b54;border-radius:7px;padding:10px 12px;font-size:10px;line-height:1.65}.bottom{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;padding-bottom:16px}.obs{font-size:12px;line-height:1.5}.quote{color:#f5c400;font-size:21px;font-weight:900}.watermark{position:absolute;right:35px;bottom:35px;font-size:120px;font-weight:900;color:rgba(230,185,0,.09)}.footer{border-top:4px solid #e7ba00;background:#050d11;padding:14px 24px 12px}.contacts{display:flex;gap:27px;flex-wrap:wrap;font-size:9px}.closing{display:flex;justify-content:space-between;margin-top:15px;color:#f5c400;font-size:12px;font-weight:800}.maqonFoot{font-size:20px;color:#fff}.maqonFoot b{color:#f5c400}@media(max-width:760px){.proposal{width:180px}.brand{font-size:45px}.grid2,.grid3,.equipment,.investment,.bottom{grid-template-columns:1fr}.machine{min-height:230px}}@media print{.toolbar{display:none}.stage{padding:0}.sheet{width:100%;box-shadow:none;border:0}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}@page{size:A4;margin:0}}
 </style></head><body><header class="toolbar"><b>Proposta Comercial — ${esc(num)}</b><div><button class="dark" onclick="window.close()">Fechar</button><button class="gold" onclick="window.print()">Imprimir / Salvar PDF</button></div></header><main class="stage"><article class="sheet">
 <header class="hero"><div class="brand"><b>M</b>AQON</div><div class="tag">CONSULTORIA EM EQUIPAMENTOS PESADOS</div><div class="strategy">PLANEJAMENTO • DADOS • ESTRATÉGIA • RESULTADOS</div><div class="future">EQUIPAMENTOS QUE<b>CONSTROEM O SEU FUTURO</b></div><aside class="proposal"><h1>PROPOSTA <b>COMERCIAL</b></h1><p>${esc(num)}</p><p>◈ SOLUÇÕES REAIS<br><br>▰ MAIS PRODUTIVIDADE<br><br>⚙ MENOR CUSTO OPERACIONAL<br><br>◆ PARCERIA DE LONGO PRAZO</p></aside></header>
 <div class="content"><div class="section">● CLIENTE E PROPOSTA</div><div class="grid2"><div class="card"><small>Cliente</small><strong>${esc(p.client)}</strong></div><div class="card"><small>Empresa</small><strong>${esc(p.company||'—')}</strong></div></div><div class="grid3" style="margin-top:9px"><div class="card"><small>Modalidade</small><strong>${esc(p.mode)}</strong></div><div class="card"><small>Validade da proposta</small><strong>${esc(validity)}</strong></div><div class="card"><small>Data de emissão</small><strong>${esc(issue)}</strong></div></div>
 <div class="section">● EQUIPAMENTO</div><div class="equipment"><div class="machine"></div><div class="eqinfo"><small>EQUIPAMENTO SELECIONADO</small><h2>${esc(maker)} ${esc(model)} — ${esc(category)}</h2><p>${esc(desc)}</p><div class="specs"><div class="spec"><small>${esc(spec1[0])}</small><b>${esc(spec1[1])}</b></div><div class="spec"><small>${esc(spec2[0])}</small><b>${esc(spec2[1])}</b></div><div class="spec"><small>${esc(spec3[0])}</small><b>${esc(spec3[1])}</b></div></div></div></div>
 <div class="section">● INVESTIMENTO</div><div class="investment"><div class="price"><small>VALOR TOTAL</small><strong>${brl(p.value)}</strong><span>Investimento conforme proposta comercial</span></div><div class="conditions"><div class="card"><small>Condições de pagamento</small><strong>${esc(p.terms||'Conforme negociação')}</strong></div><div class="card"><small>Prazo de entrega</small><strong>A combinar</strong></div><div class="card"><small>Garantia</small><strong>Conforme fabricante / negociação</strong></div></div></div>
 <div class="section">▤ ESCOPO DA PROPOSTA</div><div class="scope">✓ ${esc(p.scope||`Fornecimento de ${maker} ${model}, conforme especificações técnicas cadastradas na plataforma MAQON.`)}<br>✓ Suporte na análise técnica e comparativa com outras opções de mercado.<br>✓ Orientação sobre manutenção preventiva e custo operacional.<br>✓ Acompanhamento no processo de aquisição e entrega do equipamento.<br>✓ Treinamento operacional básico (conforme fabricante).</div>
 <div class="bottom"><div><div class="section">● OBSERVAÇÕES</div><div class="obs">Esta proposta é válida pelo período informado e pode ser ajustada conforme negociação. Valores e condições sujeitos à validação final.</div></div><div><div class="quote">“Máquinas certas,<br>resultados maiores.”</div><p><b>MAQON</b><br><small>CONSULTORIA EM EQUIPAMENTOS PESADOS</small></p></div></div></div>
 <footer class="footer"><div class="contacts"><span>◉ (98) 99123-4567</span><span>✉ contato@maqon.com.br</span><span>in linkedin.com/in/maqon</span><span>● São Luís - MA</span></div><div class="closing"><span>PLANEJANDO HOJE, CONSTRUINDO GRANDES RESULTADOS AMANHÃ.</span><span class="maqonFoot"><b>M</b>AQON</span></div></footer>
 </article></main></body></html>`;
 w.document.open();w.document.write(html);w.document.close();
}
document.querySelector('#newProposal').onclick=()=>openProposal();document.querySelector('#cancelProposal').onclick=()=>pd.close();
pf.addEventListener('submit',e=>{e.preventDefault();const li=Number(document.querySelector('#proposalClient').value),ei=Number(document.querySelector('#proposalEquipment').value);if(!leads[li]||!equipments[ei])return;const l=leads[li],row={client:l[1],company:l[2],equipment:equipmentName(equipments[ei]),mode:document.querySelector('#proposalMode').value,scope:document.querySelector('#proposalScope').value.trim(),value:document.querySelector('#proposalValue').value,validity:document.querySelector('#proposalValidity').value,terms:document.querySelector('#proposalTerms').value.trim(),status:document.querySelector('#proposalStatus').value};if(editingProposal===null)proposals.unshift(row);else proposals[editingProposal]=row;persistProposals();renderProposals();pd.close()});
document.addEventListener('click',e=>{const ed=e.target.closest('[data-pr-edit]'),del=e.target.closest('[data-pr-delete]'),v=e.target.closest('[data-pr-view]');if(ed)openProposal(Number(ed.dataset.prEdit));if(v)viewProposal(Number(v.dataset.prView));if(del){const i=Number(del.dataset.prDelete);if(confirm(`Excluir a proposta ${proposalNumber(i)} de ${proposals[i].client}?`)){proposals.splice(i,1);persistProposals();renderProposals()}}});
document.querySelector('#proposalSearch').oninput=e=>{const q=e.target.value.toLowerCase();renderProposals(proposals.filter(p=>Object.values(p).join(' ').toLowerCase().includes(q)))};
const qp=[...document.querySelectorAll('.quick button')].find(b=>b.textContent.includes('Gerar Proposta'));if(qp)qp.onclick=()=>{go('propostas');openProposal()};
proposalOptions();renderProposals();
