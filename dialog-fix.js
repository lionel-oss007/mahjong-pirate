// Correctif de sécurité des fenêtres de fin de partie.
// Le bouton Accueil doit toujours fermer la fenêtre de victoire avant de revenir à l'accueil.
document.addEventListener('DOMContentLoaded',()=>{
  const win=document.getElementById('win');
  const homeWin=document.getElementById('homeWin');
  if(homeWin) homeWin.addEventListener('click',()=>{
    if(win?.open) win.close();
    document.getElementById('game')?.classList.add('hidden');
    document.getElementById('map')?.classList.add('hidden');
    document.getElementById('home')?.classList.remove('hidden');
    if(typeof window.showPirateHome==='function') window.showPirateHome();
  });
});
