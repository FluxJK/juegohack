const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
async function setup(){
 const elements={},events={},storage=new Map();
 const drawing=new Proxy({createRadialGradient:()=>({addColorStop(){}})}, {get(t,k){return t[k]||(()=>{})}});
 const element=()=>({hidden:true,open:false,style:{},dataset:{},children:[],textContent:'',innerHTML:'',classList:{add(){},remove(){},toggle(){}},listeners:{},getContext:()=>drawing,getBoundingClientRect:()=>({left:0,top:70,width:1000,height:650}),addEventListener(k,f){this.listeners[k]=f},append(b){this.children.push(b)},replaceChildren(){this.children=[]},showModal(){this.open=true},close(){this.open=false;this.listeners.close?.()},focus(){},click(){this.onclick?.()},setPointerCapture(){}});
 const el=id=>elements[id]??=element();
 const win={devicePixelRatio:1,addEventListener(k,f){events[k]=f}};
 class Image{width=1280;height=1232;set src(v){this._src=v;this.onload?.()}}
 const sandbox={window:win,Image,console,URLSearchParams,location:{search:'?qa=1'},document:{hidden:false,body:{dataset:{},classList:{add(){},remove(){}}},getElementById:el,createElement:element,querySelectorAll:()=>[],addEventListener(){}},localStorage:{setItem(k,v){storage.set(k,v)},getItem(k){return storage.get(k)||null}},requestAnimationFrame(){},setInterval(){return 1},performance:{now:()=>0}};
 vm.createContext(sandbox);
 for(const f of ['core.js','maps.js','story.js','activities.js']){vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),sandbox);Object.assign(sandbox,win)}
 sandbox.GameAudio={start(){},pause(){},mood(){},voice(){},effect(){},toggle(){return false}};
 vm.runInContext(fs.readFileSync(path.join(root,'game.js'),'utf8'),sandbox);await new Promise(r=>setImmediate(r));
 return {g:win.__GAME_QA__,el,events,storage,C:sandbox.WorldCore,maps:sandbox.GameMaps,story:sandbox.GameStory};
}
function complete(g,el){for(let n=0;n<30&&g.S.mode==='vn';n++){g.continueTalk();if(g.S.mode==='vn'&&el('modal').open)el('modal-actions').children.at(-1).click()}}
test('every story node enters dialogue and returns to its intended mode',async()=>{
 const {g,story,el}=await setup();
 for(const [id,node] of Object.entries(story.STORY)){g.loadNode(id);const before={x:g.S.player.x,y:g.S.player.y};g.startTalk(true);assert.equal(g.S.mode,'vn',id);complete(g,el);
  if(node.choices){assert.equal(g.S.mode,'vn');assert.equal(el('choices').children.length,2);el('choices').children[0].click()}
  assert.equal(g.S.mode,node.combatId?'combat':node.stealth?'stealth':'explore',id);
  if(!node.stealth){assert.equal(g.S.player.x,before.x,id);assert.equal(g.S.player.y,before.y,id)}
  el('modal').close();
 }
});
test('all maps render and keyboard movement stays on legal floors',async()=>{
 const {g,maps,events,C}=await setup();for(const id of Object.keys(maps)){g.setupMap(id);g.render();for(const key of ['w','a','s','d']){events.keydown({key,repeat:false,preventDefault(){}});for(let i=0;i<90;i++){g.tick(.016);assert.ok(C.walkable(maps[id],g.S.player.x,g.S.player.y),id)}events.keyup({key});}g.render()}
});
test('conversations freeze movement and resume from same position',async()=>{
 const {g,events,el}=await setup();g.loadNode('N1_COCINA');const p={...g.S.player};g.startTalk(true);events.keydown({key:'d',repeat:false,preventDefault(){}});for(let i=0;i<100;i++)g.tick(.016);assert.equal(g.S.player.x,p.x);assert.equal(g.S.player.y,p.y);el('close-talk').click();assert.equal(g.S.mode,'explore');assert.equal(g.S.player.x,p.x);
});
test('dialogues keep both participants in their slots as the speaker changes',async()=>{
 const {g,el}=await setup();
 g.loadNode('N4_FINAL_BUENO_1');g.startTalk(true);
 const cast=()=>el('fullbody-cast').innerHTML;
 assert.match(cast(),/bust active.*Retrato de Elena/s);
 assert.match(cast(),/Retrato de Elena.*Retrato de Comandante Vargas/s);
 g.continueTalk();g.continueTalk();
 assert.match(cast(),/bust" data-facing="right".*Retrato de Elena.*bust active" data-facing="left".*Retrato de Comandante Vargas/s);
 assert.equal((cast().match(/<feMorphology/g)||[]).length,2);
});
test('every combat can end by surrender without spending ammo',async()=>{
 const {g,story,C,maps}=await setup();for(const id of Object.keys(story.COMBATS)){g.loadNode(Object.keys(story.STORY).find(k=>story.STORY[k].combatId===id));g.startCombat(id);for(let i=0;i<20&&g.S.mode==='combat';i++){const e=g.S.battle.enemies.find(e=>!e.surrendered);Object.assign(g.S.player,C.nearest(maps[g.S.map],e.x+30,e.y));g.S.time+=2;g.negotiate()}assert.equal(g.S.mode,'explore',id);assert.equal(g.S.ammo,12,id);assert.ok(g.S.pending,id)}
});
test('stealth evidence leads to a real exit and then the next story node',async()=>{
 const {g,maps}=await setup();g.loadNode('N2A_ARCHIVO_INTRO');g.startStealth();Object.assign(g.S.player,{x:810,y:276});g.interact({kind:'goal',x:810,y:276});assert.equal(g.S.mode,'escape');assert.ok(g.S.notes.archivo);Object.assign(g.S.player,{x:maps.archive.exit[0],y:maps.archive.exit[1]});g.interact(g.interactions().find(o=>o.kind==='escape'));assert.equal(g.S.mode,'explore');assert.equal(g.S.pending,'N2A_LLAMADA');
});
test('first-person notes open, persist and return to the map',async()=>{
 const {g,el}=await setup();g.setupMap('bridge');const item=g.S.objects.find(o=>o.kind==='inspect');Object.assign(g.S.player,{x:item.x,y:item.y});g.interact(item);assert.equal(g.S.mode,'inspect');assert.equal(el('inspect-items').children.length,3);el('inspect-items').children[0].click();assert.equal(el('modal').open,true);assert.equal(Object.keys(g.S.notes).length,1);el('modal').close();el('leave-inspect').click();assert.equal(g.S.mode,'explore');g.save();g.S.notes={};assert.equal(g.restore(),true);assert.equal(Object.keys(g.S.notes).length,1);
});
test('the family photo is available both on the letter and in the kitchen',async()=>{
 const {g,el}=await setup();g.loadNode('N1_COCINA');
 for(const kind of ['letter','photo']){
  const item=g.interactions().find(o=>o.kind===kind);
  Object.assign(g.S.player,{x:item.x,y:item.y});g.interact(item);
  assert.equal(el('modal').dataset.document,kind);
  assert.equal(el('family-photo').hidden,false);
  assert.equal(g.S.notes[item.id].photo,true);
  el('modal').close();
 }
 el('journal').click();assert.equal(el('family-photo').hidden,true);
 el('modal-actions').children[0].click();
 assert.equal(el('family-photo').hidden,false);
});
test('equipment uses the existing radio activity and combat ammo',async()=>{
 const {g,el}=await setup();
 el('equipment').click();el('modal-actions').children[0].click();
 assert.equal(el('modal').dataset.document,'radio');
 el('modal-actions').children[0].click();el('modal-actions').children[0].click();
 assert.equal(g.S.activities.dispatch,true);el('modal').close();
 g.loadNode('N1_MINIMERCADO_INTRO');g.startCombat('COMBAT_1');
 el('equipment').click();el('modal-actions').children[1].click();assert.equal(g.S.ammo,11);
 el('equipment').click();el('modal-actions').children[2].click();assert.equal(g.S.ammo,12);
});
test('save in combat safely resumes before the encounter, not after a skipped encounter',async()=>{
 const {g}=await setup();g.loadNode('N1_MINIMERCADO_INTRO');g.S.done=true;g.startCombat('COMBAT_1');g.save();assert.ok(g.restore());assert.equal(g.S.mode,'explore');assert.equal(g.S.done,false);assert.equal(g.S.pending,null);assert.equal(g.S.battle,null);assert.equal(g.S.guard,null);
});
test('modal pauses battle damage, guard movement, and walking',async()=>{
 const {g,el}=await setup();g.loadNode('N1_MINIMERCADO_INTRO');g.startCombat('COMBAT_1');el('pause').click();const hp=g.S.health,pos={...g.S.player},enemy=JSON.stringify(g.S.battle.enemies);for(let i=0;i<300;i++)g.tick(.016);assert.equal(g.S.health,hp);assert.equal(g.S.player.x,pos.x);assert.equal(JSON.stringify(g.S.battle.enemies),enemy);
});
test('all four routes play from prologue to their expected ending',async()=>{
 for(const [first,second,ending] of [[0,0,'BUENO_1'],[0,1,'TRAGICO_1'],[1,0,'BUENO_2'],[1,1,'TRAGICO_2']]){
  const {g,el,story,C,maps}=await setup();let choices=0,finished=false;
  for(let step=0;step<40;step++){
   const node=story.STORY[g.S.node];g.startTalk(true);complete(g,el);
   if(node.choices){el('choices').children[choices++===0?first:second].click()}
   if(g.S.mode==='combat'){
    for(let n=0;n<30&&g.S.mode==='combat';n++){const e=g.S.battle.enemies.find(e=>!e.surrendered);Object.assign(g.S.player,C.nearest(maps[g.S.map],e.x+30,e.y));g.S.time+=2;g.negotiate()}
    assert.equal(g.S.mode,'explore');
   }
   if(g.S.mode==='stealth'){Object.assign(g.S.player,{x:810,y:276});g.interact({kind:'goal',x:810,y:276});const m=maps[g.S.map];Object.assign(g.S.player,{x:m.exit[0],y:m.exit[1]});g.interact(g.interactions().find(o=>o.kind==='escape'))}
   if(node.endingKey){assert.equal(node.endingKey,ending);assert.equal(el('modal').open,true);finished=true;break}
   assert.ok(g.S.pending,`${g.S.node} has no next step`);g.loadNode(g.S.pending);
  }
  assert.ok(finished,ending+' never reached');
 }
});
test('activity UI commits once, persists resources and applies radio support',async()=>{
 const {g,el}=await setup();g.loadNode('PROLOGO');g.startActivity('radio');el('modal-actions').children[0].click();assert.equal(g.S.activities.dispatch,true);el('modal').close();g.save();g.S.activities.dispatch=false;g.restore();assert.equal(g.S.activities.dispatch,true);g.loadNode('N2A_EMBOSCADA_INTRO');g.startCombat('COMBAT_2');assert.ok(g.S.battle.enemies.every(e=>e.pressure===86));
});
test('out-of-budget choices are disabled in the activity UI',async()=>{const {g,el}=await setup();g.loadNode('N1_COCINA');g.S.activities.money=0;g.startActivity('resources');assert.ok(el('modal-actions').children.every(b=>b.disabled))});



