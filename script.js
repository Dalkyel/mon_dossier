// Build data-label on sections from nav tab text (DOM is ready at this point)
document.querySelectorAll('.tab').forEach(tab=>{
  const m=tab.getAttribute('onclick')&&tab.getAttribute('onclick').match(/show\('(\w+)'\)/);
  if(m){const sec=document.getElementById('s-'+m[1]);if(sec)sec.dataset.label=tab.textContent.trim();}
});

function show(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.getElementById('s-'+id).classList.add('on');
  event.target.classList.add('on');
}

function quickSearch(el){
  const srch=document.getElementById('srch');
  const term=el.dataset.term;
  srch.value=(srch.value===term)?'':term;
  doSearch(srch.value);
}

function doSearch(q){
  q=q.toLowerCase().trim();
  // Sync tag highlights with current query
  document.querySelectorAll('.stag').forEach(t=>t.classList.toggle('on',t.dataset.term===q));
  const els=document.querySelectorAll('.npc,.clue,.loc,.ms,.tl,.ev,.art,.spell,.callout');

  if(!q){
    document.body.classList.remove('searching');
    els.forEach(el=>el.classList.remove('hi'));
    document.querySelectorAll('.has-match').forEach(el=>el.classList.remove('has-match'));
    document.getElementById('src-count').textContent='';
    return;
  }

  document.body.classList.add('searching');
  let n=0;
  els.forEach(el=>{
    el.classList.remove('hi');
    if(el.textContent.toLowerCase().includes(q)){el.classList.add('hi');n++;}
  });

  // Mark panels that contain at least one match
  document.querySelectorAll('.panel').forEach(p=>{
    p.classList.toggle('has-match',!!p.querySelector('.hi'));
  });

  // Mark stitle elements whose following siblings contain matches
  document.querySelectorAll('.stitle').forEach(st=>{
    let sib=st.nextElementSibling,found=false;
    while(sib&&!sib.classList.contains('stitle')){
      if(sib.querySelector&&sib.querySelector('.hi'))found=true;
      if(sib.classList&&sib.classList.contains('hi'))found=true;
      sib=sib.nextElementSibling;
    }
    st.classList.toggle('has-match',found);
  });

  document.getElementById('src-count').textContent=n+(n===1?' resultado':' resultados');
}
