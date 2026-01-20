
(function(){
  const $ = (s, c=document)=>c.querySelector(s);
  const $$ = (s, c=document)=>Array.from(c.querySelectorAll(s));

  // Mobile nav (optional future)
  const menuBtn = $('.menu-toggle');
  const nav = $('header nav');
  if(menuBtn){ menuBtn.addEventListener('click', ()=> nav.classList.toggle('open')); }

  // Identity bindings
  $$('.contact-phone').forEach(el=> el.textContent = CONFIG.phone);
  $$('.contact-email').forEach(el=> el.textContent = CONFIG.email);
  $$('.contact-address').forEach(el=> el.textContent = (document.documentElement.lang==='ar' ? CONFIG.addressAR : CONFIG.addressEN));
  $$('.wa-link').forEach(el=> el.href = 'https://wa.me/' + CONFIG.whatsapp);
  $$('.phone-link').forEach(el=> el.href = 'tel:' + CONFIG.phone);
  $$('.email-link').forEach(el=> el.href = 'mailto:' + CONFIG.email);

  // Home: small auctions sample
  if($('#home-auctions')){
    fetch('assets/data/auctions.json').then(r=>r.json()).then(DB=>{
      const box = $('#home-auctions');
      (DB.auctions||[]).slice(0,3).forEach(a=>{
        const el = document.createElement('a'); el.className='card'; el.href = 'auction.html?id='+a.id;
        el.innerHTML = '<strong>'+a.title+' — <span class="badge status-'+a.status+'">'+a.status+'</span></strong>'+
                       "<p style='margin-top:8px;color:#64748b'>"+(a.description||'')+'</p>';
        box.appendChild(el);
      });
    }).catch(()=>{});
  }

  // Listings pages
  if(document.body.classList.contains('listings-page')){
    const list = $('#listing-grid');
    const catSelect = $('#cat-filter');
    fetch('assets/data/listings.json').then(r=>r.json()).then(DB=>{
      function priceText(x){
        if(!x.price || x.price===0) return 'حسب السعر اليومي / بالوزن';
        const lang = localStorage.getItem('lang')||'ar';
        return new Intl.NumberFormat(lang+'-SA').format(x.price)+' '+(x.currency||'SAR');
      }
      function render(){
        let cat = 'equipment';
        if(document.body.classList.contains('cat-scrap')) cat = 'scrap';
        else if(catSelect) cat = catSelect.value;
        const items = DB[cat]||[];
        list.innerHTML = '';
        items.forEach(x=>{
          const img = (x.images&&x.images[0]) || 'assets/img/auction1.jpg';
          const card = document.createElement('div'); card.className='listing-card';
          card.innerHTML = `
            <div class="thumb" style="background-image:url('${img}')"></div>
            <div class="content">
              <h3>${x.title||''}</h3>
              <div class="meta">
                <span class="badge">${x.location||''}</span>
                <span class="badge">${x.condition||''}</span>
              </div>
              <p class="price">${priceText(x)}</p>
              <ul class="specs">${(x.specs||[]).map(s=>`<li>${s}</li>`).join('')}</ul>
              <div class="actions"><a class="btn wa-link" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('استفسار عن: '+(x.title||''))}" target="_blank">واتساب</a></div>
            </div>`;
          list.appendChild(card);
        });
      }
      if(catSelect) catSelect.addEventListener('change', render);
      render();
    }).catch(e=>{ console.error('listings.json error', e); });
  }

  // Auctions list
  if(document.body.classList.contains('auctions-page')){
    const list = $('#auctions-list');
    const statusFilter = $('#status-filter');
    const kindFilter = $('#kind-filter');
    fetch('assets/data/auctions.json').then(r=>r.json()).then(DB=>{
      function render(){
        const s = statusFilter ? statusFilter.value : 'الكل';
        const k = kindFilter ? kindFilter.value : 'الكل';
        list.innerHTML = '';
        (DB.auctions||[]).filter(a=> (s==='الكل'||a.status===s) && (k==='الكل'||a.kind===k) )
          .forEach(a=>{
            const el = document.createElement('a'); el.href='auction.html?id='+a.id; el.className='auction-card';
            el.innerHTML = `
            <div class="thumb" style="background-image:url('${a.heroImage||''}')"></div>
            <div class="content">
              <h3>${a.title||''}</h3>
              <div class="meta">
                <span class="badge status-${a.status||''}">${a.status||''}</span>
                <span class="badge kind-${a.kind||''}">${a.kind||''}</span>
                <span class="loc">${a.location||''}</span>
              </div>
              <p class="desc">${a.description||''}</p>
            </div>`;
            list.appendChild(el);
          });
      }
      if(statusFilter) statusFilter.addEventListener('change', render);
      if(kindFilter) kindFilter.addEventListener('change', render);
      render();
    });
  }

  // Auction detail
  if(document.body.classList.contains('auction-page')){
    const p = new URLSearchParams(location.search);
    const id = parseInt(p.get('id'),10);
    fetch('assets/data/auctions.json').then(r=>r.json()).then(DB=>{
      const a = (DB.auctions||[]).find(x=>x.id===id) || (DB.auctions||[])[0];
      if(!a) return;
      const $id = s=>document.getElementById(s);
      $id('auction-title').textContent = a.title||'';
      $id('auction-status').textContent = a.status||'';
      $id('auction-kind').textContent = a.kind||'';
      $id('auction-location').textContent = a.location||'';
      $id('auction-desc').textContent = a.description||'';
      $id('auction-terms').textContent = a.terms||'';
      $id('auction-dates').textContent = (a.startDate||'')+ ' — ' + (a.endDate||'');
      const gal = $id('auction-gallery');
      (a.gallery||[]).forEach(src=>{ const im=document.createElement('img'); im.src=src; im.alt=a.title||''; gal.appendChild(im); });
      const map = $id('map-embed'); if(map){ map.src = CONFIG.mapEmbed; }
    })
  }
})();
