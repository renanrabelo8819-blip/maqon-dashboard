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
 const category=String(eq?.[0]||p.equipment||'Equipamento').trim(),maker=String(eq?.[1]||'').trim(),model=String(eq?.[2]||'').trim();
 const title=[maker,model].filter(Boolean).join(' ')||p.equipment||category;
 const photo=maqonEquipmentImage(eq||[category,maker,model]);
 const norm=x=>String(x||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const kind=norm(category);
 const descriptions=[['retroescavadeira','Equipamento para escavação, carregamento e apoio em obras.'],['motoniveladora','Equipamento para nivelamento, acabamento e conformação de vias.'],['carregadeira','Equipamento para carregamento e movimentação de materiais.'],['guindaste','Equipamento para içamento e movimentação de cargas.'],['munck','Equipamento para transporte e movimentação de cargas.'],['basculante','Equipamento para transporte e descarga de materiais.'],['pipa','Equipamento para abastecimento e umectação de vias.'],['escavadeira','Equipamento para escavação e terraplenagem.'],['trator','Equipamento para terraplenagem e preparação de terrenos.']];
 const description=descriptions.find(x=>kind.includes(x[0]))?.[1]||'Equipamento conforme especificações cadastradas no sistema MAQON.';
 const date=x=>{if(!x)return 'A combinar';const m=String(x).match(/^(\d{4})-(\d\d)-(\d\d)/);return m?`${m[3]}/${m[2]}/${m[1]}`:String(x)};
 const scope=String(p.scope||'Aquisição do equipamento conforme especificação.').split(/\n|;/).map(x=>x.trim()).filter(Boolean).slice(0,5);
 const items=[...scope,'Suporte na análise técnica e comparativa com outras opções de mercado.','Orientação sobre manutenção preventiva e custo operacional.','Acompanhamento no processo de aquisição e entrega do equipamento.','Treinamento operacional básico (conforme fabricante).'].slice(0,5);
 const specs=[['ANO',eq?.[3]||'A confirmar'],['HORÍMETRO',eq?.[4]!=null&&eq?.[4]!==''?eq[4]+' h':'A confirmar'],['DISPONIBILIDADE',eq?.[8]!=null&&eq?.[8]!==''?eq[8]+'%':'A confirmar']];
 const base=new URL('.',document.baseURI).href;
 const w=window.open('','_blank');if(!w)return alert('Autorize pop-ups para visualizar a proposta.');
 const html=`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="${base}"><title>${esc(num)} — MAQON</title><style>
 *{box-sizing:border-box}body{margin:0;background:#dce0e2;color:#111;font-family:Arial,Helvetica,sans-serif}.bar{padding:10px 20px;background:#111b20;color:white;display:flex;justify-content:space-between;align-items:center;gap:12px}.bar button{border:0;border-radius:5px;background:#ffca00;padding:11px 16px;font-weight:bold;cursor:pointer}.stage{padding:18px;display:flex;justify-content:center}.sheet{width:1024px;max-width:100%;background:#fff;box-shadow:0 10px 32px #0003;overflow:hidden}.hero{height:327px;display:grid;grid-template-columns:75% 25%;border-bottom:3px solid #e6af00}.heroArt{position:relative;background:linear-gradient(90deg,#171b1d 0%,#343a3b 56%,transparent 100%)}.heroArt:before{content:'';position:absolute;inset:0;background:url('${esc(photo)}') 72% center/cover no-repeat;filter:brightness(.82)}.brandArt{position:absolute;inset:0 auto 0 0;width:62%;background:url('maqon-proposta-cabecalho-marca.png') left top/100% 100% no-repeat;z-index:1}.heroPanel{background:#fff;border:1px solid #222;padding:16px 13px 8px 22px;overflow:hidden}.heroPanel h1{font-size:24px;line-height:1.03;margin:0 0 8px}.heroPanel h1 em{font-style:normal;color:#d59600}.heroPanel .number{font-weight:900;font-size:18px;margin-bottom:13px;overflow-wrap:anywhere}.benefit{font-size:13px;font-weight:800;display:flex;gap:8px;align-items:center;margin:12px 0;line-height:1.15}.benefit i{background:#ffd54b;border-radius:50%;font-style:normal;display:grid;place-items:center;flex:0 0 29px;height:29px}.heroPanel p{font-weight:800;font-size:12px;line-height:1.35}.body{padding:0 22px}.heading{display:flex;align-items:center;gap:12px;margin:13px 0 10px;font-size:21px;font-weight:900;white-space:nowrap}.heading:before{content:'●';color:#ffc400;background:#111;border-radius:50%;font-size:21px;display:grid;place-items:center;width:39px;height:39px;flex:0 0 39px}.heading:after{content:'';height:3px;background:#eeb900;flex:1}.two,.three,.equip,.invest{display:grid;gap:10px}.two{grid-template-columns:1fr 1fr}.three{grid-template-columns:repeat(3,minmax(0,1fr));margin-top:10px}.box{border:1px solid #49505a;border-radius:8px;min-width:0;padding:12px 14px;background:white;overflow-wrap:anywhere}.box small{display:block;font-size:12px;color:#30343b;margin-bottom:5px}.box strong{font-size:16px}.equip{grid-template-columns:48% minmax(0,52%)}.machine{height:232px;position:relative;border:2px solid #e8b600;border-radius:9px;overflow:hidden;background:#ddd}.machine img{width:100%;height:100%;object-fit:cover;display:block}.machineLabel{position:absolute;top:0;left:0;right:0;padding:10px 12px 17px;color:white;background:linear-gradient(#111e,transparent);text-shadow:0 1px 3px #000}.machineLabel b{display:block;font-size:20px;color:#ffd02a}.machineLabel span{font-size:14px}.eqtext{height:232px;padding:14px 16px;display:flex;flex-direction:column}.eqtext h2{color:#d08d00;font-size:23px;margin:0 0 13px;overflow-wrap:anywhere}.eqtext p{font-size:16px;line-height:1.35;margin:0;flex:1}.specs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid #59636b;padding-top:13px;gap:6px}.specs>div+div{border-left:1px solid #a0a7ad;padding-left:9px}.specs small{font-size:11px}.specs b{font-size:16px;overflow-wrap:anywhere}.invest{grid-template-columns:49% minmax(0,51%)}.price{min-height:191px;border:2px solid #e8b500;border-left:15px solid #ffc400;border-radius:9px;padding:18px 15px;color:white;background:linear-gradient(110deg,#745500,#141716 75%)}.price small{font-size:17px;font-weight:bold}.price strong{display:block;color:#ffcf24;font-size:39px;margin:10px 0;overflow-wrap:anywhere}.price p{font-size:15px;line-height:1.35;margin:0}.terms{display:grid;gap:8px}.terms .box{padding:9px 13px;min-height:55px}.terms small{font-size:11px}.terms strong{font-size:14px}.scope{position:relative;min-height:145px;padding:10px 18px;overflow:hidden}.scope:after{content:'M';position:absolute;right:24px;bottom:-54px;font-weight:900;font-size:180px;color:#e9b73c24;pointer-events:none}.scope ul{list-style:none;margin:0;padding:0;position:relative;z-index:1}.scope li{font-size:14px;line-height:1.4;display:flex;gap:10px;overflow-wrap:anywhere}.scope li:before{content:'✓';background:#ffc400;border-radius:50%;width:20px;height:20px;flex:0 0 20px;text-align:center;font-weight:bold}.bottom{display:grid;grid-template-columns:55% 45%;min-height:118px}.bottom .heading{font-size:19px;margin:10px 0 3px}.bottom p{font-size:13px;line-height:1.4;margin:0 10px 0 60px}.quote{align-self:center;font-size:24px;font-weight:900;color:#d29100;text-align:center}.footer{height:113px;margin-top:8px;border-top:3px solid #e6b000;display:flex;align-items:center;justify-content:space-between;gap:8px;padding-left:25px}.contacts{font-size:14px;display:flex;gap:12px;flex-wrap:wrap;max-width:57%}.footbrand{width:43%;height:110px;background:url('maqon-proposta-rodape-marca.png') right bottom/contain no-repeat}@media print{.bar{display:none}.stage{padding:0}.sheet{box-shadow:none;width:100%}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}@page{size:A4;margin:0}}@media(max-width:650px){.hero{grid-template-columns:1fr;height:auto}.heroArt{height:260px}.heroPanel{padding:12px}.benefit{display:inline-flex;margin:5px 8px}.two,.three,.equip,.invest,.bottom{grid-template-columns:1fr}.eqtext{height:auto;min-height:230px}.footer{height:auto;min-height:110px}.price strong{font-size:28px}}
 </style></head><body><div class="bar"><b>MAQON — ${esc(num)}</b><button onclick="window.print()">Imprimir / Salvar PDF</button></div><main class="stage"><article class="sheet"><header class="hero"><div class="heroArt"><div class="brandArt"></div></div><aside class="heroPanel"><h1>PROPOSTA<br><em>COMERCIAL</em></h1><div class="number">Nº: ${esc(num)}</div><div class="benefit"><i>◆</i>SOLUÇÕES REAIS</div><div class="benefit"><i>▥</i>MAIS PRODUTIVIDADE</div><div class="benefit"><i>⚙</i>MENOR CUSTO OPERACIONAL</div><div class="benefit"><i>✓</i>PARCERIA DE LONGO PRAZO</div><p>DO PLANEJAMENTO À OPERAÇÃO, SEMPRE AO SEU LADO.</p></aside></header><div class="body"><div class="heading">CLIENTE E PROPOSTA</div><div class="two"><div class="box"><small>CLIENTE</small><strong>${esc(p.client)}</strong></div><div class="box"><small>EMPRESA</small><strong>${esc(p.company||'—')}</strong></div></div><div class="three"><div class="box"><small>MODALIDADE</small><strong>${esc(p.mode)}</strong></div><div class="box"><small>VALIDADE DA PROPOSTA</small><strong>${esc(date(p.validity))}</strong></div><div class="box"><small>DATA DE EMISSÃO</small><strong>${esc(new Date().toLocaleDateString('pt-BR'))}</strong></div></div><div class="heading">EQUIPAMENTO</div><div class="equip"><div class="machine"><img src="${esc(photo)}" alt="${esc(title)}" onerror="this.style.display='none'"><div class="machineLabel"><b>${esc(title)}</b><span>${esc(category)}</span></div></div><div class="box eqtext"><h2>${esc(title)} — ${esc(category)}</h2><p>${esc(description)}</p><div class="specs">${specs.map(x=>`<div><small>${esc(x[0])}</small><b>${esc(x[1])}</b></div>`).join('')}</div></div></div><div class="heading">INVESTIMENTO</div><div class="invest"><div class="price"><small>VALOR TOTAL</small><strong>${brl(p.value)}</strong><p>Investimento conforme proposta comercial<br>(Valores sujeitos à alteração)</p></div><div class="terms"><div class="box"><small>CONDIÇÕES DE PAGAMENTO</small><strong>${esc(p.terms||'A combinar')}</strong></div><div class="box"><small>PRAZO DE ENTREGA</small><strong>A combinar</strong></div><div class="box"><small>GARANTIA</small><strong>Conforme fabricante / negociação</strong></div></div></div><div class="heading">ESCOPO DA PROPOSTA</div><div class="box scope"><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="bottom"><div><div class="heading">OBSERVAÇÕES</div><p>Esta proposta é válida pelo período informado e pode ser ajustada conforme negociação. Valores e condições sujeitos à alteração sem aviso prévio.</p></div><div class="quote">“Máquinas certas,<br>resultados maiores.”</div></div></div><footer class="footer"><div class="contacts"><span>☎ (98) 99999-9999</span><span>✉ contato@maqon.com.br</span><span>▣ /maqon</span></div><div class="footbrand" aria-label="Logomarca MAQON"></div></footer></article></main></body></html>`;
 w.document.open();w.document.write(html);w.document.close();
}
document.querySelector('#newProposal').onclick=()=>openProposal();document.querySelector('#cancelProposal').onclick=()=>pd.close();
pf.addEventListener('submit',e=>{e.preventDefault();const li=Number(document.querySelector('#proposalClient').value),ei=Number(document.querySelector('#proposalEquipment').value);if(!leads[li]||!equipments[ei])return;const l=leads[li],row={client:l[1],company:l[2],equipment:equipmentName(equipments[ei]),mode:document.querySelector('#proposalMode').value,scope:document.querySelector('#proposalScope').value.trim(),value:document.querySelector('#proposalValue').value,validity:document.querySelector('#proposalValidity').value,terms:document.querySelector('#proposalTerms').value.trim(),status:document.querySelector('#proposalStatus').value};if(editingProposal===null)proposals.unshift(row);else proposals[editingProposal]=row;persistProposals();renderProposals();pd.close()});
document.addEventListener('click',e=>{const ed=e.target.closest('[data-pr-edit]'),del=e.target.closest('[data-pr-delete]'),v=e.target.closest('[data-pr-view]');if(ed)openProposal(Number(ed.dataset.prEdit));if(v)viewProposal(Number(v.dataset.prView));if(del){const i=Number(del.dataset.prDelete);if(confirm(`Excluir a proposta ${proposalNumber(i)} de ${proposals[i].client}?`)){proposals.splice(i,1);persistProposals();renderProposals()}}});
document.querySelector('#proposalSearch').oninput=e=>{const q=e.target.value.toLowerCase();renderProposals(proposals.filter(p=>Object.values(p).join(' ').toLowerCase().includes(q)))};
const qp=[...document.querySelectorAll('.quick button')].find(b=>b.textContent.includes('Gerar Proposta'));if(qp)qp.onclick=()=>{go('propostas');openProposal()};
proposalOptions();renderProposals();
