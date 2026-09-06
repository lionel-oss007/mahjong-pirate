const symbols=['🪙','⚓','☠️','🏴‍☠️','💎','🦜','🐙','🧭','💰','🌴','🍹','🚢','🦈','🐚','⭐','🔱','🏝️','🗝️','💀','🌊'];
const names=['Île du Départ','Baie des Palmiers','Île du Kraken','Fort des Flibustiers','Île au Trésor'];
const counts=[0,24,28,32,36,40];
const difficulties=['','Facile','Facile','Moyen','Difficile','Expert'];
const TILE_W=58,TILE_H=70;
let state=JSON.parse(localStorage.getItem('mahjongPirateState')||'null')||{coins:0,gems:0,level:1,xp:0,bestScore:0,unlocked:1};
let game=null,timer=null,startedAt=0;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('mahjongPirateState',JSON.stringify(state));updateHud()}
function updateHud(){$('coins').textContent=state.coins;$('gems').textContent=state.gems;$('captainName').textContent=state.level<3?'Mousse des Caraïbes':state.level<5?'Capitaine Corsaire':'Maître des Sept Mers';$('level').textContent=state.level;$('xp').textContent=state.xp;$('bestScore').textContent=state.bestScore;$('mapProgress').textContent=`${state.unlocked}/5`;document.querySelectorAll('.island').forEach((b,i)=>{b.classList.toggle('locked',i+1>state.unlocked);b.classList.toggle('current',i+1===state.unlocked)})}

// Règles Mahjong Solitaire : une tuile est libre si aucune tuile ne la recouvre
// et si son côté gauche OU son côté droit est totalement ouvert.
function rectOverlap(a,b){return a.x<b.x+TILE_W&&a.x+TILE_W>b.x&&a.y<b.y+TILE_H&&a.y+TILE_H>b.y}
function freeTile(t,tiles){
  if(t.removed)return false;
  // Une tuile située au-dessus et qui la recouvre la bloque.
  for(const o of tiles){if(o.removed||o.l<=t.l)continue;if(rectOverlap(t,o))return false}
  let leftBlocked=false,rightBlocked=false;
  // À même hauteur, une tuile ne bloque qu'un côté. Les deux côtés bloqués = tuile indisponible.
  for(const o of tiles){
    if(o.removed||o.l!==t.l||o.id===t.id||!rectOverlapY(t,o))continue;
    if(o.x+TILE_W<=t.x+6&&o.x+TILE_W>t.x-10)leftBlocked=true;
    if(o.x>=t.x+TILE_W-6&&o.x<t.x+TILE_W+10)rightBlocked=true;
  }
  return !(leftBlocked&&rightBlocked);
}
function rectOverlapY(a,b){return a.y<b.y+TILE_H&&a.y+TILE_H>b.y}

function layout(level){
  const target=counts[level],cols=8,rows=Math.ceil(target/cols),positions=[];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if(positions.length<target)positions.push({x:45+c*54+(r%2?7:0),y:30+r*68,l:0});
  // Quelques tuiles surélevées au centre, comme dans un vrai plateau Mahjong.
  if(level>=3){const n=Math.min(4,target-24);const candidates=positions.filter(p=>p.y>=95&&p.y<=235);const start=Math.max(0,Math.floor(candidates.length/2)-Math.ceil(n/2));for(let i=0;i<n;i++){const p=candidates[start+i];if(p){p.l=1;p.x+=10;p.y+=9}}}
  return positions.map((p,i)=>({...p,id:i}));
}

// Génération garantie jouable : on construit une séquence de retrait valide,
// puis on attribue le même symbole à chaque paire de cette séquence.
function buildSolvable(level){
  for(let attempt=0;attempt<500;attempt++){
    const positions=layout(level),remaining=positions.map(p=>({...p,removed:false})),pairs=[];
    while(remaining.some(t=>!t.removed)){
      const free=remaining.filter(t=>freeTile(t,remaining));
      if(free.length<2)break;
      free.sort(()=>Math.random()-.5);
      const a=free[0];
      const candidates=free.filter(t=>t.id!==a.id);
      if(!candidates.length)break;
      const b=candidates[Math.floor(Math.random()*candidates.length)];
      a.removed=b.removed=true;pairs.push([a.id,b.id]);
    }
    if(pairs.length===level*0+counts[level]/2){
      const tiles=positions.map(p=>({...p,removed:false,symbol:null}));
      pairs.forEach(([a,b],i)=>{const s=symbols[i%symbols.length];tiles[a].symbol=s;tiles[b].symbol=s});
      return tiles;
    }
  }
  // Secours : disposition linéaire toujours jouable.
  const positions=[];for(let i=0;i<counts[level];i++)positions.push({id:i,x:45+(i%8)*54,y:30+Math.floor(i/8)*68,l:0,removed:false,symbol:symbols[Math.floor(i/2)%symbols.length]});
  return positions;
}

