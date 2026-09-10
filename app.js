const symbols=['🪙','⚓','☠️','🏴‍☠️','💎','🦜','🐙','🧭','💰','🌴','🍹','🚢','🦈','🐚','⭐','🔱','🏝️','🗝️','💀','🌊'];
const names=['Île du Départ','Baie des Palmiers','Île du Kraken','Fort des Flibustiers','Île au Trésor','Crique des Sirènes','Archipel Fantôme','Grotte du Kraken','Fort de la Tempête','Mer des Corsaires','Île des Épaves','Baie du Dragon','Citadelle du Requin','Volcan des Pirates','Grand Trésor'];
const counts=[0,48,60,72,84,96,108,120,132,144,144,144,144,144,144,144];
const difficulties=['','Facile','Facile','Moyen','Moyen','Difficile','Difficile','Très difficile','Très difficile','Expert','Expert','Maître','Maître','Légendaire','Mythique','Trésor ultime'];
const goals=[0,900,1150,1450,1750,2100,2450,2850,3250,3700,4200,4700,5200,5700,6200,6800];
const TILE_W=52,TILE_H=62,STEP_X=52,STEP_Y=62,LAYER_DX=26,LAYER_DY=31;
let state=JSON.parse(localStorage.getItem('mahjongPirateState')||'null')||{coins:0,gems:0,level:1,xp:0,bestScore:0,unlocked:1};
state.unlocked=Math.max(1,Math.min(15,Number(state.unlocked)||1));state.level=Math.max(1,Math.min(15,Number(state.level)||1));
let game=null,timer=null,startedAt=0;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('mahjongPirateState',JSON.stringify(state));updateHud()}
function captainTitle(){if(state.level<3)return'Mousse des Caraïbes';if(state.level<5)return'Capitaine Corsaire';if(state.level<8)return'Maître des Sept Mers';if(state.level<11)return'Légende des Océans';return'Roi des Flibustiers'}
function updateHud(){if(!$('coins'))return;$('coins').textContent=state.coins;$('gems').textContent=state.gems;$('captainName').textContent=captainTitle();$('level').textContent=state.level;$('xp').textContent=state.xp;$('bestScore').textContent=state.bestScore;$('mapProgress').textContent=`${state.unlocked}/15`;document.querySelectorAll('.island').forEach((b,i)=>{b.classList.toggle('locked',i+1>state.unlocked);b.classList.toggle('current',i+1===state.unlocked)})}
function rectOverlap(a,b){return a.x<b.x+TILE_W&&a.x+TILE_W>b.x&&a.y<b.y+TILE_H&&a.y+TILE_H>b.y}
function freeTile(t,tiles){if(t.removed)return false;for(const o of tiles)if(!o.removed&&o.l>t.l&&rectOverlap(t,o))return false;let left=false,right=false;for(const o of tiles){if(o.removed||o.l!==t.l||o.id===t.id||o.y!==t.y)continue;if(o.x<t.x&&o.x+TILE_W>t.x)left=true;if(o.x<t.x+TILE_W&&o.x+TILE_W>t.x+TILE_W)right=true}return !(left&&right)}
const SHAPE_PATTERNS={tortue:[2,4,6,6,6,6,6,4,2,2],pyramide:[2,4,6,6,6,6,6,6,6,6],diamant:[2,4,6,6,6,6,6,6,4,2],navire:[0,2,4,6,6,6,6,6,6,6],fort:[6,6,4,4,6,6,4,4,6,6],archipel:[4,6,6,4,6,4,6,6,6,4]};
const SHAPE_BY_LEVEL={1:'tortue',2:'pyramide',3:'diamant',4:'navire',5:'fort',6:'archipel'};
function shapeName(level){return SHAPE_BY_LEVEL[Math.min(level,6)]||'archipel'}
function patternCells(shape){const widths=SHAPE_PATTERNS[shape]||SHAPE_PATTERNS.archipel,cells=[];widths.forEach((width,r)=>{const start=Math.floor((6-width)/2);for(let c=0;c<width;c++)cells.push({r,c:start+c})});return cells}
function layerTargets(level){if(level===1)return[36,8,4,0,0];if(level===2)return[42,4,2,0,0];if(level===3)return[40,6,2,0,0];if(level===4)return[40,6,2,0,0];if(level===5)return[42,4,2,0,0];if(level===6)return[40,6,2,0,0];if(level===7)return[40,6,2,0,0];if(level===8)return[40,6,2,0,0];return[40,6,2,0,0]}
function layout(level){
 const targets=layerTargets(level),shape=shapeName(level),cells=patternCells(shape),boardW=6*STEP_X+TILE_W+18,boardH=10*STEP_Y+TILE_H+18,out=[];
 const baseX=(boardW-(6*STEP_X+TILE_W))/2,baseY=(boardH-(10*STEP_Y+TILE_H))/2;
 for(let l=0;l<5;l++){
  const wanted=Math.min(targets[l]||0,cells.length);if(!wanted)continue;
  if(l===0){
   const ranked=[...cells].sort((a,b)=>((a.c-2.5)**2+(a.r-4.5)**2)-((b.c-2.5)**2+(b.r-4.5)**2));
   const chosen=wanted===cells.length?cells:ranked.slice(0,wanted);
   chosen.sort((a,b)=>a.r-b.r||a.c-b.c).forEach(({r,c})=>out.push({x:baseX+c*STEP_X,y:baseY+r*STEP_Y,l}));
   continue;
  }
  const sx=(l%2)*LAYER_DX;
  const candidates=cells.map(({r,c})=>({r,c,x:baseX+c*STEP_X+sx,y:baseY+4.5*STEP_Y+(r-4.5)*STEP_Y+l*LAYER_DY}));
  const ranked=candidates.sort((a,b)=>((a.c-2.5)**2+(a.r-4.5)**2)-((b.c-2.5)**2+(b.r-4.5)**2));
  const chosen=ranked.slice(0,wanted);
  chosen.sort((a,b)=>a.y-b.y||a.x-b.x).forEach(p=>out.push({x:p.x,y:p.y,l}));
 }
 return out.map((p,i)=>({...p,id:i}));
}