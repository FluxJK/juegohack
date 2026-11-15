const test=require('node:test'),assert=require('node:assert/strict'),C=require('../core.js'),maps=require('../maps.js'),story=require('../story.js');
test('all map spawns, exits and story objectives are on connected walkable floors',()=>{
 for(const [id,m] of Object.entries(maps)){
  const start=C.nearest(m,...m.spawn);assert.ok(C.walkable(m,start.x,start.y),id+' spawn');
  for(const [label,target] of [['exit',m.exit],['story',m.story],...m.objects.map(o=>[o[1],[o[2],o[3]]])]){
   const path=C.findPath(m,start,{x:target[0],y:target[1]});assert.ok(path.length,id+' '+label+' path');const end=path.at(-1);assert.ok(Math.hypot(end.x-target[0],end.y-target[1])<70,`${id} ${label} unreachable (distance ${Math.hypot(end.x-target[0],end.y-target[1]).toFixed(1)})`);
   for(const p of path)assert.ok(C.walkable(m,p.x,p.y),id+' unsafe path');
  }
 }
});
test('solid furniture and outside walls block characters on every map',()=>{
 for(const [id,m] of Object.entries(maps)){assert.equal(C.walkable(m,0,0),false,id);for(const r of m.solids)assert.equal(C.walkable(m,r[0]+r[2]/2,r[1]+r[3]/2),false,id+' furniture')}
});
test('swept movement cannot tunnel through furniture at high speed',()=>{
 const map={floors:[[0,0,500,500]],solids:[[200,0,20,500]]};const p=C.move(map,{x:100,y:200},400,0);assert.ok(p.x<=191);assert.ok(C.walkable(map,p.x,p.y));
 const slide=C.move(map,{x:190,y:50},100,100);assert.ok(slide.x<=191);assert.ok(slide.y>100);
});
test('pathfinding goes around tables rather than through them',()=>{
 const m={floors:[[0,0,512,512]],solids:[[200,100,100,300]]},path=C.findPath(m,{x:80,y:240},{x:420,y:240});assert.ok(path.some(p=>p.y<91||p.y>409));assert.ok(Math.hypot(path.at(-1).x-420,path.at(-1).y-240)<20);
});
test('walls block bullets and enemy line of sight',()=>{
 const m={floors:[[0,0,500,500]],solids:[[220,100,30,300]]};assert.equal(C.lineClear(m,{x:100,y:240},{x:400,y:240}),false);assert.equal(C.lineClear(m,{x:100,y:50},{x:400,y:50}),true);
});
test('all combat exits and environmental tools are reachable',()=>{
 for(const [id,m] of Object.entries(maps)){if(!m.battle)continue;const start=C.nearest(m,...m.spawn);for(const t of [m.escape||m.exit,m.env||m.exit,...m.battle]){const end=C.findPath(m,start,{x:t[0],y:t[1]}).at(-1);assert.ok(end&&Math.hypot(end.x-t[0],end.y-t[1])<70,id+' battle target')}}
});
test('archive infiltration and full-building escape share one collision map',()=>{
 const m=maps.archive,entry={x:674,y:400},goal={x:810,y:276};let p=C.findPath(m,entry,goal);assert.ok(Math.hypot(p.at(-1).x-goal.x,p.at(-1).y-goal.y)<30);p=C.findPath(m,goal,{x:m.exit[0],y:m.exit[1]});assert.ok(p.length>30);assert.ok(Math.hypot(p.at(-1).x-m.exit[0],p.at(-1).y-m.exit[1])<30);
});
test('original story routes retain all four endings and all targets exist',()=>{
 assert.deepEqual([story.resolveEndingKey({ruta_bien:true,elena_aliada:true}),story.resolveEndingKey({ruta_bien:true,elena_aliada:false}),story.resolveEndingKey({ruta_bien:false,remordimiento:true}),story.resolveEndingKey({ruta_bien:false,remordimiento:false})],['BUENO_1','TRAGICO_1','BUENO_2','TRAGICO_2']);
 for(const [id,n] of Object.entries(story.STORY)){assert.ok(maps[n.scene==='patrol'?'bridge':n.scene]);if(n.next)assert.ok(story.STORY[n.next]);for(const ch of n.choices||[])assert.ok(story.STORY[ch.next]);if(n.combatId)assert.ok(story.COMBATS[n.combatId]);if(n.endingKey)assert.ok(story.ENDINGS[n.endingKey])}
});