function newGame(level){clearInterval(timer);game={level,tiles:buildSolvable(level),selected:null,score:0,moves:0,pairs:0};startedAt=Date.now();$('map').classList.add('hidden');$('game').classList.remove('hidden');$('islandTitle').textContent=names[level];$('difficulty').textContent=difficulties[level];$('msg').textContent='Règle : choisis deux tuiles identiques et libres.';render();timer=setInterval(tick,500)}
function tick(){if(!game)return;const sec=Math.floor((Date.now()-startedAt)/1000);$('time').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}
function render(){const board=$('board');board.innerHTML='';board.style.width=levelWidth(game.level)+'px';board.style.height=game.level>=4?'610px':'560px';for(const t of game.tiles){if(t.removed)continue;const free=freeTile(t,game.tiles),b=document.createElement('button');b.className='tile '+(free?'free':'blocked');if(game.selected===t.id)b.classList.add('selected');b.textContent=t.symbol;b.style.left=t.x+'px';b.style.top=t.y+'px';b.style.zIndex=10+t.l;b.setAttribute('aria-label',free?`Tuile libre ${t.symbol}`:`Tuile bloquée ${t.symbol}`);b.onclick=()=>pick(t.id);board.appendChild(b)}$('score').textContent=game.score;$('remaining').textContent=game.tiles.filter(t=>!t.removed).length;$('moves').textContent=game.moves;$('pairs').textContent=game.pairs}
function levelWidth(l){return l<=2?650:l===3?720:l===4?800:850}
function legalPairs(){const free=game.tiles.filter(t=>!t.removed&&freeTile(t,game.tiles)),out=[];for(let i=0;i<free.length;i++)for(let j=i+1;j<free.length;j++)if(free[i].symbol===free[j].symbol)out.push([free[i],free[j]]);return out}
function pick(id){const t=game.tiles.find(x=>x.id===id);if(!t||!freeTile(t,game.tiles))return;if(game.selected===null){game.selected=id;render();return}const a=game.tiles.find(x=>x.id===game.selected);game.moves++;if(a&&a.id!==t.id&&a.symbol===t.symbol&&freeTile(a,game.tiles)){a.removed=t.removed=true;game.pairs++;game.score+=100+game.level*15;game.selected=null;sfx(true);$('msg').textContent='⚓ Paire valide ! Les deux tuiles sont retirées.';}else{game.selected=null;sfx(false);$('msg').textContent='❌ Paire impossible : mêmes symboles + deux tuiles libres sont nécessaires.'}render();if(game.tiles.every(t=>t.removed))win();else if(!legalPairs().length)$('msg').textContent='☠️ Aucune paire disponible. Mélange le plateau pour continuer.'}
function hint(){if(!game)return;const pair=legalPairs()[0];if(pair){game.selected=pair[0].id;render();$('msg').textContent=`💡 Indice : ${pair[0].symbol} peut être associé à une autre tuile libre.`;game.score=Math.max(0,game.score-10)}else $('msg').textContent='☠️ Aucune paire libre. Mélange le plateau.'}
function shuffle(){if(!game)return;const active=game.tiles.filter(t=>!t.removed),syms=active.map(t=>t.symbol).sort(()=>Math.random()-.5);active.forEach((t,i)=>t.symbol=syms[i]);game.score=Math.max(0,game.score-25);game.selected=null;render();$('msg').textContent='🔀 Symboles mélangés. Les règles de liberté restent inchangées.'}
function win(){clearInterval(timer);const sec=Math.floor((Date.now()-startedAt)/1000),stars=sec<=90?3:sec<=180?2:1,reward=20*game.level+stars*5,xp=25*game.level+stars*10;state.coins+=reward;state.xp+=xp;state.level=Math.max(state.level,Math.min(5,1+Math.floor(state.xp/100)));if(game.score>state.bestScore)state.bestScore=game.score;if(game.level===state.unlocked&&state.unlocked<5)state.unlocked++;save();$('winText').textContent=`Île terminée en ${sec}s avec ${game.moves} coups.`;$('stars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);$('rewardCoins').textContent=reward;$('rewardXp').textContent=xp;$('next').textContent=game.level<5?'Île suivante':'Retour à la carte';$('next').onclick=()=>{$('win').close();if(game.level<5)newGame(game.level+1);else home()};$('win').showModal();sfx(true)}
function home(){clearInterval(timer);game=null;$('game').classList.add('hidden');$('map').classList.remove('hidden');$('msg').textContent='';updateHud()}
function sfx(ok){try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.frequency.value=ok?660:180;g.gain.value=.04;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.09)}catch(e){}}
document.querySelectorAll('.island').forEach(b=>b.onclick=()=>{const l=+b.dataset.level;if(l<=state.unlocked)newGame(l)});$('hint').onclick=hint;$('shuffle').onclick=shuffle;$('restart').onclick=()=>newGame(game.level);$('homeBtn').onclick=home;$('homeWin').onclick=()=>{$('win').close();home()};$('resetProgress').onclick=()=>{if(confirm('Réinitialiser toute la progression ?')){localStorage.removeItem('mahjongPirateState');state={coins:0,gems:0,level:1,xp:0,bestScore:0,unlocked:1};save()}};updateHud();
