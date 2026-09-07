(function(){
  function boot(){
    const home=document.getElementById('home');
    if(!home)return;
    document.querySelectorAll('[data-start-level]').forEach(btn=>btn.addEventListener('click',()=>{const l=Number(btn.dataset.startLevel)||1;if(typeof window.newGame==='function')window.newGame(l)}));
    document.querySelectorAll('[data-open-map]').forEach(btn=>btn.addEventListener('click',()=>{home.classList.add('hidden');const map=document.getElementById('map');if(map)map.classList.remove('hidden')}));
    document.querySelectorAll('[data-home]').forEach(btn=>btn.addEventListener('click',()=>{if(typeof window.home==='function')window.home();home.classList.remove('hidden')}));
    const homeBtn=document.getElementById('homeBtn');if(homeBtn)homeBtn.addEventListener('click',()=>home.classList.remove('hidden'));
    const daily=document.getElementById('dailyPlay');if(daily)daily.addEventListener('click',()=>{const current=document.querySelector('.island.current');const l=current?Number(current.dataset.level)||1:1;if(typeof window.newGame==='function')window.newGame(l)});
    const daily2=document.getElementById('dailyPlay2');if(daily2)daily2.addEventListener('click',()=>{const current=document.querySelector('.island.current');const l=current?Number(current.dataset.level)||1:1;if(typeof window.newGame==='function')window.newGame(l)});
    const h2=document.getElementById('hint2');if(h2)h2.addEventListener('click',()=>{if(typeof window.hint==='function')window.hint()});
    const s2=document.getElementById('shuffle2');if(s2)s2.addEventListener('click',()=>{if(typeof window.shuffle==='function')window.shuffle()});
    const reset=document.getElementById('resetProgress');if(reset)reset.addEventListener('click',()=>{if(confirm('Réinitialiser toute la progression ?')){localStorage.removeItem('mahjongPirateState');localStorage.removeItem('mahjongPirateProgression');localStorage.removeItem('mahjongPirateMissions');location.reload()}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();