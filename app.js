const symbols=['🪙','⚓','☠️','🏴‍☠️','💎','🦜','🐙','🧭','💰','🌴','🍹','🚢','🦈','🐚','⭐','🔱','🏝️','🗝️','💀','🌊'];
const names=['Île du Départ','Baie des Palmiers','Île du Kraken','Fort des Flibustiers','Île au Trésor'];
const counts=[0,24,28,32,36,40];
const difficulties=['','Facile','Facile','Moyen','Difficile','Expert'];
const TILE_W=58,TILE_H=70,STEP_X=54,STEP_Y=68;
let state=JSON.parse(localStorage.getItem('mahjongPirateState')||'null')||{coins:0,gems:0,level:1,xp:0,bestScore:0,unlocked:1};
let game=null,timer=null,startedAt=0;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('mahjongPirateState',JSON.stringify(state));updateHud()}
function updateHud(){$('coins').textContent=state.coins;$('gems').textContent=state.gems;$('captainName').textContent=state.level<3?'Mousse des Caraïbes':state.level<5?'Capitaine Corsaire':'Maître des Sept Mers';$('level').textContent=state.level;$('xp').textContent=state.xp;$('bestScore').textContent=state.bestScore;$('mapProgress').textContent=`${state.unlocked}/5`;document.querySelectorAll('.island').forEach((b,i)=>{b.classList.toggle('locked',i+1>state.unlocked);b.classList.toggle('current',i+1===state.unlocked)})}

// Mahjong Solitaire : une tuile est libre si elle n'est pas recouverte et si un côté est ouvert.
function rectOverlap(a,b){return a.x<b.x+TILE_W&&a.x+TILE_W>b.x&&a.y<b.y+TILE_H&&a.y+TILE_H>b.y}
function freeTile(t,tiles){
  if(t.removed)return false;
  for(const o of tiles)if(!o.removed&&o.l>t.l&&rectOverlap(t,o))return false;
  let leftBlocked=false,rightBlocked=false;
  for(const o of tiles){
    if(o.removed||o.l!==t.l||o.id===t.id||!rectOverlapY(t,o))continue;
    if(o.x<t.x&&o.x+TILE_W>t.x)leftBlocked=true;
    if(o.x<t.x+TILE_W&&o.x+TILE_W>t.x+TILE_W)rightBlocked=true;
  }
  return !(leftBlocked&&rightBlocked);
}
function rectOverlapY(a,b){return a.y<b.y+TILE_H&&a.y+TILE_H>b.y}

function layout(level){
  const shapes={1:[2,4,6,6,4,2],2:[4,6,8,6,4],3:[2,6,8,8,6,2],4:[2,4,8,8,8,4,2],5:[4,6,8,8,6,4,4]};
  const rows=shapes[level],positions=[];
  rows.forEach((width,r)=>{const start=(10-width)/2;for(let c=0;c<width;c++)positions.push({x:45+(start+c)*STEP_X+(r%2?5:0),y:25+r*STEP_Y,l:0})});
  if(level>=3){const centerRows=level===3?[2,3]:[2,3,4];let lifted=0;centerRows.forEach(r=>{for(const p of positions.filter(p=>Math.round((p.y-25)/STEP_Y)===r).slice(1,-1)){if(lifted<4){p.l=1;p.x+=11;p.y+=10;lifted++}}})}
  return positions.map((p,i)=>({...p,id:i}));
}

// Construction par retraits légaux : chaque paire est donc jouable depuis une solution connue.
function buildSolvable(level){
  for(let attempt=0;attempt<500;attempt++){
    const positions=layout(level),remaining=positions.map(p=>({...p,removed:false})),pairs=[];
    while(remaining.some(t=>!t.removed)){
      const free=remaining.filter(t=>freeTile(t,remaining));
      if(free.length<2)break;
      free.sort(()=>Math.random()-.5);
      const a=free[0],candidates=free.filter(t=>t.id!==a.id);if(!candidates.length)break;
      const b=candidates[Math.floor(Math.random()*candidates.length)];
      a.removed=b.removed=true;pairs.push([a.id,b.id]);
    }
    if(pairs.length===counts[level]/2){const tiles=positions.map(p=>({...p,removed:false,symbol:null}));pairs.forEach(([a,b],i)=>{const s=symbols[i%symbols.length];tiles[a].symbol=s;tiles[b].symbol=s});return tiles}
  }
  const positions=[];for(let i=0;i<counts[level];i++)positions.push({id:i,x:45+(i%8)*STEP_X,y:25+Math.floor(i/8)*STEP_Y,l:0,removed:false,symbol:symbols[Math.floor(i/2)%symbols.length]});return positions;
}

