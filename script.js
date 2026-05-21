// Build data-label on sections from nav tab text (DOM is ready at this point)
document.querySelectorAll('.tab').forEach(tab=>{
  const m=tab.getAttribute('onclick')&&tab.getAttribute('onclick').match(/show\('(\w+)'\)/);
  if(m){const sec=document.getElementById('s-'+m[1]);if(sec)sec.dataset.label=tab.textContent.trim();}
});

function show(id,el){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.getElementById('s-'+id).classList.add('on');
  el.classList.add('on');
}

function quickSearch(el){
  const srch=document.getElementById('srch');
  const term=el.dataset.term;
  srch.value=(srch.value===term)?'':term;
  doSearch(srch.value);
}

let _searchTimer;
function onSearchInput(v){
  clearTimeout(_searchTimer);
  _searchTimer=setTimeout(()=>doSearch(v),150);
}

function clearHighlights(){
  document.querySelectorAll('span.hl').forEach(m=>{
    m.parentNode.replaceChild(document.createTextNode(m.textContent),m);
  });
}

function highlightText(el,q){
  if(el.nodeType===3){ // text node
    const text=el.textContent;
    const lower=text.toLowerCase();
    if(!lower.includes(q)||!el.parentNode) return;
    const frag=document.createDocumentFragment();
    let last=0,idx;
    while((idx=lower.indexOf(q,last))!==-1){
      if(idx>last) frag.appendChild(document.createTextNode(text.slice(last,idx)));
      const s=document.createElement('span');
      s.className='hl';
      s.textContent=text.slice(idx,idx+q.length);
      frag.appendChild(s);
      last=idx+q.length;
    }
    if(last<text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    el.parentNode.replaceChild(frag,el);
    return;
  }
  if(el.nodeType!==1||el.className==='hl') return;
  Array.from(el.childNodes).forEach(child=>highlightText(child,q));
}

function doSearch(q){
  q=q.toLowerCase().trim();
  clearHighlights();
  document.querySelectorAll('.stag').forEach(t=>t.classList.toggle('on',t.dataset.term===q));
  const els=document.querySelectorAll('.npc,.clue,.loc,.ms,.tl,.ev,.art,.spell,.callout,#npc-index tbody tr');

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
    if(el.textContent.toLowerCase().includes(q)){
      el.classList.add('hi');
      highlightText(el,q);
      n++;
    }
  });

  document.querySelectorAll('.panel').forEach(p=>{
    p.classList.toggle('has-match',!!p.querySelector('.hi'));
  });

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
