(function(){
 const KEY='mahjongPirateArsenal';
 const TITLES=[
  {level:1,icon:'🪶',name:'Mousse des Caraïbes'},
  {level:2,icon:'⚓',name:'Matelot des mers'},
  {level:3,icon:'🗺️',name:'Navigateur pirate'},
  {level:4,icon:'🏴‍☠️',name:'Capitaine Corsaire'},
  {level:5,icon:'💀',name:'Maître des Sept Mers'}
 ];
 const ITEMS=[
  {id:'compass',icon:'🧭',name:'Boussole d'Azur',desc:'Réduit le coût d’un indice.',cost:3},
  {id:'map',icon:'🗺️',name:'Carte porte-bonheur',desc:'Protège une partie contre un mélange payant.',cost:3},
  {id:'crown',icon:'👑',name:'Couronne du Kraken',desc:'Titre prestigieux débloqué au niveau 5.',cost:0}
 ];
 let data=load();
 function load(){try{return Object.assign({owned:{},title:null},JSON.parse(localStorage.getItem(KEY)||'null')||{});}catch(e){return {owned:{},title:null}}}
 function saveA(){localStorage.setItem(KEY,JSON.stringify(data));}
 function inject(){
  if(document.getElementById('arsenalPanel'))return;
  const s=document.createElement('style');s.textContent=`#arsenalPanel{margin-top:14px;border:1px solid #9c6a2c;border-radius:18px;background:linear-gradient(145deg,#ead19a,#f8e9c2);overflow:hidden;box-shadow:0 10px 24px #2a170a22;color:#422719}#arsenalPanel .ah{display:flex;justify-content:space-between;align-items:center;padding:13px 15px 8px}#arsenalPanel h2{margin:0;font-size:1.05rem}#arsenalPanel .title{font-size:.72rem;opacity:.75;margin-top:3px}.arsenal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:0 10px 11px}.gear{background:#fff8e9;border:1px solid #9c6a2c88;border-radius:13px;padding:10px;min-height:110px}.gear.locked{opacity:.58;filter:saturate(.65)}.gear-icon{font-size:1.5rem}.gear strong{display:block;font-size:.82rem;margin:3px 0}.gear small{display:block;font-size:.67rem;line-height:1.25;min-height:30px}.gear button{margin-top:7px;border:1px solid #b98232;background:#174b59;color:#f8e7b1;border-radius:8px;padding:5px 8px;font-weight:800;cursor:pointer}.gear .owned{color:#286d45;font-weight:800;font-size:.7rem}@media(max-width:720px){.arsenal-grid{grid-template-columns:1fr}}`;document.head.appendChild(s);
  const p=document.createElement('section');p.id='arsenalPanel';p.innerHTML='<div class="ah"><div><h2>⚔️ Arsenal du capitaine</h2><div id="titleText" class="title"></div></div><span>💎</span></div><div id="arsenalGrid" class="arsenal-grid"></div>';
  const captain=document.querySelector('.captain-card');(captain||document.querySelector('.shell')).insertAdjacentElement('afterend',p);refresh();
 }
 function refresh(){const grid=document.getElementById('arsenalGrid');if(!grid)return;const lvl=Number(state.level)||1;const title=data.title||TITLES[Math.min(4,lvl-1)];document.getElementById('titleText').textContent=title.icon+' Titre : '+title.name;grid.innerHTML=ITEMS.map(i=>{const owned=!!data.owned[i.id];const locked=i.id==='crown'&&lvl<5;return `<article class="gear ${locked?'locked':''}"><span class="gear-icon">${i.icon}</span><strong>${i.name}</strong><small>${i.desc}</small>${locked?'<span class="owned">🔒 Niveau 5</span>':owned?'<span class="owned">✓ Possédé</span>':i.cost?`<button data-buy="${i.id}">Acheter · ${i.cost} 💎</button>`:'<span class="owned">✓ Débloqué</span>'}</article>`}).join('');grid.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buy(b.dataset.buy));}
 function buy(id){const item=ITEMS.find(x=>x.id===id);if(!item||data.owned[id])return;if((Number(state.gems)||0)<item.cost){alert('💎 Pas assez de gemmes pour cet équipement.');return}state.gems-=item.cost;data.owned[id]=true;saveA();if(typeof save==='function')save();refresh();if(typeof sfx==='function')sfx(true);}
 function init(){inject();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();