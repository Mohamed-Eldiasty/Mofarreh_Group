(function(){
  const toolbar = document.getElementById('admin-toolbar');
  const hasToken = !!localStorage.getItem('gh_pat');

  function ensureVisible(){ if(toolbar) toolbar.classList.remove('hidden'); }

  // If Netlify Identity exists, use it; otherwise fall back to token presence
  if('netlifyIdentity' in window){
    const btnLogin = document.getElementById('admin-login');
    const btnLogout = document.getElementById('admin-logout');
    netlifyIdentity.on('init', user => {
      ensureVisible();
      if(user){ if(btnLogin) btnLogin.style.display='none'; }
      else { if(btnLogout) btnLogout.style.display='none'; }
    });
    netlifyIdentity.init();
    if(document.getElementById('admin-login')) document.getElementById('admin-login').onclick = ()=> netlifyIdentity.open('login');
    if(document.getElementById('admin-logout')) document.getElementById('admin-logout').onclick = ()=> netlifyIdentity.logout();
    netlifyIdentity.on('login', () => location.reload());
    netlifyIdentity.on('logout', () => location.reload());
  } else {
    // No identity: show toolbar only if GITHUB token exists locally
    if(hasToken){ ensureVisible(); }
  }
})();