function symbolKind(symbol){const i=symbols.indexOf(symbol);return i<0?'unknown':`kind-${i}`}
function newGame(level){clearInterval(timer);game={level,tiles:buildSolvable(level),selected:null,score:0,moves:0,pairs:0,combo:0,bestCombo:0};startedAt=Date.now();$('map').classList.add('hidden');$('game').classList.remove('hidden');$('islandTitle').textContent=names[level];$('difficulty').textContent=difficulties[level];$('msg').textContent='🏴‍☠️ Règle : retire deux symboles identiques et libres.';render();timer=setInterval(tick,500)}
function tick(){if(!game)return;const sec=Math.floor((Date.now()-startedAt)/1000);$('time').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}
function render(){const board=$('board');board.innerHTML='';board.style.width=levelWidth(game.level)+'px';board.style.height=game.level>=4?'610px':'560px';for(const t of game.tiles){if(t.removed)continue;const free=freeTile(t,game.tiles),b=document.createElement('button');b.className='tile '+(free?'free':'blocked')+' '+symbolKind(t.symbol);if(game.selected===t.id)b.classList.add('selected');b.textContent=t.symbol;b.style.left=t.x+'px';b.style.top=t.y+'px';b.style.zIndex=10+t.l;b.dataset.kind=symbolKind(t.symbol);b.setAttribute('aria-label',free?`Tuile libre ${t.symbol}`:`Tuile bloquée ${t.symbol}`);b.onclick=()=>pick(t.id);board.appendChild(b)}$('score').textContent=game.score;$('remaining').textContent=game.tiles.filter(t=>!t.removed).length;$('moves').textContent=game.moves;$('pairs').textContent=game.pairs}
function levelWidth(l){return l<=2?650:l===3?720:l===4?800:850}
function legalPairs(){const free=game.tiles.filter(t=>!t.removed&&freeTile(t,game.tiles)),out=[];for(let i=0;i<free.length;i++)for(let j=i+1;j<free.length;j++)if(free[i].symbol===free[j].symbol)out.push([free[i],free[j]]);return out}
function pick(id){const t=game.tiles.find(x=>x.id===id);if(!t||!freeTile(t,game.tiles))return;if(game.selected===null){game.selected=id;render();return}const a=game.tiles.find(x=>x.id===game.selected);game.moves++;if(a&&a.id!==t.id&&a.symbol===t.symbol&&freeTile(a,game.tiles)){
  a.removed=t.removed=true;game.pairs++;game.combo++;game.bestCombo=Math.max(game.bestCombo,game.combo);const gain=100+game.level*15+Math.max(0,game.combo-1)*20;game.score+=gain;game.selected=null;sfx(true);$('msg').textContent=game.combo>=3?`🔥 Combo x${game.combo} ! +${gain} pièces de score.`:'⚓ Paire valide ! Les deux tuiles sont retirées.';
}else{game.combo=0;game.selected=null;sfx(false);$('msg').textContent='❌ Paire impossible : mêmes symboles + deux tuiles libres.'}
render();if(game.tiles.every(t=>t.removed))win();else if(!legalPairs().length)$('msg').textContent='☠️ Aucune paire disponible. Utilise Mélanger.'}
function hint(){if(!game)return;const pair=legalPairs()[0];if(pair){game.selected=pair[0].id;game.score=Math.max(0,game.score-10);render();$('msg').textContent=`💡 Indice : ${pair[0].symbol} peut être associé à une autre tuile libre.`}else $('msg').textContent='☠️ Aucune paire libre. Mélange le plateau.'}
function shuffle(){if(!game)return;const active=game.tiles.filter(t=>!t.removed),original=active.map(t=>t.symbol);let ok=false;for(let attempt=0;attempt<80&&!ok;attempt++){const syms=[...original].sort(()=>Math.random()-.5);active.forEach((t,i)=>t.symbol=syms[i]);ok=legalPairs().length>0}if(!ok)active.forEach((t,i)=>t.symbol=original[i]);game.score=Math.max(0,game.score-25);game.combo=0;game.selected=null;render();$('msg').textContent=ok?'🔀 Carte mélangée : au moins une paire est disponible.':'🔀 Mélange conservé : aucune paire ne pouvait être créée.'}
function win(){clearInterval(timer);const sec=Math.floor((Date.now()-startedAt)/1000),stars=sec<=90?3:sec<=180?2:1,reward=20*game.level+stars*5,xp=25*game.level+stars*10;state.coins+=reward;state.xp+=xp;state.level=Math.max(state.level,Math.min(5,1+Math.floor(state.xp/100)));if(game.score>state.bestScore)state.bestScore=game.score;if(game.level===state.unlocked&&state.unlocked<5)state.unlocked++;save();$('winText').textContent=`Île terminée en ${sec}s avec ${game.moves} coups.`;$('stars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);$('rewardCoins').textContent=reward;$('rewardXp').textContent=xp;$('next').textContent=game.level<5?'Île suivante':'Retour à la carte';$('next').onclick=()=>{$('win').close();if(game.level<5)newGame(game.level+1);else home()};$('win').showModal();sfx(true)}
function home(){clearInterval(timer);game=null;$('game').classList.add('hidden');$('map').classList.remove('hidden');$('msg').textContent='';updateHud()}
function sfx(ok){try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.frequency.value=ok?660:180;g.gain.value=.04;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.09)}catch(e){}}
document.querySelectorAll('.island').forEach(b=>b.onclick=()=>{const l=+b.dataset.level;if(l<=state.unlocked)newGame(l)});$('hint').onclick=hint;$('shuffle').onclick=shuffle;$('restart').onclick=()=>game&&newGame(game.level);$('homeBtn').onclick=home;$('homeWin').onclick=()=>{$('win').close();home()};$('resetProgress').onclick=()=>{if(confirm('Réinitialiser toute la progression ?')){localStorage.removeItem('mahjongPirateState');state={coins:0,gems:0,level:1,xp:0,bestScore:0,unlocked:1};save()}};updateHud();