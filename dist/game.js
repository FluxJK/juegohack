/* A Debt in Uniform · exploration and dialogue engine. */
(() => {'use strict';
const $=id=>document.getElementById(id),C=WorldCore,MAPS=GameMaps,{STORY,COMBATS,ENDINGS,HOTSPOTS,resolveEndingKey}=GameStory,A=GameAudio;
const Activities=GameActivities;
const canvas=$('world'),ctx=canvas.getContext('2d'),keys=new Set(),assets={},saveKey='sombras.hybrid.v2';
const names={mateo:'Mateo Morales',elena:'Elena',sofia:'Sofía',vargas:'Comandante Vargas',julian:'Julián',marcos:'Marcos Mendoza',sicario:'Hombre de Los Sombra',guard:'Guardia',narrador:'Narración'};
const basicEquipment=['pistola','radio','camara'];
const S={mode:'title',map:'bridge',node:'PROLOGO',done:false,pending:null,player:{x:380,y:650,dir:'down',radius:9},npcs:[],objects:[],path:[],autoTarget:null,health:100,ammo:12,notes:{},inventory:[...basicEquipment],flags:{ruta_bien:null,elena_aliada:null,remordimiento:null},lights:{},line:0,lines:[],storyTalk:false,completed:[],activities:Activities.initial(),battle:null,guard:null,alert:0,time:0,debug:false,steps:0,paused:false,conversationOpen:false};
let width=900,height=650,zoom=1,cam={x:512,y:650},prev=0,toastUntil=0,lastFire=-10,lastTalk=-10,bullets=[],effects=[],typeElapsed=0,typeIndex=0,fullText='',selected=null,introT=0,escapeTime=90,guardPathClock=0,moveActive=false;
function loadImage(key,url){return new Promise(resolve=>{const im=new Image();im.onload=()=>{assets[key]=im;resolve(true)};im.onerror=()=>{console.warn('Recurso no disponible:',url);resolve(false)};im.src=url})}
const loading=Promise.all([...Object.entries(MAPS).filter(([,m])=>m.file).map(([id,m])=>loadImage(id,'assets/scenes/'+m.file)),...Array.from({length:17},(_,i)=>loadImage('frame'+i,`assets/frames/sprite_${String(i).padStart(2,'0')}.png`)),loadImage('npcs','assets/art/chibi-atlas.png')]);
function resize(){const rect=canvas.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);const d=Math.min(window.devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);zoom=Math.max(.65,Math.min(1.25,height/570))}
window.addEventListener('resize',resize);resize();
function mode(m){document.body.classList.remove('speaking');S.mode=m;document.body.dataset.mode=m;$('visual-novel').hidden=m!=='vn';$('first-person').hidden=m!=='inspect';$('title').hidden=m!=='title';$('combat-controls').hidden=m!=='combat';$('danger-wrap').hidden=!['stealth','escape'].includes(m);$('interaction').hidden=true;keys.clear();S.path=[];S.autoTarget=null;A.ambience?.(S.map);A.mood(m);syncAudio();updateHUD()}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');toastUntil=S.time+4.5}
const sceneMap=scene=>scene==='patrol'?'bridge':scene;
function safePoint(p){return C.nearest(MAPS[S.map],p[0],p[1])}
function actorBlocks(){return S.npcs.map(a=>({...a,radius:12})).concat(S.battle?.enemies.filter(e=>!e.surrendered).map(a=>({...a,radius:12}))||[])}
function setupMap(id,position){
 S.battle=null;S.guard=null;S.map=id;const map=MAPS[id],p=safePoint(position||map.spawn);Object.assign(S.player,p);S.npcs=map.npcs.map(([id,x,y],i)=>({id,...C.nearest(map,x,y),dir:'down',phase:i}));
 S.objects=map.objects.map(([kind,label,x,y,text,photo],i)=>({id:id+'-'+i,kind,label,x,y,text,photo}));
 if(id==='kitchen'){
  const photo=HOTSPOTS.kitchen.find(item=>item.id==='foto_familiar');
  const position=C.nearest(map,274,555);
  S.objects.push({id:photo.id,kind:'photo',label:photo.label,text:photo.text,...position});
 }
 const anchor=C.nearest(map,...map.story);S.objects.push({id:id+'-cajon',kind:'container',label:'Revisar cajón / pertenencias',x:anchor.x+25,y:anchor.y,text:'Anotación del lugar: conserva las pruebas y evita poner a otros en peligro.'});if(map.rest)S.objects.push({id:id+'-asiento',kind:'seat',label:'Sentarse y descansar',x:anchor.x-30,y:anchor.y});S.path=[];bullets=[];effects=[];cam={...S.player};mode('explore');updateHUD();
}
function loadNode(id,keepPosition=false){if(!STORY[id])return;S.node=id;S.done=false;S.pending=null;S.line=0;S.savedStoryLine=null;S.battle=null;S.guard=null;const map=sceneMap(STORY[id].scene);setupMap(map,keepPosition&&S.map===map?[S.player.x,S.player.y]:undefined);save();}
function storyTarget(){
 if(S.done||sceneMap(STORY[S.node].scene)!==S.map)return null;
 const node=STORY[S.node],speaker=node.lines.find(l=>!['mateo','narrador'].includes(l.speaker))?.speaker;
 const pos=S.node==='PROLOGO'?[320,680]:MAPS[S.map].story;
 const p=C.nearest(MAPS[S.map],...pos);
 if(speaker){let npc=S.npcs.find(n=>n.id===speaker);if(!npc){npc={id:speaker,...p,dir:'down'};S.npcs.push(npc)}return{...npc,kind:'story',label:'Hablar con '+names[speaker]}}
 return{...p,id:'story',kind:'story',label:S.node==='PROLOGO'?'Escuchar la radio policial':'Continuar la investigación'};
}
function objective() {
 const node=STORY[S.node];
 if(S.mode==='combat')return 'Consigue la rendición o llega a la salida verde.';
 if(S.mode==='stealth')return 'Fotografía el registro en el cajón del Archivo B.';
 if(S.mode==='escape')return `Sal con las pruebas por el marcador verde. ${Math.ceil(escapeTime)} s.`;
 if(sceneMap(node.scene)!==S.map)return `Usa la salida verde para volver a ${MAPS[sceneMap(node.scene)].name}.`;
 if(S.done)return S.pending?'Ve a la salida verde y elige «Seguir la historia».':'Puedes seguir explorando el distrito.';
 return S.node==='PROLOGO'?'Escucha la radio en el marcador dorado.':`Marcador dorado · ${storyTarget()?.label||'Investigar el lugar'}.`;
}
function environmentNote(item) {
 if(item)return `E · ${item.label}`;
 if(S.mode==='combat')return 'Usa cobertura, distracciones o el equipo.';
 if(S.mode==='stealth')return 'Usa el interruptor y escóndete tras los estantes.';
 if(S.mode==='escape')return 'Usa los obstáculos y corre con Shift.';
 return 'Acércate a personas, cartas u objetos. Pulsa E para usarlos.';
}
function updateHUD() {
 const node=STORY[S.node];
 $('activity-menu').hidden=!(S.mode==='explore'&&S.done&&sceneMap(node.scene)===S.map&&(Activities.nodes[S.node]||[]).length);
 $('chapter').textContent=node.chapter;$('location').textContent=MAPS[S.map].name;$('clock').textContent=node.time;
 $('health').textContent='● '+Math.ceil(S.health);$('ammo').textContent=S.ammo+' / 12';
 $('count').textContent=Object.keys(S.notes).length;
 $('objective').textContent=objective();
 $('mode-help').textContent=environmentNote();
 $('danger').value=S.alert;$('danger-label').textContent=S.mode==='escape'?'PERSECUCIÓN':'DETECCIÓN';
}
function save(){try{localStorage.setItem(saveKey,JSON.stringify({version:2,node:S.node,map:S.map,player:S.player,flags:S.flags,done:['combat','stealth','escape'].includes(S.mode)?false:S.done,pending:['combat','stealth','escape'].includes(S.mode)?null:S.pending,health:S.health,ammo:S.ammo,notes:S.notes,inventory:S.inventory,completed:S.completed,activities:S.activities,lights:S.lights}));$('continue-game').disabled=false}catch{}}
function restore(){try{const d=JSON.parse(localStorage.getItem(saveKey));if(d?.version!==2||!STORY[d.node]||!MAPS[d.map])return false;Object.assign(S,{node:d.node,flags:d.flags,done:!!d.done,pending:d.pending,health:Math.max(25,Number(d.health)||100),ammo:d.ammo??12,notes:d.notes||{},inventory:[...new Set([...basicEquipment,...(d.inventory||[])])],completed:d.completed||[],activities:d.activities||Activities.initial(),lights:d.lights||{}});setupMap(d.map,[d.player.x,d.player.y]);toast('Partida recuperada. La historia continúa.');return true}catch{return false}}
function newGame(){S.flags={ruta_bien:null,elena_aliada:null,remordimiento:null};S.health=100;S.ammo=12;S.notes={};S.inventory=[...basicEquipment];S.completed=[];S.activities=Activities.initial();S.lights={};loadNode('PROLOGO');$('intro').hidden=false;introT=0;A.start();}
function syncAudio(){const dialog=$('modal');A.pause(S.paused||document.hidden||S.mode==='title'||(dialog.open&&dialog.dataset.music!=='keep'))}
function modal(title,text,buttons=[],options={}) {
 const {kind='',photo=false,keepMusic=false,kicker='EXPEDIENTE PERSONAL'}=options;
 const panel=$('modal');
 panel.dataset.music=keepMusic?'keep':'';
 if(kind)panel.dataset.document=kind;else delete panel.dataset.document;
 panel.classList.toggle('paper',['paper','letter','photo'].includes(kind));
 keys.clear();S.path=[];
 $('modal-kicker').textContent=kicker;$('modal-title').textContent=title;$('modal-body').textContent=text;
 $('family-photo').hidden=!photo;$('modal-actions').replaceChildren();
 for(const [label,fn] of buttons){
  const button=document.createElement('button');button.textContent=label;
  button.onclick=()=>{panel.close();syncAudio();fn()};
  $('modal-actions').append(button);
 }
 if(!panel.open)panel.showModal();
 $('modal-title').focus({preventScroll:true});
 panel.scrollTop=0;
 syncAudio();
}
$('modal').addEventListener('close',()=>{keys.clear();if(!$('modal').open&&$('modal').dataset.music==='keep'){delete $('modal').dataset.music;A.mood(S.mode)}syncAudio();canvas.focus({preventScroll:true})});$('close-modal').onclick=()=>$('modal').close();
function displayNote(note) {
 const {title,text,kind='paper',photo=false}=note;
 modal(title,text,[],{kind,photo,keepMusic:true,kicker:({letter:'CORRESPONDENCIA PERSONAL',photo:'ÁLBUM FAMILIAR'})[kind]||'EXPEDIENTE PERSONAL'});
}
function addNote(id,title,text,details={}) {
 const fresh=!S.notes[id];
 if(fresh){
  document.body.classList.remove('pickup');void $('app').offsetWidth;document.body.classList.add('pickup');A.effect('paper');
 }
 const note={title,text,...details};
 S.notes[id]=note;updateHUD();save();displayNote(note);
}
function journal() {
 const notes=Object.values(S.notes);
 const text=notes.map((note,i)=>`${String(i+1).padStart(2,'0')} · ${note.title}\n${note.text}`).join('\n\n');
 const originals=notes.filter(note=>['letter','photo'].includes(note.kind)).map(note=>['Ver · '+note.title,()=>displayNote(note)]);
 modal('Expediente de la noche',text||'Aún no tienes documentos. Busca los marcadores de papel y examínalos de cerca.',originals);
}
function useRadio(logId) {
 const {label,text}=HOTSPOTS.patrol[0];
 const support=S.activities.used.includes('PROLOGO:radio');
 const message=S.node==='PROLOGO'?text:support?(S.activities.dispatch?'Central: el apoyo del distrito está disponible.':'Central: mantén el canal abierto. Tu patrulla sigue en el sector.'):'Central: canal abierto. Informa si necesitas apoyo.';
 if(logId){S.notes[logId]={title:label,text:message};updateHUD();save();}
 const actions=S.node==='PROLOGO'?[['Asignar apoyo',()=>startActivity('radio')]]:[];
 A.effect('radio');
 modal(label,message,actions,{kind:'radio',keepMusic:true,kicker:'COMUNICACIONES DEL DISTRITO'});
}
function equipment() {
 if(S.mode==='title'||!$('intro').hidden)return;
 const items=[`Pistola de servicio · ${S.ammo} / 12`,'Radio policial','Cámara del teléfono'];
 if(S.inventory.includes('archivo'))items.push('Llave del Archivo B');
 const actions=[['Sintonizar radio',()=>useRadio()]];
 if(S.mode==='combat')actions.push(['Disparo de advertencia',()=>shoot()],['Recargar',reload]);
 if(S.mode==='stealth')actions.push(['Fotografiar el registro',()=>interact(interactions().find(item=>item.kind==='goal'))]);
 modal('Equipo de Mateo',items.join('\n'),actions,{keepMusic:true,kicker:'EQUIPO DE SERVICIO'});
}
function travelMenu(){if(!['explore'].includes(S.mode)){toast('Termina este encuentro antes de cambiar de zona.');return}const map=MAPS[S.map],near=Math.hypot(S.player.x-map.exit[0],S.player.y-map.exit[1])<85;
 const buttons=[];if(near&&S.pending)buttons.push(['Seguir la historia →',()=>loadNode(S.pending,true)]);
 if(near)for(const [id,m] of Object.entries(MAPS))if(id!==S.map)buttons.push([m.name,()=>{setupMap(id);save()}]);
 modal('Distrito Norte',near?'Elige un destino. Las conversaciones y decisiones de la historia se conservan.':`Estás en ${map.name}. Acércate a la salida verde para viajar. La historia está en ${MAPS[sceneMap(STORY[S.node].scene)].name}.`,buttons);
}
function background(el,index){el.style.backgroundPosition=`${index%3*50}% ${Math.floor(index/3)*50}%`}
const busts={
 mateo:[68,7,242,339,222,112,15], vargas:[372,5,248,341,523,111,16],
 elena:[674,23,240,332,820,119,17], julian:[964,12,252,340,1121,109,17],
 marcos:[1263,14,253,337,1417,111,15], sofia:[1568,221,211,286,1703,307,17],
 sicario:[1830,10,264,343,1989,114,15]
};
function portrait(id,active,index) {
 const [x,y,width,height,mouthX,mouthY,lip]=busts[id==='guard'?'vargas':id]||busts.mateo;
 const edge='portrait-edge-'+id;
 return `<div class="bust${active?" active":""}" data-facing="${index===0?"right":"left"}"><svg viewBox="${x} ${y} ${width} ${height}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Retrato de ${names[id]||id}">
  <defs><filter id="${edge}" filterUnits="userSpaceOnUse" x="${x}" y="${y}" width="${width}" height="${height}">
   <feComponentTransfer in="SourceAlpha" result="solid"><feFuncA type="discrete" tableValues="0 0 0 1"/></feComponentTransfer>
   <feMorphology in="solid" operator="erode" radius="1" result="edge"/>
   <feComposite in="SourceGraphic" in2="edge" operator="in"/>
  </filter></defs>
  <image href="assets/art/pixel-portraits.png" width="2170" height="725" filter="url(#${edge})"/>
  <g transform="translate(${mouthX} ${mouthY})">
   <rect class="mouth-frame" x="${-lip/2}" y="-2" width="${lip}" height="6" fill="#442324"/>
   <g class="mouth-frame mouth-wide"><path d="M${-lip/2} -3h${lip}v6h-3v3h${6-lip}v-3h-3z" fill="#382024"/><rect x="-3" y="2" width="7" height="2" fill="#c57561"/></g>
  </g>
 </svg></div>`;
}
function conversationCast() {
 const speakers=[...new Set(S.lines.map(line=>line.speaker).filter(id=>id!=="narrador"))];
 const left=speakers.length<2||speakers.includes("mateo")?"mateo":speakers[0];
 const right=S.lines.slice(0,S.line+1).findLast(({speaker})=>speaker!==left&&speaker!=="narrador")?.speaker
   ||speakers.find(id=>id!==left);
 return right?[left,right]:[left];
}
function activityPanel(){const node=S.node,types=Activities.nodes[node]||[],buttons=[];for(const type of types){const used=S.activities.used.includes(node+':'+type);buttons.push([(used?'✓ ':'▶ ')+Activities.config[type].title,()=>startActivity(type)])}modal('Acciones en este lugar',Activities.summary(S.activities),buttons)}
function startActivity(type){const key=S.node+':'+type,cfg=Activities.config[type];if(!cfg||!(Activities.nodes[S.node]||[]).includes(type))return;if(S.activities.used.includes(key)){modal(cfg.title,S.activities.results[key]+'\n\n'+Activities.summary(S.activities));return}modal(cfg.title,cfg.prompt+'\n\n'+Activities.summary(S.activities),cfg.options.map((o,i)=>[o[0],()=>{const result=Activities.resolve(S.activities,S.node,type,i);if(!result){toast('No tienes suficientes recursos.');startActivity(type);return}S.health=Math.min(100,S.health+result.health);A.effect('success');save();updateHUD();modal('Resultado · '+cfg.title,result.text+'\n\n'+Activities.summary(S.activities),[['Volver a las acciones',activityPanel],['Seguir explorando',()=>{}]])}]));const buttons=$('modal-actions').children;cfg.options.forEach((o,i)=>{if(!Activities.allowed(S.activities,type,i)){buttons[i].disabled=true;buttons[i].title='Recursos insuficientes'}})}
function availableActivities(){return (Activities.nodes[S.node]||[]).filter(t=>!S.activities.used.includes(S.node+':'+t))}
function startTalk(story=false,npc){if(!story)S.savedStoryLine=S.line;else if(Number.isInteger(S.savedStoryLine)){S.line=S.savedStoryLine;S.savedStoryLine=null}S.storyTalk=story;S.returnPosition={x:S.player.x,y:S.player.y,map:S.map};S.lines=story?STORY[S.node].lines:[{speaker:npc.id,name:names[npc.id],dir:'(La conversación se queda entre ustedes)',text:({elena:'Hay cosas que pesan menos cuando se comparten, Mateo. Cuando termines, vuelve a casa.',sofia:'¡Papá! ¿Ya viste mi dibujo? Te guardé un sitio en la mesa.',vargas:'El distrito está inquieto. Haz tu ronda y recuerda que cada decisión tiene consecuencias.',julian:S.map==='cafe'?'Siéntate un momento. Un café y una conversación también pueden cambiar una noche.':'Si necesitas ayuda, aquí tienes mi taller. No dejes que nadie decida por ti.',marcos:'Esta ciudad tiene muchos caminos, agente. Elige bien por cuál vas a caminar.',guard:'El archivo está en la sala del fondo. Mantén despejados los pasillos.'})[npc.id]||'Es una noche larga. Cuida a los tuyos.'}];if(!story)S.line=0;mode('vn');showLine()}
function showLine(){const l=S.lines[S.line];if(!l)return;fullText=l.text;document.body.classList.remove('pickup');document.body.classList.add('speaking');typeIndex=0;typeElapsed=0;$('dialogue-text').textContent='';$('speaker').textContent=l.name||names[l.speaker];$('direction').textContent=l.dir||'';$('choices').replaceChildren();$('vn-place').textContent=MAPS[S.map].name+' · '+STORY[S.node].time;background($('vn-background'),MAPS[S.map].bg);
 $('fullbody-cast').innerHTML=conversationCast().map((id,index)=>portrait(id,id===l.speaker,index)).join('');$('close-talk').hidden=false;
}
function showChoices(){document.body.classList.remove('speaking');const node=STORY[S.node];if(S.storyTalk&&S.line===S.lines.length-1&&node.choices){for(const ch of node.choices){const b=document.createElement('button');b.textContent=ch.label;b.onclick=()=>{ch.effect(S.flags);finishTalk(ch.next)};$('choices').append(b)}$('dialogue-tip').textContent='ELIGE QUÉ HACER';}else $('dialogue-tip').textContent=S.line===S.lines.length-1?'ESPACIO · Terminar y volver al mapa':'ESPACIO o clic · Continuar'}
function continueTalk(){if(S.mode!=='vn')return;if(typeIndex<fullText.length){typeIndex=fullText.length;$('dialogue-text').textContent=fullText;showChoices();return}if(S.storyTalk&&S.line===S.lines.length-1&&STORY[S.node].choices)return;if(S.line<S.lines.length-1){S.line++;showLine()}else finishTalk()}
function finishTalk(next,skipActivities=false){if(S.storyTalk&&!skipActivities&&availableActivities().length){modal('Antes de continuar', 'Puedes resolver las interacciones de este lugar. Sus consecuencias se guardan en tu partida.',[['Abrir interacciones',activityPanel],['Continuar conversación',()=>finishTalk(next,true)]]);return}const node=STORY[S.node],story=S.storyTalk;if(!story&&Number.isInteger(S.savedStoryLine)){S.line=S.savedStoryLine;S.savedStoryLine=null}mode('explore');if(story){S.done=true;S.line=0;if(next||node.next)S.pending=next||node.next;else if(node.combatId){startCombat(node.combatId);return}else if(node.stealth){startStealth();return}else if(node.endingKey){showEnding(node.endingKey);return}save();toast('Conversación terminada. Puedes explorar y continuar por la salida.')}updateHUD();}
$('close-talk').onclick=()=>{mode('explore');toast('Vuelves al mapa. Habla otra vez para retomar la conversación.')};$('dialogue-text').onclick=continueTalk;
function inspect(obj){S.inspectObject=obj;mode('inspect');background($('inspect-background'),MAPS[S.map].bg);$('inspect-title').textContent=obj.label;$('inspect-items').replaceChildren();
 const entries=S.map==='bridge'?HOTSPOTS.patrol.slice(0,3).map(item=>[item.label,item.text,item.id]):
  S.map==='cafe'?[['Beber café','Te tomas un respiro. Aún queda mucho por hacer.']]:
  S.map==='school'?[['Carta de Sofía','Papá,\n\nYo sé que vendrás por mí. No te olvides de respirar cuando tengas miedo. Guarda nuestra foto.\n\nCon cariño,\nSofía','letter']]:
  [['Examinar de cerca','Una anotación conecta los pagos de Los Sombra con el Muelle 7. Haz una copia y conserva el original.']];
 for(const [title,text,kind] of entries){
  const button=document.createElement('button');button.textContent=title;
  button.onclick=()=>{
   if(kind==='radio_policial'){useRadio(obj.id+'-radio');return;}
   if(S.map==='cafe'){S.health=100;updateHUD();}
   addNote(obj.id+title,title,text,kind==='letter'?{kind,photo:true}:{});
  };
  $('inspect-items').append(button);
 }
}
$('leave-inspect').onclick=()=>{mode('explore');save()};
function interactions(){const map=MAPS[S.map],items=[...S.objects,...S.npcs.map(n=>({...n,kind:'npc',label:'Hablar con '+names[n.id]}))];const target=storyTarget();if(target&&S.mode==='explore')items.unshift(target);
 if(S.mode==='stealth')items.unshift({id:'goal',kind:'goal',label:'Fotografiar el registro',x:810,y:276});
 if(S.mode==='escape')items.unshift({id:'escape',kind:'escape',label:'Salir con las pruebas',x:map.exit[0],y:map.exit[1]});
 if(S.mode==='combat'){items.length=0;items.push({id:'env',kind:'env',label:'Usar el entorno: distraer',x:(map.env||[600,600])[0],y:(map.env||[600,600])[1]},{id:'flee',kind:'flee',label:'Retirarse a una zona segura',x:(map.escape||map.exit)[0],y:(map.escape||map.exit)[1]});}
 if(S.mode==='explore'&&S.done&&sceneMap(STORY[S.node].scene)===S.map)for(const type of Activities.nodes[S.node]||[])items.push({id:'activity-'+type,kind:'activity',type,label:Activities.config[type].title,...C.nearest(map,...map.story)});
 if(S.mode==='explore')items.push({id:'exit',kind:'exit',label:S.pending?'Continuar historia / salir':'Viajar por el distrito',x:map.exit[0],y:map.exit[1]});
 return items;
}
function nearestInteraction(){const p=S.player;return interactions().filter(o=>Math.hypot(p.x-o.x,p.y-o.y)<70).sort((a,b)=>(a.kind==='story'?-100:Math.hypot(p.x-a.x,p.y-a.y))-(b.kind==='story'?-100:Math.hypot(p.x-b.x,p.y-b.y)))[0]}
function interact(obj=nearestInteraction()){if(!obj||!['explore','stealth','escape','combat'].includes(S.mode))return;S.path=[];S.autoTarget=null;if(Math.hypot(obj.x-S.player.x,obj.y-S.player.y)>74){toast('Acércate un poco más.');return}
 switch(obj.kind){case 'activity':activityPanel();break;case 'story':if(S.node==='PROLOGO')A.effect('radio');startTalk(true);break;case 'npc':startTalk(false,obj);break;case 'note':addNote(obj.id,obj.label,obj.text);break;case 'letter':case 'photo':addNote(obj.id,obj.label,obj.text,{kind:obj.kind,photo:obj.photo||obj.kind==='photo'});break;case 'inspect':inspect(obj);break;case 'exit':travelMenu();break;case 'light':S.lights[S.map]=!S.lights[S.map];A.effect('switch');save();toast(S.lights[S.map]?'Luz apagada. Es más difícil que te detecten.':'Luz encendida.');break;case 'seat':S.health=Math.min(100,S.health+5);updateHUD();save();toast('Descansas un momento. +5 de energía.');break;case 'container':addNote(obj.id,obj.label,obj.text||'Entre los objetos encuentras un recibo con destino al Muelle 7.');break;case 'key':A.effect('key');if(!S.inventory.includes('archivo'))S.inventory.push('archivo');addNote('llave','Llave del Archivo B','Una pequeña llave de latón. Abre el cajón del archivo de la comisaría.');break;case 'locked':if(S.mode==='stealth'){recoverEvidence();break}if(S.inventory.includes('archivo'))addNote('registro','Registro reservado','Muelle 7. Autorización: Vargas. Conserva una copia y busca a alguien de confianza.');else toast('Está cerrado. Busca el llavero en la recepción de la comisaría.');break;case 'goal':recoverEvidence();break;case 'escape':finishEscape();break;case 'flee':finishCombat(true);break;case 'env':if(!S.battle.envUsed){S.battle.envUsed=true;S.battle.enemies.forEach(e=>{e.pressure-=40;e.stun=5;if(e.pressure<=0)e.surrendered=true});A.effect('alert');toast('El entorno distrae a los adversarios. Aprovecha para hablar o moverte.');checkCombat()}else toast('Ya utilizaste este elemento del entorno.');break}
}
function startCombat(id){const def=COMBATS[id],map=MAPS[sceneMap(def.scene)];if(S.map!==sceneMap(def.scene))setupMap(sceneMap(def.scene));S.npcs=[];S.ammo=12;S.health=Math.max(60,S.health);lastFire=-10;lastTalk=-10;
 S.battle={id,envUsed:false,enemies:def.enemies.map((e,i)=>({id:'enemy'+i,char:i===0?'marcos':'guard',...C.nearest(map,...(map.battle?.[i]||[590+i*50,650])),dir:'down',pressure:S.activities.dispatch&&id==='COMBAT_2'?86:100,stun:0,surrendered:false,path:[],think:0,windup:0,cooldown:1.5+i*.7}))};mode('combat');toast('Puedes negociar, distraer, protegerte tras los muebles o llegar a la salida verde.');}
function checkCombat(){if(S.battle&&S.battle.enemies.every(e=>e.surrendered))finishCombat(false)}
function finishCombat(fled){const id=S.battle.id,next=COMBATS[id].nextNode;S.completed.push(id);S.battle=null;bullets=[];S.pending=next==='N4_ROUTER'?({BUENO_1:'N4_FINAL_BUENO_1',TRAGICO_1:'N4_COMBAT_OSCURAS',BUENO_2:'N4_FINAL_BUENO_2',TRAGICO_2:'N4_DUELO_RAPIDO'})[resolveEndingKey(S.flags)]:next;S.done=true;mode('explore');toast(fled?'Te pones a salvo. Puedes continuar la historia desde la salida.':'Los adversarios se rinden. Nadie ha muerto en el enfrentamiento.');save()}
function negotiate(){if(S.mode!=='combat'||S.time-lastTalk<1.2)return;lastTalk=S.time;const target=S.battle.enemies.filter(e=>!e.surrendered&&Math.hypot(e.x-S.player.x,e.y-S.player.y)<250&&C.lineClear(MAPS[S.map],S.player,e)).sort((a,b)=>Math.hypot(a.x-S.player.x,a.y-S.player.y)-Math.hypot(b.x-S.player.x,b.y-S.player.y))[0];if(!target){toast('Acércate a un adversario visible para que pueda escucharte.');return}target.pressure-=35;target.stun=2;target.surrendered=target.pressure<=0;A.voice('mateo',0);toast(target.surrendered?'Baja el arma y se entrega.':'«Nadie tiene que salir herido. Baja el arma.»');checkCombat()}
function isCover(){return MAPS[S.map].solids.some(r=>{const x=Math.max(r[0],Math.min(S.player.x,r[0]+r[2])),y=Math.max(r[1],Math.min(S.player.y,r[1]+r[3]));return Math.hypot(x-S.player.x,y-S.player.y)<35})}
function shoot(target){if(S.mode!=='combat'||S.time-lastFire<.55)return;if(S.ammo<=0){toast('Sin munición. Recarga con R.');return}lastFire=S.time;S.ammo--;const e=target||S.battle.enemies.filter(e=>!e.surrendered&&C.lineClear(MAPS[S.map],S.player,e)).sort((a,b)=>Math.hypot(a.x-S.player.x,a.y-S.player.y)-Math.hypot(b.x-S.player.x,b.y-S.player.y))[0];const angle=e?Math.atan2(e.y-S.player.y,e.x-S.player.x):({down:Math.PI/2,up:-Math.PI/2,left:Math.PI,right:0})[S.player.dir];bullets.push({x:S.player.x,y:S.player.y,vx:Math.cos(angle)*460,vy:Math.sin(angle)*460,owner:'player',life:1.5});A.effect('shot');effects.push({x:S.player.x,y:S.player.y,t:.15});updateHUD()}
function reload(){if(S.mode==='combat'){S.ammo=12;lastFire=S.time+.7;toast('Recargando: busca cobertura.');A.effect('inspect');updateHUD()}}
function cover(){if(S.mode==='combat')toast(isCover()?'El mueble te protege. Mantén C para reducir el daño y moverte despacio.':'Busca una mesa, un contenedor o una estantería para cubrirte.')}
function startStealth(){if(S.map!=='archive')setupMap('archive');S.npcs=[];Object.assign(S.player,C.nearest(MAPS.archive,674,400));S.guard={id:'guard',x:768,y:282,dir:'left',path:[],waypoint:0};S.alert=0;guardPathClock=0;mode('stealth');toast('Las paredes bloquean la visión. Apaga la luz o espera a que el guardia mire hacia otro lado.');}
function recoverEvidence(){if(S.mode!=='stealth')return;A.effect('camera');S.notes.archivo={title:'Transferencias del Muelle 7',text:'Vargas autorizó los pagos a Marcos Mendoza. Las fotografías quedan guardadas en el expediente.'};escapeTime=90;S.alert=0;S.escapeStart={...S.player};mode('escape');toast('Pruebas fotografiadas. Ahora sal del edificio sin que te alcance el guardia.');updateHUD()}
function finishEscape(){S.guard=null;S.done=true;S.pending='N2A_LLAMADA';mode('explore');toast('Has salido con las pruebas. Continúa desde la salida cuando estés listo.');save()}
function showEnding(key){mode('explore');const e=ENDINGS[key];S.pending=null;A.mood(e.type==='good'?'hope':'loss');modal(e.title,e.body+'\n\n'+e.reflection+'\n\nBALANCE DE LA RUTA\n'+Activities.summary(S.activities),[['Volver a empezar',newGame],['Seguir explorando',()=>{S.done=true;updateHUD()}]],{keepMusic:true});save()}
function failEncounter(){bullets=[];modal('Un paso atrás para seguir','Mateo se pone a cubierto. Puedes reintentar desde el inicio del encuentro conservando tus decisiones.',[['Reintentar',()=>{S.health=100;if(S.mode==='combat')startCombat(S.battle.id);else startStealth()}]]);S.health=25;updateHUD()}
function updateBattle(dt){const map=MAPS[S.map];for(const e of S.battle.enemies){if(e.surrendered)continue;if(e.stun>0){e.stun-=dt;e.windup=0;continue}const d=Math.hypot(S.player.x-e.x,S.player.y-e.y),visible=C.lineClear(map,e,S.player);e.cooldown-=dt;e.think-=dt;
  if(d<360&&visible){e.dir=C.direction(S.player.x-e.x,S.player.y-e.y);if(e.cooldown<=0){e.windup+=dt;if(e.windup>1.2){const a=Math.atan2(S.player.y-e.y,S.player.x-e.x);bullets.push({x:e.x,y:e.y,vx:Math.cos(a)*230,vy:Math.sin(a)*230,owner:'enemy',life:2});e.windup=0;e.cooldown=2.8;A.effect('alert')}}}
  else{e.windup=0;if(e.think<=0){e.path=C.findPath(map,e,S.player);e.think=1.2}follow(e,e.path,45*dt,map)}
 }
 for(const b of bullets){const steps=Math.max(1,Math.ceil(Math.hypot(b.vx,b.vy)*dt/4));for(let n=0;n<steps&&b.life>0;n++){b.x+=b.vx*dt/steps;b.y+=b.vy*dt/steps;if(!C.walkable(map,b.x,b.y,2)){b.life=0;effects.push({x:b.x,y:b.y,t:.25});break}if(b.owner==='player'){const e=S.battle.enemies.find(e=>!e.surrendered&&Math.hypot(b.x-e.x,b.y-e.y)<17);if(e){e.pressure-=34;e.stun=.6;e.surrendered=e.pressure<=0;b.life=0}}else if(Math.hypot(b.x-S.player.x,b.y-S.player.y)<13){S.health-=(keys.has('c')&&isCover()?3:10);b.life=0;updateHUD();if(S.health<=0){failEncounter();break}}}b.life-=dt}
 bullets=bullets.filter(b=>b.life>0);checkCombat();}
function follow(actor,path,distance,map,blocks=[]){if(!path.length)return false;const goal=path[0],dx=goal.x-actor.x,dy=goal.y-actor.y,d=Math.hypot(dx,dy);if(d<4){path.shift();return false}const step=Math.min(distance,d),next=C.move(map,actor,dx/d*step,dy/d*step,blocks);actor.dir=C.direction(dx,dy);const moved=Math.hypot(next.x-actor.x,next.y-actor.y)>0.1;Object.assign(actor,next);if(!moved){const destination=path.at(-1);const retry=C.findPath(map,actor,destination,blocks);path.splice(0,path.length,...retry);if(path.length<2)path.length=0;}return moved}
function updateGuard(dt){const g=S.guard,map=MAPS[S.map];guardPathClock-=dt;const points=[{x:755,y:287},{x:910,y:264},{x:780,y:330},{x:672,y:392}];
 if(guardPathClock<=0){let target;if(S.mode==='escape')target=S.player;else{target=points[g.waypoint%points.length];if(Math.hypot(g.x-target.x,g.y-target.y)<25){g.waypoint++;target=points[g.waypoint%points.length]}}g.path=C.findPath(map,g,target);guardPathClock=S.mode==='escape'?.65:1.1}
 follow(g,g.path,dt*(S.mode==='escape'?102:45),map);const dist=Math.hypot(g.x-S.player.x,g.y-S.player.y),vectors={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]},v=vectors[g.dir],dot=dist?((S.player.x-g.x)*v[0]+(S.player.y-g.y)*v[1])/dist:1;
 const seen=dist<(S.lights[S.map]?105:190)&&dot>.35&&C.lineClear(map,g,S.player);S.alert=Math.max(0,Math.min(100,S.alert+(seen?42:-28)*dt));if(S.mode==='stealth'&&S.alert>=100){Object.assign(S.player,C.nearest(map,674,410));S.alert=0;toast('El guardia te vio. Retrocedes a la entrada: prueba con las luces apagadas.');}
 if(S.mode==='escape'){escapeTime-=dt;if(dist<24||escapeTime<=0){S.guard=null;modal('Vuelve a intentarlo','El guardia recuperó el paso. Las pruebas siguen en el archivo; busca otra ruta entre los muebles.',[['Reintentar infiltración',startStealth]]);mode('explore')}}updateHUD();}
