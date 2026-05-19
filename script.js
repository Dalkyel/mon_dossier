function show(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.getElementById('s-'+id).classList.add('on');
  event.target.classList.add('on');
}

function doSearch(q){
  q=q.toLowerCase().trim();
  const els=document.querySelectorAll('.npc,.clue,.loc,.ms,.tl,.ev,.art,.spell,.callout');
  let n=0;
  els.forEach(el=>{
    el.classList.remove('hi');
    if(q&&el.textContent.toLowerCase().includes(q)){el.classList.add('hi');n++;}
  });
  document.getElementById('src-count').textContent=q?(n+' resultados'):'';
}
