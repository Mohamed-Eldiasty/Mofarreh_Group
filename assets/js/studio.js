// Simple GitHub API client in browser
(function(){
  const $ = s=>document.querySelector(s);
  const getCreds = () => ({
    pat: localStorage.getItem('gh_pat') || '',
    repo: localStorage.getItem('gh_repo') || 'Mohamed-Eldiasty/Mofarreh-group-site',
    branch: localStorage.getItem('gh_branch') || 'main',
    authorName: localStorage.getItem('gh_authorName') || '',
    authorEmail: localStorage.getItem('gh_authorEmail') || ''
  });
  const setCreds = (c)=>{
    localStorage.setItem('gh_pat', c.pat||'');
    localStorage.setItem('gh_repo', c.repo||'');
    localStorage.setItem('gh_branch', c.branch||'main');
    localStorage.setItem('gh_authorName', c.authorName||'');
    localStorage.setItem('gh_authorEmail', c.authorEmail||'');
  };

  const credStatus = $('#credStatus');
  const updateStatus = ()=>{
    const c = getCreds();
    credStatus.textContent = c.pat ? 'متصل (Token محفوظ محليًا)' : 'غير متصل';
    credStatus.className = c.pat ? 'ok' : 'warn';
  };

  function ghFetch(path, opts={}){
    const c = getCreds();
    const headers = opts.headers || {};
    headers['Authorization'] = 'Bearer ' + c.pat;
    headers['Accept'] = 'application/vnd.github+json';
    headers['X-GitHub-Api-Version'] = '2022-11-28';
    return fetch('https://api.github.com'+path, { ...opts, headers });
  }

  async function getFile(path){
    const {repo, branch} = getCreds();
    const r = await ghFetch(`/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`);
    if(!r.ok) throw new Error('فشل تحميل '+path);
    const j = await r.json();
    const content = atob(j.content.replace(/
/g,''));
    return { sha: j.sha, content };
  }

  async function putFile(path, contentStr, message){
    const {repo, branch, authorName, authorEmail} = getCreds();
    // get current sha if exists
    let sha = undefined;
    try{ const f = await getFile(path); sha = f.sha; }catch(e){ /* new file */ }
    const body = {
      message: message || `update ${path}`,
      content: btoa(unescape(encodeURIComponent(contentStr))),
      branch,
      committer: authorName && authorEmail ? { name: authorName, email: authorEmail } : undefined,
      sha
    };
    const r = await ghFetch(`/repos/${repo}/contents/${path}`, { method:'PUT', body: JSON.stringify(body) });
    if(!r.ok){ const t = await r.text(); throw new Error('فشل الحفظ: '+t); }
    return await r.json();
  }

  // Bind UI
  $('#saveCreds').onclick = ()=>{
    setCreds({
      pat: $('#pat').value.trim(),
      repo: $('#repo').value.trim(),
      branch: $('#branch').value.trim(),
      authorName: $('#authorName').value.trim(),
      authorEmail: $('#authorEmail').value.trim(),
    });
    updateStatus();
    alert('تم حفظ الإعدادات محليًا.');
  };

  // Prefill
  (function init(){
    const c = getCreds();
    $('#pat').value = c.pat; $('#repo').value = c.repo; $('#branch').value = c.branch; $('#authorName').value = c.authorName; $('#authorEmail').value = c.authorEmail; updateStatus();
  })();

  // Listings
  $('#loadListings').onclick = async ()=>{
    try{
      const f = await getFile('assets/data/listings.json');
      $('#listingsBox').value = f.content;
      alert('تم تحميل listings.json');
    }catch(e){ alert(e.message); }
  };
  $('#saveListings').onclick = async ()=>{
    try{
      // validate JSON
      JSON.parse($('#listingsBox').value);
      const msg = $('#msgListings').value || 'Update listings.json';
      await putFile('assets/data/listings.json', $('#listingsBox').value, msg);
      alert('تم حفظ listings.json');
    }catch(e){ alert('خطأ: '+e.message); }
  };

  // Auctions
  $('#loadAuctions').onclick = async ()=>{
    try{
      const f = await getFile('assets/data/auctions.json');
      $('#auctionsBox').value = f.content;
      alert('تم تحميل auctions.json');
    }catch(e){ alert(e.message); }
  };
  $('#saveAuctions').onclick = async ()=>{
    try{
      JSON.parse($('#auctionsBox').value);
      const msg = $('#msgAuctions').value || 'Update auctions.json';
      await putFile('assets/data/auctions.json', $('#auctionsBox').value, msg);
      alert('تم حفظ auctions.json');
    }catch(e){ alert('خطأ: '+e.message); }
  };

  // Upload images
  $('#uploadImgs').onclick = async ()=>{
    const files = $('#imgInput').files;
    if(!files || !files.length){ alert('اختر صورًا أولاً'); return; }
    const status = $('#imgStatus');
    status.textContent = 'جارِ الرفع...'; status.className='warn';
    let ok=0, fail=0;
    for(const file of files){
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      for(let i=0;i<bytes.length;i++){ binary += String.fromCharCode(bytes[i]); }
      const b64 = btoa(binary);
      try{
        await putFile(`assets/img/${file.name}`, atob(b64), `Add image ${file.name}`);
        ok++;
      }catch(e){ console.error(e); fail++; }
    }
    status.textContent = `تم: ${ok} صور / فشل: ${fail}`; status.className = fail? 'err' : 'ok';
  };
})();
