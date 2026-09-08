(function(){
  const SUITS={dots:'Cercles',bamboo:'Bambous',characters:'Caractères'};
  const winds=[['east','東','Est'],['south','南','Sud'],['west','西','Ouest'],['north','北','Nord']];
  const dragons=[['red','中','Rouge'],['green','發','Vert'],['white','白','Blanc']];
  const flowers=[['🌸','Prunier'],['🌺','Orchidée'],['🌼','Chrysanthème'],['🌻','Bambou'],['☀️','Printemps'],['🍂','Été'],['❄️','Automne'],['🌙','Hiver']];
  let g=null;
  const $=id=>document.getElementById(id);
  function buildWall(){
    const a=[];
    for(const suit of Object.keys(SUITS))for(let n=1;n<=9;n++)for(let k=0;k<4;k++)a.push({id:`${suit}-${n}-${k}`,type:'suit',suit,n,label:String(n),symbol:suit==='dots'?'●':suit==='bamboo'?'🎋':'漢'});
    for(const [id,symbol,name] of winds)for(let k=0;k<4;k++)a.push({id:`${id}-${k}`,type:'wind',key:id,symbol,name,label:symbol});
    for(const [id,symbol,name] of dragons)for(let k=0;k<4;k++)a.push({id:`dragon-${id}-${k}`,type:'dragon',key:id,symbol,name,label:symbol});
    flowers.forEach((f,i)=>a.push({id:`flower-${i}`,type:'flower',symbol:f[0],name:f[1],label:f[0]}));
    return a.sort(()=>Math.random()-.5);
  }
  function key(t){return t.type==='suit'?`${t.suit}-${t.n}`:t.type==='wind'?`wind-${t.key}`:t.type==='dragon'?`dragon-${t.key}`:`flower-${t.id}`}
  function same(a,b){return a.type!=='flower'&&b.type!=='flower'&&key(a)===key(b)}
  function isSeq(a,b,c){return a.type==='suit'&&b.type==='suit'&&c.type==='suit'&&a.suit===b.suit&&b.suit===c.suit&&a.n+1===b.n&&b.n+1===c.n}
  function sortHand(){g.hand.sort((a,b)=>{const order={dots:1,bamboo:2,characters:3};if(a.type!==b.type)return ({suit:1,wind:2,dragon:3,flower:4}[a.type])-({suit:1,wind:2,dragon:3,flower:4}[b.type]);if(a.type==='suit')return order[a.suit]-order[b.suit]||a.n-b.n;return a.label.localeCompare(b.label)})}
  function replaceFlowers(){let changed=true;while(changed){changed=false;const i=g.hand.findIndex(t=>t.type==='flower');if(i<0)break;const f=g.hand.splice(i,1)[0];g.flowers++;if(g.wall.length){g.hand.push(g.wall.shift());changed=true}}sortHand()}
  function draw(){if(!g||g.wall.length===0)return false;g.hand.push(g.wall.shift());replaceFlowers();return true}
  function counts(tiles){const m=new Map();tiles.forEach(t=>m.set(key(t),(m.get(key(t))||0)+1));return m}
  function canMeld(tiles){
    if(!tiles.length)return true;
    const m=counts(tiles),first=tiles[0],k=key(first);
    if((m.get(k)||0)>=3){const rest=tiles.slice();let n=0;for(let i=rest.length-1;i>=0&&n<3;i--)if(key(rest[i])===k){rest.splice(i,1);n++}if(canMeld(rest))return true}
    if(first.type==='suit'){
      for(const n of [first.n+1,first.n+2]){
        if(n>9)continue;
        const need=[first.n+1,first.n+2];if(n!==first.n+2)continue;
        const rest=tiles.slice();let ok=true;for(const want of need){const i=rest.findIndex(t=>t.type==='suit'&&t.suit===first.suit&&t.n===want);if(i<0){ok=false;break}rest.splice(i,1)}if(ok&&canMeld(rest))return true;
      }
    }
    return false;
  }
  function winningHand(tiles){
    if(tiles.length!==14)return false;
    const m=counts(tiles);for(const [k,n] of m){if(n<2)continue;let rest=tiles.slice();let removed=0;for(let i=rest.length-1;i>=0&&removed<2;i--)if(key(rest[i])===k){rest.splice(i,1);removed++}if(removed===2&&canMeld(rest))return true}return false;
  }
  function scoreHand(){
    let pts=0;const m=counts(g.hand);
    if(g.selfDraw)pts+=1;
    pts+=g.flowers;
    let pungs=0,allHonors=true,allPungs=true;
    for(const [k,n] of m){const t=g.hand.find(x=>key(x)===k);if(t.type==='suit')allHonors=false;if(n>=3)pungs++}
    // Adaptation MCR : quelques motifs simples et transparents, avec seuil de 8 points.
    if(allHonors)pts+=10;
    if(pungs===4){pts+=6;allPungs=true}
    if(pts<8&&g.flowers>=4)pts+=4;
    if(pts<8)pts=8; // mode solo : on conserve le seuil de Hu sans reproduire les 81 combinaisons.
    return pts;
  }
  function start(){
    document.getElementById('home')?.classList.add('hidden');document.getElementById('map')?.classList.add('hidden');document.getElementById('game')?.classList.remove('hidden');
    g={wall:buildWall(),hand:[],discard:[],flowers:0,turns:0,moves:0,selfDraw:false,selected:null,score:0};
    for(let i=0;i<13;i++)g.hand.push(g.wall.shift());replaceFlowers();
    render();
  }
  function discard(i){if(!g||g.hand.length!==14)return;const t=g.hand.splice(i,1)[0];g.discard.push(t);g.moves++;g.selfDraw=false;sortHand();if(winningHand(g.hand))finish();else if(!draw())endDraw();else{g.selfDraw=true;g.turns++;render()}}
  function finish(){g.score=scoreHand();render();setTimeout(()=>{const w=document.createElement('div');w.className='cm-win';w.innerHTML=`<div class="cm-win-card"><div class="cm-crown">🏴‍☠️</div><h2>HU ! Main gagnante</h2><p>Ta main respecte la structure <b>1 paire + 4 éléments</b>.</p><strong>${g.score} points MCR adaptés</strong><button id="cmAgain">Nouvelle donne</button><button id="cmBack">Retour au port</button></div>`;document.body.appendChild(w);$('cmAgain').onclick=()=>{w.remove();start()};$('cmBack').onclick=()=>{w.remove();document.getElementById('home')?.classList.remove('hidden');document.getElementById('game')?.classList.add('hidden')}} ,120)}
  function endDraw(){render();setTimeout(()=>alert('Mur épuisé : aucune main gagnante. La partie est nulle.'),50)}
  function render(){
    if(!g)return;let root=$('classicMahjong');if(!root){root=document.createElement('section');root.id='classicMahjong';const gp=$('game');gp?.appendChild(root)}root.classList.remove('hidden');
    root.innerHTML=`<div class="cm-top"><div><small>MAH-JONG CLASSIQUE · ADAPTATION PIRATE</small><h2>⚓ La Grande Muraille du Capitaine</h2></div><button id="cmRules">📜 Règles</button></div><div class="cm-stats"><span>🧱 Mur <b>${g.wall.length}</b></span><span>🌸 Fleurs <b>${g.flowers}</b></span><span>🎯 Tours <b>${g.turns}</b></span><span>⭐ Score <b>${g.score}</b></span></div><div class="cm-wall"><span>🀄</span><b>Mur de pioche</b><small>${g.wall.length} tuiles restantes</small></div><div class="cm-title">Ta main <b>${g.hand.length}/14</b></div><div class="cm-hand">${g.hand.map((t,i)=>`<button class="cm-tile ${g.selected===i?'sel':''}" data-i="${i}" title="${t.name||t.n||t.label}"><b>${t.label}</b>${t.type==='suit'?`<small>${t.suit==='dots'?'● Cercles':t.suit==='bamboo'?'🎋 Bambous':'漢 Caractères'}</small>`:`<small>${t.name||''}</small>`}</button>`).join('')}</div><div class="cm-help">${g.hand.length===14?'Choisis une tuile à défausser.':`Pioche une tuile : ${g.hand.length}/14`}</div><div class="cm-discard"><div><b>Défausses</b><small>${g.discard.length} tuiles</small></div><div class="cm-discards">${g.discard.slice(-24).map(t=>`<span>${t.label}</span>`).join('')}</div></div>`;
    root.querySelectorAll('.cm-tile').forEach(b=>b.onclick=()=>{g.selected=Number(b.dataset.i);if(g.hand.length===14)discard(g.selected)});
    $('cmRules').onclick=rules;
  }
  function rules(){const w=document.createElement('div');w.className='cm-rules';w.innerHTML=`<div class="cm-rules-card"><button id="cmRulesClose">✕</button><h2>📜 Règles du Mah-Jong Pirate</h2><p>Cette version reprend la structure du Mah-Jong MCR décrite par Règle du Jeu, mais la transforme en <b>expérience solo mobile</b>.</p><ul><li>🀄 144 tuiles : 3 familles de 9, 4 exemplaires chacune, 4 vents, 3 dragons et 8 fleurs.</li><li>🌸 Une Fleur ne forme pas de combinaison : elle est exposée puis remplacée par une tuile du mur.</li><li>🃏 La main contient 13 tuiles entre les tours ; après une pioche elle passe à 14.</li><li>🧩 Une main gagnante = <b>1 paire + 4 éléments</b> : Chows (3 qui se suivent), Pungs (3 identiques) ou Kongs (4 identiques).</li><li>🏴‍☠️ Ici, les autres joueurs sont retirés pour une adaptation solo : pas de défausse adverse ni de réclamation Chi/Pung/Kong.</li><li>🏆 Le bouton Hu apparaît automatiquement quand la main est complète et gagnante ; le scoring MCR est volontairement simplifié pour le mode solo.</li></ul><p class="cm-source">Source des règles : <a href="https://www.regledujeu.fr/mah-jong/" target="_blank" rel="noopener">Règles Officielles du Mah-Jong — Règle du Jeu</a>.</p></div>`;document.body.appendChild(w);$('cmRulesClose').onclick=()=>w.remove()}
  function init(){
    if(window.__classicMahjongLoaded)return;window.__classicMahjongLoaded=true;
    const s=document.createElement('style');s.textContent=`#classicMahjong{margin:12px auto 0;max-width:980px;color:#fff0bd;font-family:Arial,sans-serif}.cm-top{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:10px 12px;background:linear-gradient(145deg,#5d3018,#2c1309);border:2px solid #c48a39;border-radius:14px}.cm-top h2{margin:3px 0;font-family:Georgia,serif}.cm-top small{font-weight:900;color:#e8c36e}.cm-top button,.cm-win button{border:2px solid #c48a39;border-radius:10px;padding:9px 12px;background:#137e50;color:#fff;font-weight:900}.cm-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:9px 0}.cm-stats span{padding:8px;text-align:center;border:2px solid #a96f2c;border-radius:9px;background:#43210f}.cm-stats b{color:#ffe07e}.cm-wall{display:flex;align-items:center;gap:10px;padding:10px;border:2px solid #a96f2c;border-radius:12px;background:linear-gradient(145deg,#0b6575,#073b4b);box-shadow:inset 0 0 18px #001f2a}.cm-wall span{font-size:2rem}.cm-wall small{margin-left:auto}.cm-title{margin:10px 0 5px;font-weight:900}.cm-hand{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;padding:12px;border-radius:15px;background:#063a49;border:3px solid #9b642b;min-height:110px}.cm-tile{width:62px;height:82px;border:2px solid #b98035;border-radius:8px;background:linear-gradient(145deg,#fff8dd,#dfbd70);color:#4a220e;box-shadow:0 5px 0 #4b2411,0 7px 12px #00141d88;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center}.cm-tile b{font-size:1.9rem}.cm-tile small{font-size:.48rem;font-weight:900;margin-top:4px}.cm-tile:hover,.cm-tile.sel{transform:translateY(-4px);box-shadow:0 9px 0 #4b2411,0 0 0 3px #f5cf63}.cm-help{text-align:center;min-height:28px;padding:8px;color:#f4d48a}.cm-discard{margin-top:10px;padding:10px;border:2px solid #8e5a29;border-radius:12px;background:#052f3c}.cm-discard>div:first-child{display:flex;justify-content:space-between}.cm-discard small{color:#d7bc80}.cm-discards{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px}.cm-discards span{display:grid;place-items:center;width:34px;height:40px;background:#f0d79a;color:#3e1c0c;border-radius:4px;font-size:1.1rem}.cm-win,.cm-rules{position:fixed;inset:0;z-index:500;display:grid;place-items:center;background:#00131dcc;padding:18px}.cm-win-card,.cm-rules-card{max-width:620px;width:100%;padding:24px;border:4px solid #c58a39;border-radius:20px;background:linear-gradient(145deg,#fff0bf,#dcae61);color:#43200f;box-shadow:0 25px 70px #000b;text-align:center}.cm-win-card h2,.cm-rules-card h2{font-family:Georgia,serif}.cm-crown{font-size:3rem}.cm-win-card button{margin:10px 4px}.cm-rules-card{text-align:left;position:relative;max-height:85vh;overflow:auto}.cm-rules-card button#cmRulesClose{position:absolute;right:12px;top:12px;border:0;background:#4d2412;color:#fff;padding:7px 10px;border-radius:8px}.cm-rules-card li{margin:8px 0;line-height:1.35}.cm-source{font-size:.8rem;border-top:1px solid #a56b2c;padding-top:10px}.cm-source a{color:#0b6280;font-weight:900}@media(max-width:600px){.cm-stats{grid-template-columns:repeat(2,1fr)}.cm-tile{width:54px;height:74px}.cm-tile b{font-size:1.6rem}.cm-top h2{font-size:1.05rem}.cm-wall small{display:none}}`;
    document.head.appendChild(s);
    window.startClassicMahjong=start;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
