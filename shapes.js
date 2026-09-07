/* Formes réelles des plateaux Mahjong Pirates. Le moteur conserve les mêmes règles de tuiles libres. */
(function(){
 const SX=44,SY=50,W=52,H=62,boardW=6*SX+W+18,boardH=10*SY+H+18;
 const targets={1:[24,12,8,4,0],2:[30,16,8,6,0],3:[36,20,10,6,0],4:[42,24,12,6,0],5:[48,26,14,8,0],6:[54,30,16,8,0],7:[60,34,18,8,0],8:[60,40,20,12,0],9:[60,42,24,12,6],10:[60,42,24,12,6],11:[60,42,24,12,6],12:[60,42,24,12,6],13:[60,42,24,12,6],14:[60,42,24,12,6],15:[60,42,24,12,6]};
 const names={1:'tortue',2:'pyramide',3:'diamant',4:'navire',5:'fort'};
 const base={
  tortue:[['001100','111111','111111','111111','011110'],['0110','1111','1111'],['0110','1111'],['11','11']],
  pyramide:[['001100','011110','111111','111111','111111','111111'],['00100','01110','11111','11111'],['1111','1111'],['111','111']],
  diamant:[['001100','011110','111111','111111','111111','111111','011110','001100'],['00100','01110','11111','11111','01110','00100'],['1111','1111','1111'],['111','111']],
  navire:[['001100','011110','111111','111111','111111','111111','111111','111111'],['011110','011110','111111','011110'],['1111','1111','1111'],['111','111']],
  fort:[['011110','111111','111111','111111','111111','111111','111111','111111'],['110011','111111','111111','111111','110011'],['11011','11111','11011','00100'],['1111','1111']]
 };
 function grid(name,l){
  if(name!=='archipel')return base[name][l]||[];
  if(l===0)return['110011','111111','111111','111111','111111','111111','111111','111111','111111','110011'];
  if(l===1)return['11111','11111','11111','11111','11111','11111','11111','11111'];
  if(l===2)return['1111','1111','1111','1111','1111','1111'];
  if(l===3)return['111','111','111','111'];
  return['111','111'];
 }
 function cellsFor(rows,wanted){const cols=Math.max(...rows.map(r=>r.length)),cells=[];rows.forEach((row,r)=>[...row].forEach((v,c)=>v==='1'&&cells.push({r,c})));if(cells.length>wanted){const cr=(rows.length-1)/2,cc=(cols-1)/2;cells.sort((a,b)=>((a.r-cr)**2+(a.c-cc)**2)-((b.r-cr)**2+(b.c-cc)**2));cells.length=wanted}return{cells,cols};}
 window.layout=function(level){const shape=names[level]||'archipel',out=[];(targets[level]||targets[15]).forEach((wanted,l)=>{if(!wanted)return;const rows=grid(shape,l),g=cellsFor(rows,wanted),sw=(g.cols-1)*SX+W,sh=(rows.length-1)*SY+H,ox=(boardW-sw)/2+l*2,oy=(boardH-sh)/2+l*2;g.cells.forEach(p=>out.push({x:ox+p.c*SX,y:oy+p.r*SY,l}))});return out.map((p,i)=>({...p,id:i}));};
 window.__mahjongPirateShapes={version:'3.0',targets};
})();
