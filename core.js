(function(root){
'use strict';
const inRect=(x,y,r)=>x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3];
function walkable(map,x,y,r=9,actors=[]){
 if(!Number.isFinite(x)||!Number.isFinite(y))return false;
 for(const [dx,dy] of [[0,0],[r,0],[-r,0],[0,r],[0,-r],[r*.707,r*.707],[-r*.707,r*.707],[r*.707,-r*.707],[-r*.707,-r*.707]])
  if(!map.floors.some(q=>inRect(x+dx,y+dy,q)))return false;
 for(const q of map.solids){const px=Math.max(q[0],Math.min(x,q[0]+q[2])),py=Math.max(q[1],Math.min(y,q[1]+q[3]));if((x-px)**2+(y-py)**2<r*r)return false}
 return !actors.some(a=>Math.hypot(a.x-x,a.y-y)<r+(a.radius||12));
}
function move(map,p,dx,dy,actors=[]){
 const count=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));let x=p.x,y=p.y;
 for(let n=0;n<count;n++){const sx=dx/count,sy=dy/count,r=p.radius||9;let moved=false;if(walkable(map,x+sx,y,r,actors)){x+=sx;moved=!!sx}if(walkable(map,x,y+sy,r,actors)){y+=sy;moved=moved||!!sy}if(!moved&&(sx||sy)){for(const sign of [-1,1]){const tx=sy?sign*1.5:0,ty=sx?sign*1.5:0;if(walkable(map,x+tx,y+ty,r,actors)&&walkable(map,x+tx+sx,y+ty+sy,r,actors)){x+=tx+sx;y+=ty+sy;break}}}}
 return {x,y};
}
function nearest(map,x,y,r=9){
 if(walkable(map,x,y,r))return {x,y};
 for(let d=8;d<1100;d+=8)for(let i=0;i<32;i++){const a=i*Math.PI/16,px=x+Math.cos(a)*d,py=y+Math.sin(a)*d;if(walkable(map,px,py,r))return{x:px,y:py}}
 throw Error('Map has no walkable point');
}
function lineClear(map,a,b){const d=Math.hypot(b.x-a.x,b.y-a.y);for(let n=0;n<=d;n+=5){const t=d?n/d:0;if(!walkable(map,a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,2))return false}return true}
function clearRoute(map,a,b,actors=[]){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(d/3));for(let i=0;i<=n;i++)if(!walkable(map,a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n,9,actors))return false;return true}
// Breadth-first path over the entire connected floor; closest reachable destination wins.
function findPath(map,start,target,actors=[]){
 const cell=16,cols=64,key=(x,y)=>y*cols+x,valid=(x,y)=>x>=0&&y>=0&&x<64&&y<64&&walkable(map,x*cell+8,y*cell+8,9,actors);
 let sx=Math.floor(start.x/cell),sy=Math.floor(start.y/cell);
 if(!valid(sx,sy)||!clearRoute(map,start,{x:sx*cell+8,y:sy*cell+8},actors)){let found=false;for(let d=1;d<6&&!found;d++)for(let y=sy-d;y<=sy+d&&!found;y++)for(let x=sx-d;x<=sx+d;x++)if(valid(x,y)&&clearRoute(map,start,{x:x*cell+8,y:y*cell+8},actors)){sx=x;sy=y;found=true;break}if(!found)return []}
 const queue=[[sx,sy]],parents=new Map([[key(sx,sy),null]]);let best=queue[0],score=Infinity;
 for(let i=0;i<queue.length;i++){
  const [x,y]=queue[i],d=Math.hypot(x*cell+8-target.x,y*cell+8-target.y);
  if(d<score){score=d;best=[x,y]}if(d<cell*.7)break;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(!parents.has(k)&&valid(nx,ny)&&clearRoute(map,{x:x*cell+8,y:y*cell+8},{x:nx*cell+8,y:ny*cell+8},actors)){parents.set(k,[x,y]);queue.push([nx,ny])}}
 }
 const result=[];let cur=best;while(cur){result.push({x:cur[0]*cell+8,y:cur[1]*cell+8});cur=parents.get(key(...cur))}result.reverse();return result;
}
function direction(dx,dy){return Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')}
const api={inRect,walkable,move,nearest,lineClear,findPath,direction};if(typeof module!=='undefined')module.exports=api;else root.WorldCore=api;
})(typeof window!=='undefined'?window:globalThis);

