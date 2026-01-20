
(function(){
  const $ = (s, c=document)=>c.querySelector(s);
  const $$ = (s, c=document)=>Array.from(c.querySelectorAll(s));

  function applyLang(lang){
    const dict = I18N[lang] || I18N[CONFIG.defaultLang] || I18N['ar'];
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' ? 'rtl' : 'ltr');

    $$('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const val = (typeof dict[key] === 'function') ? dict[key]() : dict[key];
      if(val) el.textContent = val;
    });

    $$('.brand-full').forEach(el=>{ el.textContent = (typeof dict.brandFull === 'function') ? dict.brandFull() : dict.brandFull; });

    localStorage.setItem('lang', lang);
  }

  const btn = $('#lang-toggle');
  if(btn){ btn.addEventListener('click', ()=>{
    const lang = localStorage.getItem('lang') || CONFIG.defaultLang || 'ar';
    applyLang(lang === 'ar' ? 'en' : 'ar');
  }); }

  const editBtn = $('#quick-settings');
  if(editBtn){ editBtn.addEventListener('click', ()=>{
    const siteAR = prompt('اسم الموقع (عربي):', CONFIG.siteNameAR) || CONFIG.siteNameAR;
    const secAR  = prompt('اسم القسم (عربي):', CONFIG.sectionNameAR) || CONFIG.sectionNameAR;
    const siteEN = prompt('Site Name (EN):', CONFIG.siteNameEN) || CONFIG.siteNameEN;
    const secEN  = prompt('Section (EN):', CONFIG.sectionNameEN) || CONFIG.sectionNameEN;
    localStorage.setItem('siteNameAR', siteAR);
    localStorage.setItem('sectionNameAR', secAR);
    localStorage.setItem('siteNameEN', siteEN);
    localStorage.setItem('sectionNameEN', secEN);
    CONFIG.siteNameAR = siteAR; CONFIG.sectionNameAR = secAR;
    CONFIG.siteNameEN = siteEN; CONFIG.sectionNameEN = secEN;
    const lang = localStorage.getItem('lang') || CONFIG.defaultLang || 'ar';
    applyLang(lang);
    alert('تم تحديث الاسم على الواجهة. للتثبيت الدائم عدّل الملفات/ارفع JSON/PR.');
  }); }

  ['siteNameAR','sectionNameAR','siteNameEN','sectionNameEN'].forEach(k=>{
    const v = localStorage.getItem(k);
    if(v) CONFIG[k] = v;
  });

  applyLang(localStorage.getItem('lang') || CONFIG.defaultLang || 'ar');
})();
