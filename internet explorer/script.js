(function(){
  // Simulated pages (simple HTML fragments)
  const pages = {
    "about:home": {
      title: "Welcome to the Web (1999)",
      html: `
        <h1>Welcome to the Web</h1>
        <p>This is a nostalgic Internet Explorer skin — complete with Back/Forward, Favorites, and a status bar. Click one of the favorites or enter <em>about:news</em> in the address bar.</p>
        <p>Try the <a data-link="about:news">Vintage News</a> page or the classic <a data-link="about:msn">MSN</a> page.</p>
      `
    },
    "about:news": {
      title: "Vintage News",
      html: `
        <h1>Vintage News — 1999 Style</h1>
        <p><strong>Breaking:</strong> New UI skins for browsers become popular. Animated GIFs and guestbooks everywhere.</p>
        <p>Popular topics: animated GIFs, guestbooks, dial-up connection success stories, and GeoCities pages.</p>
        <p><a data-link="about:home">Back to Home</a></p>
      `
    },
    "about:msn":{
      title:"MSN — Classic Portal",
      html:`
        <h1>MSN (Classic)</h1>
        <p>Welcome to the classic portal view. The real MSN had lots of boxes, news snippets, and links — this is a light recreation.</p>
        <ul>
          <li><a href="https://www.bing.com" target="_blank" rel="noopener">Search</a></li>
          <li><a data-link="about:tools">Tips & Tools</a></li>
        </ul>
      `
    },
    "about:tools":{
      title:"Tools & Tips",
      html:`
        <h1>Tools & Tips</h1>
        <p>Pro tips for vintage browsing:</p>
        <ol>
          <li>Enable your dial-up tone (in your heart).</li>
          <li>Use 800x600 resolution for the authentic feel.</li>
          <li>Remember: framesets are your friend.</li>
        </ol>
      `
    },
    "about:error":{
      title:"Error",
      html:`<h1>Not found</h1><p>The page you requested cannot be found.</p><p><a data-link="about:home">Go home</a></p>`
    }
  };

  // history stack implementation
  let historyStack = [];
  let historyIndex = -1;

  const backBtn = document.getElementById('backBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  const stopBtn = document.getElementById('stopBtn');
  const reloadBtn = document.getElementById('reloadBtn');
  const goBtn = document.getElementById('goBtn');
  const addressInput = document.getElementById('addressInput');
  const webFrame = document.getElementById('webFrame');
  const pageTitle = document.getElementById('pageTitle');
  const pageUrl = document.getElementById('pageUrl');
  const statusText = document.getElementById('statusText');
  const favItems = document.querySelectorAll('.fav-item');
  const historyList = document.getElementById('historyList');
  const searchBox = document.getElementById('searchBox');
  const searchBtn = document.getElementById('searchBtn');

  function renderPage(url, push=true){
    // resolve pages
    const page = pages[url] || pages['about:error'];
    // update UI
    pageTitle.textContent = page.title || url;
    pageUrl.textContent = url;
    addressInput.value = url;
    statusText.textContent = 'Loading...';
    // simulate load delay
    setTimeout(()=>{
      webFrame.innerHTML = page.html;
      statusText.textContent = 'Done';
      // attach link handlers inside webFrame
      webFrame.querySelectorAll('[data-link]').forEach(a=>{
        a.addEventListener('click', e=>{
          e.preventDefault();
          const u = a.getAttribute('data-link');
          navigateTo(u);
        });
      });
      // external target="_blank" links open normally
    }, 200 + Math.random()*400);

    // manage history
    if(push){
      // if we navigated after going back, drop forward history
      historyStack = historyStack.slice(0, historyIndex+1);
      historyStack.push(url);
      historyIndex = historyStack.length -1;
    }
    updateNavButtons();
    refreshHistoryList();
  }

  function navigateTo(url){
    // sanitize common mistakes
    if(!url) url = 'about:home';
    // if it looks like a real URL (starts with http) open in new tab
    if(/^https?:\/\//i.test(url)){
      window.open(url, '_blank');
      statusText.textContent = 'Opened external link';
      return;
    }
    renderPage(url, true);
  }

  function updateNavButtons(){
    backBtn.style.opacity = (historyIndex>0)?1:0.4;
    forwardBtn.style.opacity = (historyIndex < historyStack.length-1)?1:0.4;
  }

  backBtn.addEventListener('click', ()=>{
    if(historyIndex > 0){
      historyIndex--;
      renderPage(historyStack[historyIndex], false);
    }
  });

  forwardBtn.addEventListener('click', ()=>{
    if(historyIndex < historyStack.length -1){
      historyIndex++;
      renderPage(historyStack[historyIndex], false);
    }
  });

  reloadBtn.addEventListener('click', ()=>{
    if(historyIndex >= 0)
      renderPage(historyStack[historyIndex], false);
    else renderPage(addressInput.value || 'about:home', true);
  });

  stopBtn.addEventListener('click', ()=>{
    statusText.textContent = 'Stopped';
  });

  goBtn.addEventListener('click', ()=>navigateTo(addressInput.value.trim()));
  addressInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') goBtn.click(); });

  favItems.forEach(f=>{
    f.addEventListener('click', ()=>navigateTo(f.dataset.url));
  });

  // history list render
  function refreshHistoryList(){
    historyList.innerHTML = historyStack.map((u,i)=>{
      const short = u.length>30 ? u.slice(0,27)+'...' : u;
      return `<div style="padding:4px;margin-bottom:4px;background:#fff;border:1px solid #ddd;cursor:pointer" data-idx="${i}">${short}</div>`;
    }).join('');
    historyList.querySelectorAll('[data-idx]').forEach(el=>{
      el.addEventListener('click', ()=> {
        const idx = Number(el.getAttribute('data-idx'));
        historyIndex = idx;
        renderPage(historyStack[idx], false);
      });
    });
  }

  // search opens real search in new tab
  searchBtn.addEventListener('click', ()=>{
    const q = encodeURIComponent(searchBox.value.trim());
    if(!q) return;
    const url = 'https://www.bing.com/search?q=' + q;
    window.open(url, '_blank');
    statusText.textContent = 'Searching: ' + decodeURIComponent(q);
  });
  searchBox.addEventListener('keydown', (e)=>{ if(e.key==='Enter') searchBtn.click(); });

  // initial load
  renderPage('about:home', true);

  // window chrome controls (minimize / max / close)
  const ieWindow = document.getElementById('ieWindow');
  const minBtn = document.getElementById('minBtn');
  const maxBtn = document.getElementById('maxBtn');
  const closeBtn = document.getElementById('closeBtn');

  let prevStyle = null;
  minBtn.addEventListener('click', ()=>{
    // minimize to small bar
    ieWindow.style.transition = 'height 0.18s';
    prevStyle = {height: ieWindow.style.height || ieWindow.getBoundingClientRect().height + 'px'};
    ieWindow.style.height = '36px';
    // hide internal content
    Array.from(ieWindow.children).forEach((c, idx)=> { if(idx>0) c.style.display='none';});
  });

  maxBtn.addEventListener('click', ()=>{
    if(ieWindow.style.position === 'fixed' && ieWindow.style.left==='0px'){
      // restore
      ieWindow.style.position = ''; ieWindow.style.left=''; ieWindow.style.top=''; ieWindow.style.width='';
    } else {
      // maximize
      ieWindow.style.position='fixed'; ieWindow.style.left='0'; ieWindow.style.top='0'; ieWindow.style.width='100%'; ieWindow.style.height='100%';
    }
    // ensure content visible
    Array.from(ieWindow.children).forEach((c)=> c.style.display='flex');
  });

  closeBtn.addEventListener('click', ()=> {
    ieWindow.remove();
    // small fallback message
    const msg = document.createElement('div');
    msg.style.padding='20px';
    msg.style.background='#fff';
    msg.style.border='2px solid #666';
    msg.textContent = 'Window closed. Reload page to re-open the simulated browser.';
    document.body.appendChild(msg);
  });

  // titlebar dragging
  (function makeDraggable(){
    let dragging=false, offsetX=0, offsetY=0;
    const title = document.getElementById('titlebar');
    title.addEventListener('mousedown', (e)=>{
      if(window.getSelection) window.getSelection().removeAllRanges();
      dragging=true;
      const rect = ieWindow.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      ieWindow.style.position = 'fixed';
      ieWindow.style.zIndex = 9999;
    });
    window.addEventListener('mousemove', (e)=>{
      if(!dragging) return;
      ieWindow.style.left = (e.clientX - offsetX) + 'px';
      ieWindow.style.top = (e.clientY - offsetY) + 'px';
    });
    window.addEventListener('mouseup', ()=>dragging=false);
  })();

  // keyboard shortcuts: Alt+Left/Right for back/forward (old IE)
  window.addEventListener('keydown', (e)=>{
    if(e.altKey && e.key === 'ArrowLeft'){ e.preventDefault(); backBtn.click(); }
    if(e.altKey && e.key === 'ArrowRight'){ e.preventDefault(); forwardBtn.click(); }
  });

})();