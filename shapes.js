/* Formes réelles des plateaux Mahjong Pirates — V5. Plateaux plus grands, silhouettes nettes et géométrie responsive. */
(function(){
 const mobile=window.matchMedia&&window.matchMedia('(max-width:700px)').matches;
 const SX=mobile?44:48,SY=mobile?50:56,W=mobile?52:58,H=mobile?62:68;
 const boardW=mobile?352:412,boardH=mobile?586:646;
 const targets={1:[26,12,8,2,0],2:[30,16,8,6,0],3:[36,20,12,6,0],4:[42,24,12,6,0],5:[48,26,14,8,0],6:[54,30,16,8,0],7:[60,34,18,8,0],8:[60,40,20,12,0],9:[60,42,24,12,6],10:[60,42,24,12,6],11:[60,42,24,12,6],12:[60,42,24,12,6],13:[60,42,24,12,6],14:[60,42,24,12,6],15:[60,42,24,12,6]};
 const names={1:'tortue',2:'pyramide',3:'diamant',4:'navire',5:'fort'};
 const base={
  /* Tortue : carapace large, pattes latérales, queue centrale. */
  tortue:[
   ['011110','111111','111111','111111','111111','011110'],
   ['0110','1111','1111','0110'],
   ['1111','1111'],
   ['11']
  ],
  /* Pyramide : base pleine et étages qui se resserrent vers le sommet. */
  pyramide:[
   ['001100','011110','111111','111111','111111','111111'],
   ['00100','01110','11111','11111','00110'],
   ['1111','1111'],
   ['111','111']
  ],
  /* Diamant : deux pointes bien visibles et un cœur large. */
  diamant:[
   ['001100','011110','111111','111111','111111','111111','011110','001100'],
   ['00100','01110','11111','11111','11111','01110','00100'],
   ['1111','1111','1111'],
   ['111','111']
  ],
  /* Navire : proue fine, coque large, pont central. */
  navire:[
   ['000110','001111','011111','111111','111111','111111','111111','011111','001110'],
   ['011110','011110','111111','011110','011110'],
   ['1111','1111','1111'],
   ['111','111']
  ],
  /* Fort : remparts épais, tours latérales et cœur défensif. */
  fort:[
   ['011110','111111','111111','111111','111111','111111','111111','011110','011110'],
   ['110011','111111','111111','111111','110011'],
   ['11011','11111','11111','11011'],
   ['1111','1111']
  ]
 };
 function grid(name,l){
  if(name!=='archipel')return base[name][l]||[];
  if(l===0)return['111111','111111','111111','111111','111111','111111','111111','111111','111111','111111'];
  if(l===1)return['11111','11111','11111','11111','11111','11111','11111','11111'];
  if(l===2)return['1111','1111','1111','1111','1111','1111'];
  if(l===3)return['111','111','111','111'];
  return['111','111'];
 }
 function cellsFor(rows,wanted){
  const cols=Math.max(...rows.map(r=>r.length)),cells=[];
  rows.forEach((row,r)=>[...row].forEach((v,c)=>v==='1'&&cells.push({r,c})));
  if(cells.length>wanted){
   const cr=(rows.length-1)/2,cc=(cols-1)/2;
   cells.sort((a,b)=>((a.r-cr)**2+(a.c-cc)**2)-((b.r-cr)**2+(b.c-cc)**2));
   cells.length=wanted;
  }
  return{cells,cols};
 }
 window.layout=function(level){
  const shape=names[level]||'archipel',out=[];
  (targets[level]||targets[15]).forEach((wanted,l)=>{
   if(!wanted)return;
   const rows=grid(shape,l),g=cellsFor(rows,wanted),sw=(g.cols-1)*SX+W,sh=(rows.length-1)*SY+H;
   const ox=(boardW-sw)/2+l*2,oy=(boardH-sh)/2+l*2;
   g.cells.forEach(p=>out.push({x:ox+p.c*SX,y:oy+p.r*SY,l}));
  });
  return out.map((p,i)=>({...p,id:i}));
 };
 window.__mahjongPirateShapes={version:'5.0',targets};
})();
