(function(){
  function boot(){
    const home=document.getElementById('home');
    if(!home)return;
    const startLevel=(level)=>{
      home.classList.add('hidden');
      const map=document.getElementById('map');
      if(map)map.classList.add('hidden');
      if(typeof window.newGame==='function')window.newGame(level);
    };
    const showHome=()=>{
      if(typeof window.home==='function')window.home();
      const map=document.getElementById('map');
      const game=document.getElementById('game');
      if(map)map.classList.add('hidden');
      if(game)game.classList.add('hidden');
      home.classList.remove('hidden');
    };
    document.querySelectorAll('[data-start-level]').forEach(btn=>{
      if(btn.id==='dailyPlay2')return;
      btn.addEventListener('click',()=>startLevel(Number(btn.dataset.startLevel)||1));
    });
    document.querySelectorAll('[data-open-map]').forEach(btn=>btn.addEventListener('click',()=>{
      home.classList.add('hidden');
      const map=document.getElementById('map');
      if(map)map.classList.remove('hidden');
    }));
    document.querySelectorAll('[data-home]').forEach(btn=>btn.addEventListener('click',showHome));
    const homeBtn=document.getElementById('homeBtn');
    if(homeBtn)homeBtn.addEventListener('click',showHome);
    const daily=document.getElementById('dailyPlay');
    if(daily)daily.addEventListener('click',()=>{
      const current=document.querySelector('.island.current');
      startLevel(current?Number(current.dataset.level)||1:1);
    });
    const daily2=document.getElementById('dailyPlay2');
    if(daily2)daily2.addEventListener('click',()=>{
      const current=document.querySelector('.island.current');
      startLevel(current?Number(current.dataset.level)||1:1);
    });
    const h2=document.getElementById('hint2');
    if(h2)h2.addEventListener('click',()=>{if(typeof window.hint==='function')window.hint()});
    const s2=document.getElementById('shuffle2');
    if(s2)s2.addEventListener('click',()=>{if(typeof window.shuffle==='function')window.shuffle()});
    const reset=document.getElementById('resetProgress');
    if(reset)reset.addEventListener('click',()=>{
      if(confirm('Réinitialiser toute la progression ?')){
        localStorage.removeItem('mahjongPirateState');
        localStorage.removeItem('mahjongPirateProgression');
        localStorage.removeItem('mahjongPirateMissions');
        location.reload();
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();