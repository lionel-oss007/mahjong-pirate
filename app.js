const symbols=['🪙','⚓','☠️','🏴‍☠️','💎','🦜','🐙','🧭','💰','🌴','🍹','🚢','🦈','🐚','⭐','🔱','🏝️','🗝️','💀','🌊'];
const names=['Île du Départ','Baie des Palmiers','Île du Kraken','Fort des Flibustiers','Île au Trésor','Crique des Sirènes','Archipel Fantôme','Grotte du Kraken','Fort de la Tempête','Mer des Corsaires','Île des Épaves','Baie du Dragon','Citadelle du Requin','Volcan des Pirates','Grand Trésor'];
const counts=[0,48,60,72,84,96,108,120,132,144,144,144,144,144,144,144];
const difficulties=['','Facile','Facile','Moyen','Moyen','Difficile','Difficile','Très difficile','Très difficile','Expert','Expert','Maître','Maître','Légendaire','Mythique','Trésor ultime'];
const goals=[0,900,1150,1450,1750,2100,2450,2850,3250,3700,4200,4700,5200,5700,6200,6800];
const TILE_W=52,TILE_H=62,STEP_X=44,STEP_Y=50;
let state=JSON.parse(localStorage.getItem('mahjongPirateState')||'null')||{coins:0,gems:0,level:1,xp:0,bestScore:0,unlocked:1};
state.unlocked=Math.max(1,Math.min(15,Number(state.unlocked)||1));state.level=Math.max(1,Math.min(15,Number(state.level)||1));
let game=null,timer=null,startedAt=0;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('mahjongPirateState',JSON.stringify(state));updateHud()}
function captainTitle(){if(state.level<3)return'Mousse des Caraïbes';if(state.level<5)return'Capitaine Corsaire';if(state.level<8)return'Maître des Sept Mers';if(state.level<11)return'Légende des Océans';return'Roi des Flibustiers'}
function updateHud(){if(!$('coins'))return;$('coins').textContent=state.coins;$('gems').textContent=state.gems;$('captainName').textContent=captainTitle();$('level').textContent=state.level;$('xp').textContent=state.xp;$('bestScore').textContent=state.bestScore;$('mapProgress').textContent=`${state.unlocked}/15`;document.querySelectorAll('.island').forEach((b,i)=>{b.classList.toggle('locked',i+1>state.unlocked);b.classList.toggle('current',i+1===state.unlocked)})}
function rectOverlap(a,b){return a.x<b.x+TILE_W&&a.x+TILE_W>b.x&&a.y<b.y+TILE_H&&a.y+TILE_H>b.y}
function rectOverlapY(a,b){return a.y<b.y+TILE_H&&a.y+TILE_H>b.y}
function freeTile(t,tiles){if(t.removed)return false;for(const o of tiles)if(!o.removed&&o.l>t.l&&rectOverlap(t,o))return false;let left=false,right=false;for(const o of tiles){if(o.removed||o.l!==t.l||o.id===t.id||!rectOverlapY(t,o))continue;if(o.x<t.x&&o.x+TILE_W>t.x)left=true;if(o.x<t.x+TILE_W&&o.x+TILE_W>t.x+TILE_W)right=true}return !(left&&right)}
// Formes compactes inspirées du Mahjong Solitaire mobile : grande base, puis des couches centrées qui découvrent progressivement les tuiles dessous.
const SHAPES=[{cols:6,rows:10},{cols:5,rows:8},{cols:4,rows:6},{cols:3,rows:4},{cols:3,rows:2}];
function layerTargets(level){if(level<=1)return[24,12,8,4,0];if(level===2)return[30,16,8,6,0];if(level===3)return[36,20,10,6,0];if(level===4)return[42,24,12,6,0];if(level===5)return[48,26,14,8,0];if(level===6)return[54,30,16,8,0];if(level===7)return[60,34,18,8,0];if(level===8)return[60,40,20,12,0];return[60,42,24,12,6]}
function layout(level){
 const baseW=(SHAPES[0].cols-1)*STEP_X+TILE_W;
 const baseH=(SHAPES[0].rows-1)*STEP_Y+TILE_H;
 const boardW=baseW+18,boardH=baseH+18,out=[];
 const targets=layerTargets(level);
 for(let l=0;l<SHAPES.length;l++){
  const s=SHAPES[l],wanted=Math.min(targets[l]||0,s.cols*s.rows);
  if(!wanted)continue;
  const sw=(s.cols-1)*STEP_X+TILE_W,sh=(s.rows-1)*STEP_Y+TILE_H;
  // Chaque étage est réellement recentré et légèrement décalé : les couches supérieures recouvrent les tuiles inférieures.
  const ox=(boardW-sw)/2+l*2,oy=(boardH-sh)/2+l*2;
  const layer=[];
  for(let r=0;r<s.rows;r++)for(let c=0;c<s.cols;c++)layer.push({x:ox+c*STEP_X,y:oy+r*STEP_Y,l});
  // Garder les bords pour les premiers niveaux, puis densifier le centre sur les niveaux avancés.
  const cx=(s.cols-1)/2,cy=(s.rows-1)/2;
  layer.sort((a,b)=>((a.x-(ox+cx*STEP_X))**2+(a.y-(oy+cy*STEP_Y))**2)-((b.x-(ox+cx*STEP_X))**2+(b.y-(oy+cy*STEP_Y))**2));
  // Pour un plateau complet, toutes les positions sont utilisées. Pour un niveau partiel, la forme reste symétrique autant que possible.
  if(wanted<s.cols*s.rows){
   const chosen=layer.slice(0,wanted);
   out.push(...chosen);
  }else out.push(...layer);
 }
 return out.map((p,i)=>({...p,id:i}));
}
function countFor(level){return counts[level]||144}
function buildSolvable(level){
 const positions=layout(level),target=positions.length;
 for(let attempt=0;attempt<2200;attempt++){
  const remaining=positions.map(t=>({...t,removed:false})),pairs=[];
  while(remaining.some(t=>!t.removed)){
   const free=remaining.filter(t=>!t.removed&&freeTile(t,remaining));
   if(free.length<2)break;
   const a=free[Math.floor(Math.random()*free.length)],others=free.filter(t=>t.id!==a.id);
   const b=others[Math.floor(Math.random()*others.length)];
   a.removed=b.removed=true;pairs.push([a.id,b.id]);
  }
  if(pairs.length*2===target){
   const tiles=positions.map(p=>({...p,removed:false,symbol:null}));
   pairs.forEach((ids,i)=>ids.forEach(id=>tiles[id].symbol=symbols[i%symbols.length]));
   return tiles;
  }
 }
 // Secours : conserver des paires valides même si une génération aléatoire échoue.
 const tiles=positions.map(p=>({...p,removed:false,symbol:null}));
 for(let i=0;i<tiles.length;i+=2){const s=symbols[(i/2)%symbols.length];tiles[i].symbol=s;tiles[i+1].symbol=s}
 return tiles;
}
function symbolKind(s){const i=symbols.indexOf(s);return i<0?'unknown':`kind-${i}`}
function newGame(level){clearInterval(timer);closeDeadlock();closeLose();game={level,tiles:buildSolvable(level),selected:null,score:0,moves:0,pairs:0,combo:0,bestCombo:0,undo:[],shuffles:0};startedAt=Date.now();$('map').classList.add('hidden');$('game').classList.remove('hidden');$('islandTitle').textContent=names[level]||`Île ${level}`;$('difficulty').textContent=difficulties[level]||'Légendaire';$('msg').textContent='';render();timer=setInterval(tick,500)}
function tick(){if(!game)return;const sec=Math.floor((Date.now()-startedAt)/1000);$('time').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}
function updateTargets(){if(!game)return;const g=goals[game.level]||5000;if($('goal1'))$('goal1').textContent=Math.round(g*.3);if($('goal2'))$('goal2').textContent=Math.round(g*.6);if($('goal3'))$('goal3').textContent=g;if($('goalBar'))$('goalBar').style.width=Math.min(100,(game.score/g)*100)+'%'}
function render(){const board=$('board');board.innerHTML='';board.style.width=boardBaseWidth()+'px';board.style.height=boardBaseHeight()+'px';for(const t of game.tiles){if(t.removed)continue;const free=freeTile(t,game.tiles),b=document.createElement('button');b.className='tile '+(free?'free':'blocked')+' '+symbolKind(t.symbol)+(game.selected===t.id?' selected':'');b.textContent=t.symbol;b.style.left=t.x+'px';b.style.top=t.y+'px';b.style.zIndex=20+t.l;b.onclick=()=>pick(t.id);board.appendChild(b)}$('score').textContent=game.score;$('remaining').textContent=game.tiles.filter(t=>!t.removed).length;$('moves').textContent=game.moves;$('pairs').textContent=game.pairs;if($('tray')){$('tray').innerHTML='';$('tray').style.display='none';if($('tray').parentElement)$('tray').parentElement.style.display='none'}updateTargets();updateBoosters()}
function boardBaseWidth(){return 6*STEP_X+TILE_W+18}
function boardBaseHeight(){return 10*STEP_Y+TILE_H+18}
function legalPairs(){const free=game.tiles.filter(t=>!t.removed&&freeTile(t,game.tiles)),out=[];for(let i=0;i<free.length;i++)for(let j=i+1;j<free.length;j++)if(free[i].symbol===free[j].symbol)out.push([free[i],free[j]]);return out}
function showDeadlock(){if(!game||game.tiles.every(t=>t.removed)||legalPairs().length)return;clearInterval(timer);$('deadlockText').textContent=`Il reste ${game.tiles.filter(t=>!t.removed).length} tuiles, mais aucune paire libre n'est disponible. Utilise le mélange uniquement pour tenter de débloquer une nouvelle paire.`;$('deadlock').showModal();sfx(false)}
function closeDeadlock(){if($('deadlock')?.open)$('deadlock').close()}
function showLose(){closeLose()}
function closeLose(){if($('lose')?.open)$('lose').close()}
function pick(id){if(!game)return;const t=game.tiles.find(x=>x.id===id);if(!t||t.removed||!freeTile(t,game.tiles))return;if(game.selected===id){game.selected=null;render();return}if(game.selected!==null){const a=game.tiles.find(x=>x.id===game.selected);if(a&&a.symbol===t.symbol&&freeTile(a,game.tiles)){game.undo.push({ids:[a.id,t.id],score:game.score,combo:game.combo});a.removed=true;t.removed=true;game.selected=null;game.moves++;game.pairs++;game.combo++;game.bestCombo=Math.max(game.bestCombo,game.combo);const gain=100+game.level*15+Math.max(0,game.combo-1)*20;game.score+=gain;sfx(true);$('msg').textContent=game.combo>=3?`🔥 Combo x${game.combo} ! +${gain} points.`:`⚓ Paire trouvée ! +${gain} points.`;render();if(game.tiles.every(x=>x.removed))win();else if(!legalPairs().length)showDeadlock();return}game.selected=null}$('msg').textContent=`🪙 ${t.symbol} sélectionnée — choisis la même tuile libre.`;game.selected=id;render()}
function hint(){if(!game)return;const pair=legalPairs()[0];if(!pair){showDeadlock();return}game.selected=pair[0].id;game.score=Math.max(0,game.score-10);render();$('msg').textContent=`💡 Indice : ${pair[0].symbol} a une paire libre.`}
function shuffle(){if(!game)return;closeDeadlock();const active=game.tiles.filter(t=>!t.removed),original=active.map(t=>t.symbol);let ok=false;for(let attempt=0;attempt<250&&!ok;attempt++){const syms=[...original].sort(()=>Math.random()-.5);active.forEach((t,i)=>t.symbol=syms[i]);ok=legalPairs().length>0}if(!ok)active.forEach((t,i)=>t.symbol=original[i]);game.score=Math.max(0,game.score-25);game.combo=0;game.selected=null;game.shuffles++;render();$('msg').textContent=ok?'🔀 Mélange : une nouvelle paire est potentiellement accessible.':'🔀 Le mélange n’a pas débloqué de paire.';timer=setInterval(tick,500)}
function undo(){if(!game||!game.undo.length){$('msg').textContent='↩️ Aucun coup à annuler.';return}const u=game.undo.pop();u.ids.forEach(id=>{const t=game.tiles.find(x=>x.id===id);if(t)t.removed=false});game.score=u.score;game.combo=u.combo;game.pairs=Math.max(0,game.pairs-1);game.moves++;game.selected=null;render();closeDeadlock();$('msg').textContent='↩️ Dernière paire restaurée.';if(!timer)timer=setInterval(tick,500)}
function bomb(){if(!game)return;const pair=legalPairs()[0];if(!pair){showDeadlock();return}pair.forEach(t=>t.removed=true);game.pairs++;game.score+=100;game.combo=0;game.selected=null;render();$('msg').textContent='💣 Canon pirate ! Une paire libre a été pulvérisée.';if(game.tiles.every(t=>t.removed))win()}
function updateBoosters(){if(!$('undoCount'))return;$('undoCount').textContent=game?.undo?.length||0;$('shuffleCount').textContent=game?.shuffles||0}
function win(){clearInterval(timer);timer=null;closeDeadlock();closeLose();const sec=Math.floor((Date.now()-startedAt)/1000),g=goals[game.level]||5000,stars=game.score>=g?3:game.score>=g*.6?2:1,reward=25*game.level+stars*10,xp=30*game.level+stars*12;state.coins+=reward;state.xp+=xp;state.level=Math.max(state.level,Math.min(15,1+Math.floor(state.xp/100)));if(game.score>state.bestScore)state.bestScore=game.score;if(game.level===state.unlocked&&state.unlocked<15)state.unlocked++;save();$('winText').textContent=`Île terminée en ${sec}s avec ${game.moves} coups et ${game.bestCombo} de combo.`;$('stars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);$('rewardCoins').textContent=reward;$('rewardXp').textContent=xp;$('next').textContent=game.level<15?'Île suivante':'Retour à la carte';$('next').onclick=()=>{$('win').close();if(game.level<15)newGame(game.level+1);else home()};$('win').showModal();sfx(true)}
function home(){clearInterval(timer);timer=null;closeDeadlock();closeLose();game=null;$('game').classList.add('hidden');$('map').classList.remove('hidden');$('msg').textContent='';updateHud()}
function sfx(ok){try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.frequency.value=ok?660:180;g.gain.value=.04;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.09)}catch(e){}}
document.querySelectorAll('.island').forEach(b=>b.onclick=()=>{const l=+b.dataset.level;if(l<=state.unlocked)newGame(l)});if($('hint'))$('hint').onclick=hint;if($('shuffle'))$('shuffle').onclick=shuffle;if($('restart'))$('restart').onclick=()=>game&&newGame(game.level);if($('homeBtn'))$('homeBtn').onclick=home;if($('homeWin'))$('homeWin').onclick=()=>{$('win').close();home()};if($('deadlockShuffle'))$('deadlockShuffle').onclick=shuffle;if($('deadlockRestart'))$('deadlockRestart').onclick=()=>game&&newGame(game.level);if($('undo'))$('undo').onclick=undo;if($('bomb'))$('bomb').onclick=bomb;if($('resetProgress'))$('resetProgress').onclick=()=>{if(confirm('Réinitialiser toute la progression ?')){localStorage.removeItem('mahjongPirateState');state={coins:0,gems:0,level:1,xp:0,bestScore:0,unlocked:1};save()}};if($('loseRestart'))$('loseRestart').onclick=()=>{if($('lose'))$('lose').close();game&&newGame(game.level)};if($('loseUndo'))$('loseUndo').onclick=()=>{if($('lose'))$('lose').close();undo()};window.addEventListener('resize',()=>{if(game)render()});updateHud();