function tick(dt){S.time+=dt;if(S.time>toastUntil)$('toast').classList.remove('show');if(!$('intro').hidden){introT+=dt;$('intro-caption').textContent=introT<3?'La lluvia no borra todas las huellas.':introT<6?'Una deuda en casa. Una llamada en la radio.':'Esta noche, llevar la placa no será suficiente.';if(introT>9)$('intro').hidden=true;return}if($('modal').open||S.paused||document.hidden||S.mode==='title')return;
 if(S.mode==='vn'){if(typeIndex<fullText.length){typeElapsed+=dt;while(typeElapsed>.028&&typeIndex<fullText.length){typeElapsed-=.028;typeIndex++;if(typeIndex%2===0&&/\S/.test(fullText[typeIndex-1]))A.voice(S.lines[S.line].speaker,typeIndex)}$('dialogue-text').textContent=fullText.slice(0,typeIndex);if(typeIndex===fullText.length)showChoices()}return}if(S.mode==='inspect')return;
 const map=MAPS[S.map];let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);moveActive=false;
 if(dx||dy){S.path=[];S.autoTarget=null;const n=Math.hypot(dx,dy),speed=keys.has('c')?70:keys.has('shift')?188:125,next=C.move(map,S.player,dx/n*speed*dt,dy/n*speed*dt,actorBlocks());moveActive=Math.hypot(next.x-S.player.x,next.y-S.player.y)>.1;Object.assign(S.player,next);S.player.dir=C.direction(dx,dy)}else if(S.path.length){moveActive=follow(S.player,S.path,125*dt,map,actorBlocks());if(S.autoTarget&&Math.hypot(S.autoTarget.x-S.player.x,S.autoTarget.y-S.player.y)<64){const obj=S.autoTarget;S.path=[];S.autoTarget=null;interact(obj)}}
 if(moveActive){S.steps+=dt*9;if(Math.floor(S.steps)!==Math.floor(S.steps-dt*9))A.effect('step');}
 if(S.mode==='combat')updateBattle(dt);if(['stealth','escape'].includes(S.mode)&&S.guard)updateGuard(dt);
 selected=nearestInteraction();$('interaction').hidden=!selected;if(selected)$('interaction-label').textContent=selected.label;
 const hint=environmentNote(selected);if($('mode-help').textContent!==hint)$('mode-help').textContent=hint;
 effects.forEach(e=>e.t-=dt);effects=effects.filter(e=>e.t>0);
}
function drawCafe(){ctx.fillStyle='#12141e';ctx.fillRect(0,0,1024,1024);ctx.fillStyle='#705146';ctx.fillRect(75,120,875,835);for(let y=180;y<940;y+=40)for(let x=90;x<934;x+=40){ctx.fillStyle=(x/40+y/40)%2?'#9a795c':'#987c62';ctx.fillRect(x,y,39,39)}ctx.fillStyle='#3b3440';ctx.fillRect(80,120,864,70);ctx.fillStyle='#d5b47c';ctx.font='24px Georgia';ctx.fillText('CAFÉ LA ESQUINA',360,163);for(const r of MAPS.cafe.solids){ctx.fillStyle='#38272a';ctx.fillRect(r[0]+3,r[1]+8,r[2],r[3]);ctx.fillStyle='#6d4940';ctx.fillRect(...r);ctx.fillStyle='#b3815c';ctx.fillRect(r[0]+4,r[1]+4,r[2]-8,8);if(r[2]===130){ctx.fillStyle='#e4d8b8';ctx.beginPath();ctx.arc(r[0]+45,r[1]+35,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#263b3c';ctx.fillRect(r[0]+80,r[1]+22,16,26)}}ctx.fillStyle='#e9c486';for(const x of [260,510,760]){ctx.fillRect(x,208,28,22);ctx.fillStyle='#251f28';ctx.fillRect(x+5,212,18,12);ctx.fillStyle='#e9c486'}}
function sprite(a,walking=false){const size=a.id==='sofia'?42:54;ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(a.x,a.y-1,15,6,0,0,Math.PI*2);ctx.fill();
 if(a.id==='mateo'||a.id==='guard'){const base={down:1,up:5,left:9,right:13}[a.dir||'down'],frame=walking?base+Math.floor(S.steps)%4:base;const im=assets['frame'+frame];if(im)ctx.drawImage(im,a.x-20,a.y-size,40,size)}
 else if(assets.npcs){const ids={vargas:0,elena:1,julian:2,marcos:3,sofia:4,sicario:3},col=ids[a.id]??3,row={down:0,up:1,left:2,right:3}[a.dir||'down'],im=assets.npcs,w=im.width/5,h=im.height/4;ctx.drawImage(im,col*w,row*h,w,h,a.x-24,a.y-size,48,size)}
 if(a.surrendered){ctx.fillStyle='#9ac8b7';ctx.font='10px Segoe UI';ctx.textAlign='center';ctx.fillText('RENDIDO',a.x,a.y-size-5);ctx.textAlign='left'}
}
function marker(o,color,label){ctx.save();ctx.translate(o.x,o.y);ctx.fillStyle=color+'22';ctx.beginPath();ctx.ellipse(0,0,19,9,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,0,16,7,0,0,Math.PI*2);ctx.stroke();const bob=Math.sin(S.time*3)*2;ctx.fillStyle=color;ctx.font='bold 15px Segoe UI';ctx.textAlign='center';ctx.fillText(label,0,-20+bob);ctx.restore()}
function render(){ctx.clearRect(0,0,width,height);ctx.fillStyle='#10131e';ctx.fillRect(0,0,width,height);if(S.mode==='title')return;const map=MAPS[S.map],vw=width/zoom,vh=height/zoom;
 const tx=vw>=1024?512:Math.max(vw/2,Math.min(1024-vw/2,S.player.x)),ty=vh>=1024?512:Math.max(vh/2,Math.min(1024-vh/2,S.player.y));cam.x+=(tx-cam.x)*.14;cam.y+=(ty-cam.y)*.14;
 ctx.save();ctx.translate(width/2,height/2);ctx.scale(zoom,zoom);ctx.translate(-cam.x,-cam.y);ctx.imageSmoothingEnabled=false;if(assets[S.map])ctx.drawImage(assets[S.map],0,0,1024,1024);else if(S.map==='cafe')drawCafe();
 if(S.debug){ctx.fillStyle='#20e88822';map.floors.forEach(r=>ctx.fillRect(...r));ctx.fillStyle='#e6506866';map.solids.forEach(r=>ctx.fillRect(...r))}
 if(S.path.length){ctx.strokeStyle='#b8d8ce77';ctx.lineWidth=2;ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(S.player.x,S.player.y);S.path.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke();ctx.setLineDash([])}
 if(S.guard){const g=S.guard,angle=({right:0,down:Math.PI/2,left:Math.PI,up:-Math.PI/2})[g.dir],range=S.lights[S.map]?105:190;ctx.fillStyle=S.alert>60?'#e0635033':'#f6df8733';ctx.beginPath();ctx.moveTo(g.x,g.y);for(let a=angle-.9;a<=angle+.9;a+=.04){let r=0;while(r<range&&C.walkable(map,g.x+Math.cos(a)*r,g.y+Math.sin(a)*r,2))r+=5;ctx.lineTo(g.x+Math.cos(a)*r,g.y+Math.sin(a)*r)}ctx.closePath();ctx.fill()}
 for(const o of interactions()){if(o.kind==='npc')continue;marker(o,['exit','flee','escape'].includes(o.kind)?'#9ec8b7':o.kind==='story'?'#f0cb84':'#9cb9d0',({story:'!',note:'▤',letter:'▤',photo:'▧',light:'◉',key:'⚿',locked:'▣',goal:'★',inspect:'⌕',exit:'↗',escape:'↗',flee:'↗',env:'◈'})[o.kind]||'·')}
 const actors=[...S.npcs,{...S.player,id:'mateo'},...(S.guard?[S.guard]:[]),...(S.battle?.enemies.map(e=>({...e,id:e.char}))||[])];actors.sort((a,b)=>a.y-b.y).forEach(a=>sprite(a,a.id==='mateo'?moveActive:a.id==='guard'&&!!S.guard));
 if(S.battle)for(const e of S.battle.enemies){if(e.surrendered)continue;ctx.fillStyle='#0b1729';ctx.fillRect(e.x-20,e.y-64,40,4);ctx.fillStyle='#d6b37a';ctx.fillRect(e.x-20,e.y-64,40*e.pressure/100,4);if(e.windup>0){ctx.strokeStyle='#e9a970';ctx.setLineDash([5,6]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(S.player.x,S.player.y);ctx.stroke();ctx.setLineDash([])}}
 for(const b of bullets){ctx.fillStyle=b.owner==='player'?'#d1f2ff':'#f7c57c';ctx.beginPath();ctx.arc(b.x,b.y,3,0,Math.PI*2);ctx.fill()}for(const e of effects){ctx.strokeStyle='#f5e2ae';ctx.beginPath();ctx.arc(e.x,e.y,15*(1-e.t/.3),0,Math.PI*2);ctx.stroke()}
 if(S.lights[S.map]){const light=ctx.createRadialGradient(S.player.x,S.player.y,20,S.player.x,S.player.y,210);light.addColorStop(0,'#02091535');light.addColorStop(1,'#020915bb');ctx.fillStyle=light;ctx.fillRect(0,0,1024,1024)}
 if(['bridge','school'].includes(S.map)){ctx.strokeStyle='#c4d6f622';ctx.lineWidth=1;for(let i=0;i<75;i++){let x=(i*139+S.time*15)%1024,y=(i*83+S.time*210)%1024;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-4,y+17);ctx.stroke()}}
 if(S.debug){ctx.strokeStyle='#9bff8c';ctx.beginPath();ctx.arc(S.player.x,S.player.y,9,0,Math.PI*2);ctx.stroke()}ctx.restore();
}
function frame(t){const dt=Math.min(.04,(t-prev)/1000||.016);prev=t;tick(dt);render();requestAnimationFrame(frame)}requestAnimationFrame(frame);
canvas.addEventListener('pointerdown',e=>{if(!['explore','combat','stealth','escape'].includes(S.mode)||$('modal').open||!$('intro').hidden)return;A.start();canvas.focus({preventScroll:true});const r=canvas.getBoundingClientRect(),target={x:(e.clientX-r.left-width/2)/zoom+cam.x,y:(e.clientY-r.top-height/2)/zoom+cam.y};
 if(S.mode==='combat'){const enemy=S.battle.enemies.find(a=>!a.surrendered&&Math.abs(a.x-target.x)<25&&target.y>a.y-65&&target.y<a.y+10);if(enemy){shoot(enemy);return}}
 const obj=interactions().filter(o=>Math.hypot(o.x-target.x,o.y-14-target.y)<38).sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y))[0];if(obj&&Math.hypot(obj.x-S.player.x,obj.y-S.player.y)<70){interact(obj);return}S.path=C.findPath(MAPS[S.map],S.player,obj||target,actorBlocks());S.autoTarget=obj||null;if(S.path.length<2)toast('Ese paso está bloqueado. Busca otro camino.');});
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if($('modal').open)return;if(['arrowup','arrowdown','arrowleft','arrowright',' ','tab'].includes(k)&&k!=='tab')e.preventDefault();if(!e.repeat){if(S.mode!=='title')A.start();if(k==='escape'){if(S.mode==='vn')$('close-talk').click();else if(S.mode==='inspect')$('leave-inspect').click();else pause();return}if(S.mode==='vn'&&(k===' '||k==='enter'||k==='e')){continueTalk();return}if(k==='f2'){e.preventDefault();S.debug=!S.debug;return}if(k==='e')interact();if(k==='j'&&S.mode!=='title')journal();if(k==='i')equipment();if(k==='m'&&S.mode!=='title')travelMenu();if(k==='f')shoot();if(k==='r')reload();if(k==='c')cover()}if(['explore','combat','stealth','escape'].includes(S.mode))keys.add(k)});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();S.paused=true;syncAudio()});window.addEventListener('focus',()=>{S.paused=false;syncAudio()});document.addEventListener('visibilitychange',()=>{keys.clear();syncAudio()});
function pause(){if(S.mode==='title')return;modal('Un momento para respirar','La partida está en pausa. Los personajes, las detecciones y los proyectiles se detienen.',[['Guardar partida',()=>{save();toast('Progreso guardado.')}],['Volver al inicio',()=>{save();mode('title')}]]);}
$('new-game').onclick=()=>{A.start();loading.then(newGame)};$('continue-game').onclick=()=>{A.start();loading.then(()=>{if(!restore())toast('No hay una partida guardada compatible.')})};try{$('continue-game').disabled=!localStorage.getItem(saveKey)}catch{$('continue-game').disabled=true}
$('skip-intro').onclick=()=>{$('intro').hidden=true;canvas.focus()};$('activity-menu').onclick=activityPanel;$('journal').onclick=journal;$('equipment').onclick=equipment;$('district').onclick=travelMenu;$('pause').onclick=pause;$('sound').onclick=()=>{const button=$('sound'),muted=A.toggle(),label=muted?'Activar sonido':'Silenciar sonido';button.textContent=muted?'♪̸':'♫';button.title=label;button.setAttribute('aria-label',label);if(!muted)A.start()};$('interact-btn').onclick=()=>interact();$('negotiate').onclick=negotiate;$('cover').onclick=cover;$('reload').onclick=reload;$('fire').onclick=()=>shoot();$('touch-e').onclick=()=>interact();
document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>keys.delete(b.dataset.key))});
// Deterministic QA entry points are enabled only with ?qa=1, never during normal play.
const params=new URLSearchParams(location.search);if(params.get('qa')==='1'){window.__GAME_QA__={S,loadNode,setupMap,startTalk,finishTalk,continueTalk,startCombat,startStealth,interact,tick,render,negotiate,shoot,save,restore,interactions,startActivity,activityPanel};loading.then(()=>{loadNode(params.get('node')||'PROLOGO');if(MAPS[params.get('map')])setupMap(params.get('map'));if(params.get('view')==='vn')startTalk(true)})}
})();


