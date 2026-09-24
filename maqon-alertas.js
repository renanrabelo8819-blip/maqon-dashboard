(()=>{
const DATA='maqon_automation_v1', TASKS='maqon_tasks_v1';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const iso=()=>new Date().toISOString();
const day=v=>v?new Date(v+'T12:00:00'):null;
const today=()=>{let d=new Date();d.setHours(0,0,0,0);return d};
function seed(){
 let db=read(DATA,{leads:[],events:[]}), tasks=read(TASKS,[]);
 if(tasks.length) return tasks;
 (db.leads||[]).forEach(l=>{
   let n=l.negociacao||{}, p=l.projeto||{};
   if(n.proximoContato) tasks.push({id:'T-'+Math.random().toString(36).slice(2,8).toUpperCase(),leadId:l.id,titulo:'Próximo contato comercial',data:n.proximoContato,prioridade:'Alta',status:'Pendente',origem:'Negociação',criadoEm:iso()});
   if(p.prazo) tasks.push({id:'T-'+Math.random().toString(36).slice(2,8).toUpperCase(),leadId:l.id,titulo:'Prazo do projeto',data:p.prazo,prioridade:p.prioridade||'Normal',status:'Pendente',origem:'Pós-venda',criadoEm:iso()});
   if(p.dataEntrega) tasks.push({id:'T-'+Math.random().toString(36).slice(2,8).toUpperCase(),leadId:l.id,titulo:'Entrega prevista',data:p.dataEntrega,prioridade:'Alta',status:'Pendente',origem:'Pós-venda',criadoEm:iso()});
 });
 write(TASKS,tasks); return tasks;
}
function cls(t){
 if(t.status==='Concluída')return'concluida';
 let d=day(t.data),h=today(); if(!d)return''; if(d<h)return'atrasada'; if(+d===+h)return'hoje'; return'';
}
function render(){
 let db=read(DATA,{leads:[],events:[]}), leads=db.leads||[], tasks=seed();
 let pend=tasks.filter(t=>t.status!=='Concluída'), atras=pend.filter(t=>cls(t)==='atrasada'), hj=pend.filter(t=>cls(t)==='hoje'), done=tasks.filter(t=>t.status==='Concluída');
 let opts=leads.map(l=>`<option value="${esc(l.id)}">${esc(l.nome||'Cliente')} — ${esc(l.empresa||'')}</option>`).join('');
 document.getElementById('app').innerHTML=`
 <h1>MAQON — Central de Alertas e Tarefas</h1>
 <p>Controle de próximos contatos, prazos, entregas e pendências comerciais/operacionais.</p>
 <div class=grid>
  <div class="card stat"><small>Pendentes</small><strong>${pend.length}</strong></div>
  <div class="card stat"><small>Vencendo hoje</small><strong>${hj.length}</strong></div>
  <div class="card stat"><small>Atrasadas</small><strong>${atras.length}</strong></div>
  <div class="card stat"><small>Concluídas</small><strong>${done.length}</strong></div>
 </div>
 <div class=card><h2>Nova tarefa / alerta</h2><div class=form>
  <div><label>Cliente</label><select id=lead><option value="">Geral / sem cliente</option>${opts}</select></div>
  <div><label>Tarefa</label><input id=title placeholder="Ex.: Retornar contato"></div>
  <div><label>Data</label><input id=date type=date></div>
  <div><label>Prioridade</label><select id=priority><option>Normal</option><option>Alta</option><option>Urgente</option><option>Baixa</option></select></div>
  <div class=wide><label>Observações</label><textarea id=notes></textarea></div>
  <div class="wide actions"><button id=add>REGISTRAR TAREFA</button><button class=secondary id=refresh>ATUALIZAR ALERTAS</button></div>
 </div></div>
 <div class=card><h2>Tarefas e alertas</h2><div class=tablewrap>${tasks.length?`
 <table><thead><tr><th>Data</th><th>Cliente</th><th>Tarefa</th><th>Origem</th><th>Prioridade</th><th>Status</th><th>Ação</th></tr></thead>
 <tbody>${tasks.slice().sort((a,b)=>(a.status==='Concluída')-(b.status==='Concluída')||String(a.data).localeCompare(String(b.data))).map(t=>{
 let l=leads.find(x=>x.id===t.leadId)||{}; let c=cls(t);
 return `<tr><td>${esc(t.data||'Sem data')}</td><td><b>${esc(l.nome||'Geral')}</b><br><small>${esc(l.empresa||'')}</small></td>
 <td>${esc(t.titulo)}${t.observacoes?`<br><small>${esc(t.observacoes)}</small>`:''}</td><td>${esc(t.origem||'Manual')}</td>
 <td>${esc(t.prioridade||'Normal')}</td><td><span class="badge ${c}">${t.status==='Concluída'?'Concluída':c==='atrasada'?'Atrasada':c==='hoje'?'Hoje':'Pendente'}</span></td>
 <td>${t.status!=='Concluída'?`<button data-done="${esc(t.id)}">CONCLUIR</button>`:'—'}</td></tr>`}).join('')}</tbody></table>`:
 '<div class=empty>Nenhuma tarefa registrada.</div>'}</div></div>`;
 document.getElementById('refresh').onclick=render;
 document.getElementById('add').onclick=()=>{
   let title=document.getElementById('title').value.trim(); if(!title){alert('Informe a tarefa.');return}
   tasks.push({id:'T-'+Date.now(),leadId:document.getElementById('lead').value,titulo:title,data:document.getElementById('date').value,
   prioridade:document.getElementById('priority').value,status:'Pendente',origem:'Manual',observacoes:document.getElementById('notes').value.trim(),criadoEm:iso()});
   write(TASKS,tasks); render();
 };
 document.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{
   let t=tasks.find(x=>x.id===b.dataset.done); if(t){t.status='Concluída';t.concluidoEm=iso();write(TASKS,tasks);
   let d=read(DATA,{leads:[],events:[]});d.events=d.events||[];d.events.push({tipo:'tarefa_concluida',leadId:t.leadId,quando:iso(),status:t.titulo});write(DATA,d);render();}
 });
}
addEventListener('DOMContentLoaded',render);
})();