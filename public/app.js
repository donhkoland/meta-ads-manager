/* ============================================================
   CAMPAIGN DESK — app.js
   All SVG icons are inline linear (1.5px stroke, no emoji)
   Animations via GSAP 3 (served locally from the installed npm package)
   ============================================================ */

'use strict';

// ── SVG Icon Library ──────────────────────────────────────────
const I = {
  user:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
  page:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
  instagram: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>`,
  ads:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v4H3z"/><path d="M3 10h8v11H3z"/><path d="M14 10h7v5h-7z"/><path d="M14 18h7v3h-7z"/></svg>`,
  chevron:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  eye:       `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  heart:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  comment:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  click:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  reach:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
  video:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  image:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  text:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="18" y2="18"/></svg>`,
  arrowRight:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  arrowLeft: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  plus:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  x:         `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  lock:      `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  info:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  warn:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  target:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  logout:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  trending:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  fb:        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  external:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

// ── API Wrapper ───────────────────────────────────────────────
const API = {
  async get(url) {
    const r = await fetch(url, { credentials: 'include' });
    if (!r.ok) { const d = await r.json().catch(()=>({})); throw d.error || { message: `HTTP ${r.status}` }; }
    return r.json();
  },
  async post(url, body) {
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(body) });
    const d = await r.json().catch(()=>({}));
    if (!r.ok) throw { ...(d.error || { message: `HTTP ${r.status}` }), partial: d };
    return d;
  },
};

// ── State ─────────────────────────────────────────────────────
const S = {
  auth: false,
  configured: false,
  missing: [],
  submitting: false,
  user: null,
  pages: [],
  page: null,
  adAccounts: [],
  adAccount: null,
  igAccount: null,
  posts: [],
  selectedPost: null,
  pixels: [],
  campaigns: [],
  activeTab: 'create',
};

const F = {
  campaignName: '',
  objective: 'OUTCOME_TRAFFIC',
  countries: ['AR'],
  ageMin: 18,
  ageMax: 65,
  gender: '0',
  interests: [],
  placements: { platforms: ['facebook','instagram'], facebook_positions:['feed'], instagram_positions:['stream'] },
  budgetType: 'daily',
  budget: '',
  startDate: '',
  endDate: '',
  optimizationGoal: 'LINK_CLICKS',
  ctaType: 'LEARN_MORE',
  destinationUrl: '',
  pixelId: '',
};

// ── Helpers ───────────────────────────────────────────────────
function num(n) {
  if (n == null) return '—';
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return String(n);
}
function fdate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString("en-US", { day:'2-digit', month:'short', year:'numeric' });
}
function fcur(n, cur='ARS') {
  if (!n) return '—';
  return new Intl.NumberFormat("en-US",{ style:'currency', currency:cur, maximumFractionDigits:0 }).format(n);
}
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type='info') {
  const icons = { success: I.check, error: I.x, warn: I.warn, info: I.info };
  const colors = { success:'var(--c-green)', error:'var(--c-red)', warn:'var(--c-amber)', info:'var(--c-blue)' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span class="toast-icon" style="color:${colors[type]}">${icons[type]||I.info}</span><span class="toast-msg">${esc(msg)}</span>`;
  document.getElementById('toast-layer').appendChild(el);
  gsap.fromTo(el, { opacity:0, x:12 }, { opacity:1, x:0, duration:.25, ease:'power2.out' });
  gsap.to(el, { opacity:0, x:8, duration:.2, ease:'power2.in', delay:3.5, onComplete: ()=>el.remove() });
}

// ── Boot Animation ────────────────────────────────────────────
async function boot() {
  const boot = document.querySelector('.boot-screen');
  const wm   = document.querySelector('.boot-wordmark');

  // Reveal wordmark
  gsap.to(wm, { opacity:1, y:0, duration:.9, ease:'power3.out', delay:.1 });
  await new Promise(r => setTimeout(r, 1400));

  // Check auth status
  try {
    const status = await API.get('/auth/status');
    S.auth = status.authenticated;
    S.configured = status.configured;
    S.missing = status.missing || [];
  } catch { S.auth = false; }

  // Handle URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('auth') === 'success') { toast("Account connected",'success'); window.history.replaceState({},'','/'); }
  if (params.get('auth_error')) { toast(`Error: ${params.get('auth_error')}`,'error'); window.history.replaceState({},'','/'); }

  // Crossfade boot → app
  gsap.to(boot, { opacity:0, duration:.45, ease:'power2.in', onComplete: ()=>{ boot.remove(); renderApp(); }});
}

// ── Render App ────────────────────────────────────────────────
function renderApp() {
  const root = document.getElementById('app');

  if (!S.auth) {
    root.innerHTML = renderLoginShell();
    const shell = document.querySelector('.app-shell');
    gsap.to(shell, { opacity:1, duration:.4, ease:'power2.out' });
    const card = document.querySelector('.login-card');
    gsap.to(card, { opacity:1, y:0, duration:.6, ease:'power3.out', delay:.1 });
    return;
  }

  root.innerHTML = renderMainShell();
  const shell = document.querySelector('.app-shell');
  gsap.to(shell, { opacity:1, duration:.35, ease:'power2.out' });

  loadData();
}

// ── Shell Templates ───────────────────────────────────────────
function renderTopbar(showUser=false) {
  return `
    <header class="topbar">
      <div class="topbar-brand">
        <div class="brand-mark">
          ${I.trending}
        </div>
        <span class="brand-name">Campaign Desk</span>
        <a class="brand-version" href="https://github.com/donhkoland/Tools" target="_blank" rel="noopener noreferrer" title="If it saves you a step, give @donhkoland a shout">Tools · @donhkoland</a>
      </div>
      <div class="topbar-right" id="topbarRight">
        ${showUser ? `
          <div class="user-chip" id="userChip">
            <div class="user-avatar" id="userAvatar">${I.user}</div>
            <span id="userName">—</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="logout()" title="Sign out">
            ${I.logout}
          </button>
        ` : ''}
      </div>
    </header>
  `;
}

function renderLoginShell() {
  return `
    <div class="app-shell">
      ${renderTopbar(false)}
      <div class="login-view">
        <div class="login-card">
          <div class="login-eyebrow">Meta Ads Manager</div>
          <h1 class="login-headline">Give your next campaign a home.</h1>
          <p class="login-sub">Connect Facebook to review your posts and prepare a campaign in one place.</p>
          <div class="permission-list">
            <div class="permission-list-label">${I.lock} Requested permissions</div>
            <div class="perm-row"><span class="perm-dot"></span>pages_show_list · pages_read_engagement</div>
            <div class="perm-row"><span class="perm-dot"></span>ads_read · ads_management</div>
            <div class="perm-row"><span class="perm-dot"></span>instagram_basic · instagram_manage_insights</div>
            <div class="perm-row"><span class="perm-dot"></span>read_insights · business_management</div>
          </div>
          <button class="btn-meta-login" ${S.configured?'':'disabled'} onclick="window.location.href='/auth/login'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Connect Facebook
          </button>
          ${!S.configured ? renderAlert('warn', "Set up " + S.missing.map(esc).join(', ') + " in this folder's .env file, then restart the app.") : ''}
          <p class="login-note">
            Requires a Meta developer app, a configured business portfolio,
            and an active ad account with a payment method. See the README for setup.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderMainShell() {
  return `
    <div class="app-shell">
      ${renderTopbar(true)}
      <div class="workspace">
        <div class="col-panel" id="colLeft">
          <div id="accountBlock"></div>
          <div id="contentBlock"></div>
        </div>
        <div class="col-divider"></div>
        <div class="col-panel" id="colRight">
          <div id="campaignBlock">${renderCampaignBlock()}</div>
        </div>
      </div>
    </div>
  `;
}

// ── Data Loading ──────────────────────────────────────────────
async function loadData() {
  try {
    const [me, pages, adAccounts] = await Promise.all([
      API.get('/api/me'),
      API.get('/api/pages'),
      API.get('/api/adaccounts'),
    ]);
    S.user = me;
    S.pages = pages.data || [];
    S.adAccounts = adAccounts.data || [];
    S.page = S.pages[0] || null;
    S.adAccount = S.adAccounts[0] || null;

    // Update user chip
    const nameEl = document.getElementById('userName');
    const avatarEl = document.getElementById('userAvatar');
    if (nameEl) nameEl.textContent = me.name || '—';
    if (avatarEl && me.picture?.data?.url) {
      avatarEl.innerHTML = `<img src="${me.picture.data.url}" alt="${esc(me.name)}">`;
    }

    renderAccountBlock();
    renderContentBlock();
    populateAdAccountSelect();

    if (S.page) loadPageContent();
    if (S.adAccount) loadAdAccountData();
  } catch(err) {
    document.getElementById('accountBlock').innerHTML = renderAlert('error', "Could not load the account. " + (err.message||''));
  }
}

async function loadPageContent() {
  renderContentBlock(true);
  try {
    // IG account
    try {
      const ig = await API.get(`/api/pages/${S.page.id}/instagram`);
      S.igAccount = ig?.instagram_business_account || null;
    } catch { S.igAccount = null; }

    // Posts
    const posts = await API.get(`/api/pages/${S.page.id}/posts`);
    S.posts = posts.data || [];

    renderAccountBlock();
    renderContentBlock(false);
  } catch(err) {
    renderContentBlock(false, err);
  }
}

async function loadAdAccountData() {
  try {
    const [pixels, campaigns] = await Promise.all([
      API.get(`/api/adaccounts/${S.adAccount.id}/pixels`).catch(()=>({data:[]})),
      API.get(`/api/adaccounts/${S.adAccount.id}/campaigns`).catch(()=>({data:[]})),
    ]);
    S.pixels  = pixels.data  || [];
    S.campaigns = campaigns.data || [];
    updatePixelSelect();
    renderCampaigns();
  } catch(err) { console.warn('loadAdAccountData:', err); }
}

// ── Left Column Renders ───────────────────────────────────────
function renderAccountBlock() {
  const el = document.getElementById('accountBlock');
  if (!el) return;

  const adStatus = (s) => {
    const m = {1:['green',"Active"],2:['red',"Inactive"],3:['amber',"Unconfirmed"],7:['amber',"In review"],9:['red',"Closed"]};
    return m[s] || ['muted',`Status ${s}`];
  };
  const [sc, sl] = S.adAccount ? adStatus(S.adAccount.account_status) : ['muted',"No account"];

  el.innerHTML = `
    <div>
      <div class="section-head">
        <span class="section-label">Connected account</span>
      </div>
      <div class="account-grid">
        <div class="account-tile" id="tile-user">
          <div class="tile-label">${I.user} Usuario</div>
          <div class="tile-value">${esc(S.user?.name||'—')}</div>
          <div class="tile-sub">${esc(S.user?.email||'')}</div>
        </div>
        <div class="account-tile" id="tile-page">
          <div class="tile-label">${I.page} Facebook Page</div>
          <div class="tile-value">${S.pages.length} page${S.pages.length!==1?'s':''}</div>
          <div class="tile-sub">${esc(S.page?.name||'—')}</div>
        </div>
        <div class="account-tile" id="tile-ig">
          <div class="tile-label">${I.instagram} Instagram</div>
          <div class="tile-value">${S.igAccount ? '@'+esc(S.igAccount.username) : "Not connected"}</div>
          <div class="tile-sub">${S.igAccount ? num(S.igAccount.followers_count)+" followers" : "No Instagram account"}</div>
        </div>
        <div class="account-tile" id="tile-ads">
          <div class="tile-label">${I.ads} Ad Account</div>
          <div class="tile-value" style="font-size:12px;">${esc(S.adAccount?.name||"No account")}</div>
          <div class="tile-sub"><span class="badge badge-${sc}">${sl}</span></div>
        </div>
      </div>

      ${S.pages.length > 1 ? `
        <div style="margin-top:var(--sp-3);">
          <div class="selector-wrap">
            <select onchange="onPageChange(this.value)">
              ${S.pages.map(p=>`<option value="${p.id}" ${p.id===S.page?.id?'selected':''}>${esc(p.name)}</option>`).join('')}
            </select>
            <span class="selector-icon">${I.chevron}</span>
          </div>
        </div>
      ` : ''}

      ${!S.adAccounts.length ? renderAlert('warn',"No ad accounts found. Set one up in Meta Business Manager.") : ''}
    </div>
  `;

  // Stagger tiles in
  gsap.to('.account-tile', { opacity:1, y:0, duration:.45, ease:'power2.out', stagger:.06, delay:.05 });
}

function renderContentBlock(loading=false, err=null) {
  const el = document.getElementById('contentBlock');
  if (!el) return;

  if (loading) {
    el.innerHTML = `
      <div class="section-head"><span class="section-label">Recent posts</span></div>
      <div class="loading-row"><div class="spinner"></div><span>Loading posts…</span></div>
    `;
    return;
  }

  if (err) {
    el.innerHTML = `
      <div class="section-head"><span class="section-label">Recent posts</span></div>
      ${renderAlert('error', err.message || "Could not load posts")}
    `;
    return;
  }

  const posts = S.posts;
  el.innerHTML = `
    <div>
      <div class="section-head">
        <span class="section-label">Recent posts</span>
        <span class="text-muted" style="font-size:11px;">${posts.length} posts</span>
      </div>
      ${!posts.length
        ? `<div style="color:var(--c-text-3);font-size:13px;padding:var(--sp-4) 0;">No recent posts on this Page.</div>`
        : `<div class="posts-feed">${posts.map(p => renderPostCard(p)).join('')}</div>`
      }
    </div>
  `;

  // Stagger post cards
  gsap.to('.post-card', { opacity:1, y:0, duration:.4, ease:'power2.out', stagger:.05, delay:.05 });

  // Async-load metrics for each post
  posts.forEach(p => loadPostMetrics(p.id));
}

function renderPostCard(post) {
  const isSelected = S.selectedPost?.id === post.id;
  const text = post.message || post.story || "(no text)";
  const thumb = post.full_picture;
  const mtype = post.attachments?.data?.[0]?.media_type || 'photo';

  return `
    <div class="post-card ${isSelected?'is-selected':''}" id="pc-${post.id}">
      <div class="post-inner">
        <div class="post-thumb-wrap">
          ${thumb
            ? `<img src="${esc(thumb)}" alt="" loading="lazy">`
            : `<span class="post-thumb-icon">${mtype==='video'?I.video:text?I.text:I.image}</span>`
          }
        </div>
        <div class="post-body">
          <div class="post-excerpt">${esc(text)}</div>
          <div class="post-date">${fdate(post.created_time)}</div>
          <div class="post-metrics" id="metrics-${post.id}">
            <div class="metric-chip skeleton" style="width:60px;height:22px;border:none;"></div>
            <div class="metric-chip skeleton" style="width:50px;height:22px;border:none;"></div>
          </div>
        </div>
      </div>
      <div class="post-actions">
        <div class="post-source-tag">
          ${mtype==='video'?I.video:I.fb}
          <span>${mtype==='video'?'Video':'Post'} · Facebook</span>
        </div>
        <button class="btn btn-use" onclick="selectPost('${post.id}')">
          Use in a campaign ${I.arrowRight}
        </button>
      </div>
    </div>
  `;
}

async function loadPostMetrics(postId) {
  if (!S.page) return;
  try {
    const data = await API.get(`/api/posts/${postId}/insights?pageId=${S.page.id}`);
    const el = document.getElementById(`metrics-${postId}`);
    if (!el) return;

    const insightsData = data.insights?.data || [];
    const rv = data.reactions;
    const gm = name => insightsData.find(d=>d.name===name)?.values?.[0]?.value ?? null;

    const chips = [
      { icon: I.heart,   val: rv?.reactions?.summary?.total_count, label:'likes' },
      { icon: I.comment, val: rv?.comments?.summary?.total_count,  label:'comentarios' },
      { icon: I.share,   val: rv?.shares?.count,                   label:'compartidos' },
      { icon: I.eye,     val: gm('post_impressions'),              label:'impresiones' },
      { icon: I.reach,   val: gm('post_impressions_unique'),       label:'alcance' },
      { icon: I.click,   val: gm('post_clicks'),                   label:'clics' },
    ].filter(c => c.val != null);

    el.innerHTML = chips.length
      ? chips.map(c=>`<div class="metric-chip" title="${c.label}">${c.icon}<span>${num(c.val)}</span></div>`).join('')
      : `<span style="font-size:11px;color:var(--c-text-3);">No metrics available</span>`;

    // Store on post
    const post = S.posts.find(p=>p.id===postId);
    if (post) post._metrics = chips;
  } catch(e) {
    const el = document.getElementById(`metrics-${postId}`);
    if (el) el.innerHTML = '';
  }
}

function selectPost(id) {
  const post = S.posts.find(p=>p.id===id);
  if (!post) return;

  // Visual update
  document.querySelectorAll('.post-card').forEach(c=>c.classList.remove('is-selected'));
  const card = document.getElementById(`pc-${id}`);
  if (card) {
    card.classList.add('is-selected');
    gsap.fromTo(card, { boxShadow:'0 0 0 1px var(--c-accent), inset 0 0 0 var(--c-accent-glow)' }, { duration:.3, ease:'power2.out' });
  }

  S.selectedPost = post;
  updateSelectedPostPreview();
  toast("Selected post",'success');
}

function clearSelectedPost() {
  S.selectedPost = null;
  document.querySelectorAll('.post-card').forEach(c=>c.classList.remove('is-selected'));
  updateSelectedPostPreview();
}

function updateSelectedPostPreview() {
  const el = document.getElementById('selectedPostPreview');
  if (!el) return;
  const p = S.selectedPost;
  const wrap = el.closest('.selected-post-wrap') || el.parentElement;

  if (!p) {
    wrap && wrap.classList.remove('has-post');
    el.innerHTML = `
      <div class="empty-selection">
        <span class="empty-arrow">${I.arrowLeft} Choose a post</span>
        <span style="font-size:12px;">Choose a post on the left to start building your campaign.</span>
      </div>
    `;
    return;
  }

  wrap && wrap.classList.add('has-post');
  el.innerHTML = `
    <div class="selected-post-inner">
      ${p.full_picture
        ? `<img src="${esc(p.full_picture)}" alt="" class="selected-post-thumb">`
        : `<div class="selected-post-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--c-text-3);">${I.image}</div>`
      }
      <div class="selected-post-info">
        <div class="selected-post-text">${esc(p.message||p.story||"(no text)")}</div>
        <div class="selected-post-meta">${fdate(p.created_time)} · ID: ${p.id}</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="clearSelectedPost()" title="Quitar">${I.x}</button>
    </div>
  `;
  gsap.from(el, { opacity:0, y:4, duration:.25, ease:'power2.out' });
}

// ── Right Column: Campaign Builder ────────────────────────────
function renderCampaignBlock() {
  const objectives = [
    {v:'OUTCOME_TRAFFIC',    l:"Traffic"},
    {v:'OUTCOME_ENGAGEMENT', l:'Engagement'},
    {v:'OUTCOME_SALES',      l:"Conversions"},
    {v:'OUTCOME_AWARENESS',  l:"Awareness"},
  ];
  const optimizations = [
    {v:'LINK_CLICKS',    l:"Clicks"},
    {v:'REACH',          l:"Reach"},
    {v:'IMPRESSIONS',    l:"Impressions"},
    {v:'POST_ENGAGEMENT',l:'Engagement'},
    {v:'OFFSITE_CONVERSIONS', l:"Purchases (pixel)"},
  ];
  const ctas = [
    {v:'LEARN_MORE',   l:"Learn more"},
    {v:'SHOP_NOW',     l:"Shop now"},
    {v:'SEND_MESSAGE', l:"Send message"},
    {v:'SIGN_UP',      l:"Sign up"},
    {v:'CONTACT_US',   l:"Contact us"},
    {v:'WATCH_MORE',   l:"Watch more"},
  ];
  const countries = [
    {v:'AR',l:'Argentina'},{v:'UY',l:'Uruguay'},{v:'CL',l:'Chile'},
    {v:'BR',l:"Brazil"},{v:'CO',l:'Colombia'},{v:'MX',l:"Mexico"},
    {v:'PE',l:"Peru"},{v:'ES',l:"Spain"},{v:'US',l:"US"},
  ];
  const today = new Date().toISOString().split('T')[0];

  return `
    <div class="tab-strip mb-6">
      <button class="tab-btn is-active" id="tabCreate" onclick="switchTab('create')">
        ${I.plus} Create campaign
      </button>
      <button class="tab-btn" id="tabCampaigns" onclick="switchTab('campaigns')">
        ${I.trending} Campaigns
      </button>
    </div>

    <!-- TAB: CREATE -->
    <div id="panelCreate">

      <div class="section-head"><span class="section-label">Contenido</span></div>
      <div class="selected-post-wrap mb-6">
        <div id="selectedPostPreview">
          <div class="empty-selection">
            <span class="empty-arrow">${I.arrowLeft} Choose a post</span>
            <span style="font-size:12px;">Choose a post to set up your campaign.</span>
          </div>
        </div>
      </div>

      <div class="hr mb-6"></div>

      <div class="form-stack" id="campaignForm">

        <!-- Ad Account -->
        <div class="form-field">
          <label class="field-label is-required">${I.ads} Ad account</label>
          <div class="selector-wrap">
            <select class="form-select" id="adAccountSelect" onchange="onAdAccountChange(this.value)">
              <option value="">Loading…</option>
            </select>
            <span class="selector-icon">${I.chevron}</span>
          </div>
        </div>

        <!-- Campaign Name -->
        <div class="form-field">
          <label class="field-label">${I.target} Campaign name</label>
          <input type="text" class="form-input" id="campaignName"
            placeholder="e.g. Spring launch — website traffic"
            oninput="F.campaignName=this.value">
        </div>

        <!-- Objective -->
        <div class="form-field">
          <label class="field-label is-required">Objective</label>
          <div class="pill-group" id="objectivePills">
            ${objectives.map(o=>`
              <button class="pill ${F.objective===o.v?'is-active':''}" onclick="setPill('objective','${o.v}',this)">${o.l}</button>
            `).join('')}
          </div>
        </div>

        <!-- Countries -->
        <div class="form-field">
          <label class="field-label is-required">Country</label>
          <div class="pill-group" id="countryPills">
            ${countries.map(c=>`
              <button class="pill ${F.countries.includes(c.v)?'is-active':''}" onclick="toggleCountry('${c.v}',this)">${c.l}</button>
            `).join('')}
          </div>
        </div>

        <!-- Age & Gender -->
        <div class="form-2col">
          <div class="form-field">
            <label class="field-label">Minimum age</label>
            <input type="number" class="form-input" id="ageMin" min="18" max="64" value="18"
              oninput="F.ageMin=parseInt(this.value)||18">
          </div>
          <div class="form-field">
            <label class="field-label">Maximum age</label>
            <input type="number" class="form-input" id="ageMax" min="18" max="65" value="65"
              oninput="F.ageMax=parseInt(this.value)||65">
          </div>
        </div>

        <div class="form-field">
          <label class="field-label">Gender</label>
          <div class="pill-group" id="genderPills">
            <button class="pill is-active" onclick="setPill('gender','0',this)">All</button>
            <button class="pill" onclick="setPill('gender','1',this)">Men</button>
            <button class="pill" onclick="setPill('gender','2',this)">Women</button>
          </div>
        </div>

        <!-- Interests -->
        <div class="form-field">
          <label class="field-label">${I.target} Interests</label>
          <div class="interest-field">
            <input type="text" class="form-input" id="interestInput"
              placeholder="Find interests (e.g. design, photography…)"
              oninput="searchInterests(this.value)"
              autocomplete="off">
            <div class="interest-dropdown" id="interestDropdown"></div>
          </div>
          <div class="tag-cloud" id="interestTags"></div>
        </div>

        <!-- Placements -->
        <div class="form-field">
          <label class="field-label">Placements</label>
          <div class="pill-group">
            <button class="pill is-active" id="pl-fb-feed" onclick="togglePlacement('fb','feed',this)">FB Feed</button>
            <button class="pill is-active" id="pl-ig-feed" onclick="togglePlacement('ig','stream',this)">IG Feed</button>
            <button class="pill" id="pl-ig-story" onclick="togglePlacement('ig','story',this)">IG Stories</button>
            <button class="pill" id="pl-ig-reels" onclick="togglePlacement('ig','reels',this)">IG Reels</button>
          </div>
          <p class="field-hint mt-2">Advantage+ placements are available in Meta Ads Manager.</p>
        </div>

        <!-- Budget -->
        <div class="form-field">
          <label class="field-label">Budget type</label>
          <div class="pill-group" id="budgetTypePills">
            <button class="pill is-active" onclick="setPill('budgetType','daily',this)">Daily</button>
            <button class="pill" onclick="setPill('budgetType','lifetime',this)">Lifetime</button>
          </div>
        </div>

        <div class="form-field">
          <label class="field-label is-required">Budget <span id="currencyLabel" style="text-transform:none;letter-spacing:0;">(ARS)</span></label>
          <input type="number" class="form-input" id="budgetInput"
            placeholder="e.g. 5000" min="1" step="100"
            oninput="F.budget=this.value">
          <p class="field-hint">Budget minimums depend on your account, currency, and campaign. Check Meta before publishing.</p>
        </div>

        <!-- Dates -->
        <div class="form-2col">
          <div class="form-field">
            <label class="field-label is-required">Start</label>
            <input type="date" class="form-input" id="startDate" min="${today}" oninput="F.startDate=this.value">
          </div>
          <div class="form-field">
            <label class="field-label">End</label>
            <input type="date" class="form-input" id="endDate" min="${today}" oninput="F.endDate=this.value">
            <p class="field-hint">Optional with a daily budget.</p>
          </div>
        </div>

        <!-- Optimization -->
        <div class="form-field">
          <label class="field-label">Optimization</label>
          <div class="selector-wrap">
            <select class="form-select" id="optimizationGoal" onchange="F.optimizationGoal=this.value">
              ${optimizations.map(o=>`<option value="${o.v}" ${F.optimizationGoal===o.v?'selected':''}>${o.l}</option>`).join('')}
            </select>
            <span class="selector-icon">${I.chevron}</span>
          </div>
        </div>

        <!-- CTA -->
        <div class="form-2col">
          <div class="form-field">
            <label class="field-label">Call to action</label>
            <div class="selector-wrap">
              <select class="form-select" id="ctaSelect" disabled title="Uses the original post's call to action" onchange="F.ctaType=this.value">
                ${ctas.map(c=>`<option value="${c.v}" ${F.ctaType===c.v?'selected':''}>${c.l}</option>`).join('')}
              </select>
              <span class="selector-icon">${I.chevron}</span>
            </div>
          </div>
          <div class="form-field">
            <label class="field-label">Pixel</label>
            <div class="selector-wrap">
              <select class="form-select" id="pixelSelect" onchange="F.pixelId=this.value">
                <option value="">No pixel</option>
              </select>
              <span class="selector-icon">${I.chevron}</span>
            </div>
          </div>
        </div>

        <!-- URL -->
        <div class="form-field">
          <label class="field-label">Destination URL</label>
          <input type="url" class="form-input" id="destinationUrl" disabled
            placeholder="https://example.com/landing"
            oninput="F.destinationUrl=this.value">
          <p class="field-hint">Uses the original post's link. To change it, use Meta Ads Manager.</p>
        </div>

        <!-- Limitations -->
        <div class="limits-box">
          <div class="limits-title">${I.warn} Before publishing</div>
          <div class="limits-item"><div class="limits-dot"></div>Components are created paused. Activation requires an active payment method.</div>
          <div class="limits-item"><div class="limits-dot"></div>Advanced Instagram permissions may require Meta App Review.</div>
          <div class="limits-item"><div class="limits-dot"></div>Purchase optimization requires a pixel with active events.</div>
          <div class="limits-item"><div class="limits-dot"></div>Meta may review ads before they can run.</div>
          <div class="limits-item"><div class="limits-dot"></div>City targeting requires location IDs from Meta's API.</div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button class="btn btn-ghost btn-full" onclick="previewCampaign(false)">
            Save paused
          </button>
          <button class="btn btn-accent btn-full" onclick="previewCampaign(true)">
            Review and publish ${I.arrowRight}
          </button>
        </div>

        <!-- Result -->
        <div id="campaignResult"></div>

      </div>
    </div>

    <!-- TAB: CAMPAIGNS -->
    <div id="panelCampaigns" class="hidden">
      <div class="section-head">
        <span class="section-label">Campaigns</span>
        <button class="btn btn-ghost btn-sm" onclick="loadAdAccountData()">Actualizar</button>
      </div>
      <div id="campaignsList">
        <div class="loading-row"><div class="spinner"></div><span>Loading…</span></div>
      </div>
    </div>
  `;
}

// ── Tab Switch ────────────────────────────────────────────────
function switchTab(tab) {
  S.activeTab = tab;
  document.getElementById('tabCreate')?.classList.toggle('is-active', tab==='create');
  document.getElementById('tabCampaigns')?.classList.toggle('is-active', tab==='campaigns');
  const pc = document.getElementById('panelCreate');
  const pp = document.getElementById('panelCampaigns');
  if (!pc || !pp) return;
  pc.classList.toggle('hidden', tab!=='create');
  pp.classList.toggle('hidden', tab!=='campaigns');
  if (tab==='campaigns') renderCampaigns();
}

// ── Form Helpers ──────────────────────────────────────────────
function setPill(field, val, btn) {
  F[field] = val;
  if (field === 'objective') {
    const defaults = { OUTCOME_TRAFFIC: 'LINK_CLICKS', OUTCOME_ENGAGEMENT: 'POST_ENGAGEMENT', OUTCOME_AWARENESS: 'REACH', OUTCOME_SALES: 'OFFSITE_CONVERSIONS' };
    F.optimizationGoal = defaults[val];
    const select = document.getElementById('optimizationGoal');
    if (select) select.value = F.optimizationGoal;
  }
  const parent = btn.parentElement;
  parent.querySelectorAll('.pill').forEach(b=>b.classList.remove('is-active'));
  btn.classList.add('is-active');
  gsap.from(btn, { scale:.92, duration:.2, ease:'back.out(2)' });
}

function toggleCountry(val, btn) {
  const idx = F.countries.indexOf(val);
  if (idx>=0) {
    if (F.countries.length===1) return; // keep at least 1
    F.countries.splice(idx,1);
    btn.classList.remove('is-active');
  } else {
    F.countries.push(val);
    btn.classList.add('is-active');
    gsap.from(btn, { scale:.9, duration:.2, ease:'back.out(2)' });
  }
}

function togglePlacement(platform, position, btn) {
  const isActive = btn.classList.contains('is-active');
  if (platform==='fb') {
    if (isActive) { F.placements.facebook_positions=F.placements.facebook_positions.filter(p=>p!==position); F.placements.platforms=F.placements.platforms.filter(p=>p!=='facebook'); }
    else { F.placements.facebook_positions.push(position); if(!F.placements.platforms.includes('facebook')) F.placements.platforms.push('facebook'); }
  } else {
    if (isActive) { F.placements.instagram_positions=F.placements.instagram_positions.filter(p=>p!==position); if(!F.placements.instagram_positions.length) F.placements.platforms=F.placements.platforms.filter(p=>p!=='instagram'); }
    else { F.placements.instagram_positions.push(position); if(!F.placements.platforms.includes('instagram')) F.placements.platforms.push('instagram'); }
  }
  btn.classList.toggle('is-active', !isActive);
}

function onPageChange(pageId) {
  S.selectedPost = null;
  S.posts = [];
  updateSelectedPostPreview();
  S.page = S.pages.find(p=>p.id===pageId) || null;
  renderAccountBlock();
  if (S.page) loadPageContent();
}

function onAdAccountChange(id) {
  S.pixels = [];
  S.campaigns = [];
  F.pixelId = '';
  updatePixelSelect();
  S.adAccount = S.adAccounts.find(a=>a.id===id) || null;
  const label = document.getElementById('currencyLabel');
  if (label) label.textContent = `(${S.adAccount?.currency||'ARS'})`;
  if (S.adAccount) loadAdAccountData();
}

function populateAdAccountSelect() {
  const el = document.getElementById('adAccountSelect');
  if (!el) return;
  el.innerHTML = S.adAccounts.length
    ? S.adAccounts.map(a=>`<option value="${a.id}" ${a.id===S.adAccount?.id?'selected':''}>${esc(a.name)} (${a.currency})</option>`).join('')
    : "<option value=\"\">No ad accounts</option>";
  const label = document.getElementById('currencyLabel');
  if (label && S.adAccount) label.textContent = `(${S.adAccount.currency})`;
}

function updatePixelSelect() {
  const el = document.getElementById('pixelSelect');
  if (!el) return;
  el.innerHTML = `<option value="">No pixel</option>` +
    S.pixels.map(px=>`<option value="${px.id}">${esc(px.name)} (${px.id})</option>`).join('');
}

// ── Interests ─────────────────────────────────────────────────
let intTimeout;
async function searchInterests(q) {
  clearTimeout(intTimeout);
  const dd = document.getElementById('interestDropdown');
  if (!dd) return;
  if (!q || q.length < 2) { dd.classList.remove('is-open'); return; }

  intTimeout = setTimeout(async () => {
    dd.classList.add('is-open');
    dd.innerHTML = `<div class="interest-option" style="color:var(--c-text-3);">Searching…</div>`;
    try {
      const data = await API.get(`/api/interests/search?q=${encodeURIComponent(q)}`);
      const items = data.data || [];
      if (!items.length) { dd.innerHTML=`<div class="interest-option" style="color:var(--c-text-3);">No results</div>`; return; }
      dd.innerHTML = items.slice(0,10).map(i=>`
        <div class="interest-option" onclick="addInterest('${i.id}','${esc(i.name).replace(/'/g,"\\'")}')">
          <span>${esc(i.name)}</span>
          ${i.audience_size_lower_bound ? `<span class="interest-size">${num(i.audience_size_lower_bound)}+</span>` : ''}
        </div>
      `).join('');
    } catch { dd.innerHTML=`<div class="interest-option" style="color:var(--c-red);">Search failed</div>`; }
  }, 380);
}

function addInterest(id, name) {
  if (F.interests.find(i=>i.id===id)) return;
  F.interests.push({id,name});
  renderInterestTags();
  document.getElementById('interestInput').value = '';
  document.getElementById('interestDropdown')?.classList.remove('is-open');
}

function removeInterest(id) {
  F.interests = F.interests.filter(i=>i.id!==id);
  renderInterestTags();
}

function renderInterestTags() {
  const el = document.getElementById('interestTags');
  if (!el) return;
  el.innerHTML = F.interests.map(i=>`
    <span class="tag">
      ${esc(i.name)}
      <span class="tag-remove" onclick="removeInterest('${i.id}')">${I.x}</span>
    </span>
  `).join('');
}

document.addEventListener('click', e => {
  const dd = document.getElementById('interestDropdown');
  if (dd && !dd.contains(e.target) && e.target.id!=='interestInput') {
    dd.classList.remove('is-open');
  }
});

// ── Campaign Preview & Submit ─────────────────────────────────
function previewCampaign(publish) {
  const errors = [];
  if (!S.adAccount) errors.push("Choose an ad account.");
  if (!F.objective) errors.push("Choose an objective.");
  if (!F.countries.length) errors.push("Choose at least one country.");
  if (!F.budget || parseFloat(F.budget)<=0) errors.push("Enter a valid budget.");
  if (!F.startDate) errors.push("Choose a start date.");
  if (!S.selectedPost) errors.push("Choose a post for the campaign.");
  if (F.budgetType === 'lifetime' && !F.endDate) errors.push("A lifetime budget needs an end date.");
  if (F.endDate && Date.parse(F.endDate) <= Date.parse(F.startDate)) errors.push("Check the end date.");
  if (Number(F.ageMin) > Number(F.ageMax)) errors.push("Check the age range.");
  if (!F.placements.platforms.length) errors.push("Choose a placement.");
  const goals = { OUTCOME_TRAFFIC: ['LINK_CLICKS', 'LANDING_PAGE_VIEWS'], OUTCOME_ENGAGEMENT: ['POST_ENGAGEMENT'], OUTCOME_AWARENESS: ['REACH','IMPRESSIONS'], OUTCOME_SALES: ['OFFSITE_CONVERSIONS'] };
  if (!goals[F.objective]?.includes(F.optimizationGoal)) errors.push("Choose an optimization goal that matches the objective.");
  if (F.objective === 'OUTCOME_SALES' && !F.pixelId) errors.push("Choose a pixel for purchases.");
  if (errors.length) { toast(errors[0],'error'); return; }

  const objLabels = {OUTCOME_TRAFFIC:"Traffic",OUTCOME_ENGAGEMENT:'Engagement',OUTCOME_LEADS:'Leads',OUTCOME_SALES:"Conversions",OUTCOME_AWARENESS:"Awareness"};
  const cntLabels = {AR:'Argentina',UY:'Uruguay',CL:'Chile',BR:"Brazil",CO:'Colombia',MX:"Mexico",PE:"Peru",ES:"Spain",US:"US"};
  const genLabels = {'0':"All",'1':"Men",'2':"Women"};
  const plStr = [
    F.placements.platforms.includes('facebook')?'FB Feed':null,
    F.placements.instagram_positions.includes('stream')?'IG Feed':null,
    F.placements.instagram_positions.includes('story')?'IG Stories':null,
    F.placements.instagram_positions.includes('reels')?'IG Reels':null,
  ].filter(Boolean).join(', ') || 'Ninguno';

  const rows = [
    ["Objective",    objLabels[F.objective]||F.objective],
    ["Country",        F.countries.map(c=>cntLabels[c]||c).join(', ')],
    ["Age",        `${F.ageMin} – ${F.ageMax} years`],
    ["Gender",      genLabels[F.gender]],
    ["Interests",   F.interests.length?F.interests.map(i=>i.name).join(', '):"None (broad audience)"],
    ["Budget", `${F.budgetType==='daily'?"Daily":"Lifetime"}: ${F.budget} ${S.adAccount?.currency||''}`],
    ["Start",      fdate(F.startDate)],
    ["End",         F.endDate?fdate(F.endDate):"No end date"],
    ['Placements',  plStr],
    ['Post',        (S.selectedPost?.message||S.selectedPost?.story||"(no text)").substring(0,70)+'…'],
    ["Status",      publish?'ACTIVE':"PAUSED"],
  ];

  const modal = document.getElementById('modal-layer');
  modal.innerHTML = `
    <div class="modal-scrim" id="modalScrim" onclick="if(event.target.id==='modalScrim')closeModal()">
      <div class="modal-box" id="modalBox">
        <h2 class="modal-title">Review your campaign</h2>
        <div class="summary-grid">
          ${rows.map(([k,v])=>`<div class="summary-key">${esc(k)}</div><div class="summary-val">${esc(String(v))}</div>`).join('')}
        </div>
        ${renderAlert(publish?'warn':'info', publish
          ? "This will activate the campaign. Meta may review the ad before it runs. Payment or policy issues can prevent delivery."
          : "The campaign will be saved paused. You can activate it in Meta Ads Manager when you're ready."
        )}
        <div class="modal-actions" style="margin-top:var(--sp-6);">
          <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
          <button class="btn btn-accent" onclick="submitCampaign(${publish})">
            ${publish?"Publish campaign":"Save paused"} ${I.arrowRight}
          </button>
        </div>
      </div>
    </div>
  `;

  gsap.to('#modalScrim', { opacity:1, duration:.2, ease:'power2.out' });
  gsap.to('#modalBox', { opacity:1, y:0, scale:1, duration:.28, ease:'power3.out' });
}

function closeModal() {
  gsap.to('#modalScrim', { opacity:0, duration:.18, ease:'power2.in', onComplete: ()=>{ document.getElementById('modal-layer').innerHTML=''; }});
}

async function submitCampaign(publish) {
  if (S.submitting) return;
  S.submitting = true;
  closeModal();
  const resultEl = document.getElementById('campaignResult');
  if (!resultEl) { S.submitting = false; return; }

  resultEl.innerHTML = `<div class="loading-row" style="margin:0;padding:var(--sp-4) 0;"><div class="spinner"></div><span>Creating your campaign in Meta…</span></div>`;
  gsap.from(resultEl, { opacity:0, y:4, duration:.2 });

  const postIdParts = S.selectedPost.id.split('_');
  const postId = postIdParts[postIdParts.length-1];

  try {
    const result = await API.post(`/api/adaccounts/${S.adAccount.id}/create-campaign`, {
      campaignName: F.campaignName || `Campaign ${new Date().toLocaleDateString("en-US")}`,
      objective: F.objective,
      countries: F.countries,
      ageMin: F.ageMin,
      ageMax: F.ageMax,
      gender: F.gender,
      interests: F.interests,
      placements: F.placements,
      budgetType: F.budgetType,
      budget: F.budget,
      startDate: F.startDate,
      endDate: F.endDate || null,
      optimizationGoal: F.optimizationGoal,
      ctaType: F.ctaType,
      destinationUrl: F.destinationUrl || null,
      pixelId: F.pixelId || null,
      pageId: S.page?.id,
      postId,
      publishNow: publish,
    });

    const adsManagerUrl = `https://www.facebook.com/adsmanager/manage/ads?act=${S.adAccount?.id?.replace('act_','')}`;

    resultEl.innerHTML = `
      <div class="result-panel">
        <div class="result-panel-head">
          <span style="color:var(--c-green);">${I.check}</span>
          <span>Campaign created</span>
        </div>
        ${result.campaign ? `<div class="result-row"><span class="result-key">Campaign ID</span><span class="result-val mono">${result.campaign.id}</span></div>` : ''}
        ${result.adSet   ? `<div class="result-row"><span class="result-key">Ad Set ID</span><span class="result-val mono">${result.adSet.id}</span></div>` : ''}
        ${result.creative? `<div class="result-row"><span class="result-key">Creative ID</span><span class="result-val mono">${result.creative.id}</span></div>` : ''}
        ${result.ad      ? `<div class="result-row"><span class="result-key">Ad ID</span><span class="result-val mono">${result.ad.id}</span></div>` : ''}
        <div class="result-row">
          <span class="result-key">Open in Meta</span>
          <span class="result-val"><a href="${adsManagerUrl}" target="_blank">Meta Ads Manager ${I.external}</a></span>
        </div>
        ${result.errors?.length ? `
          <div style="padding:var(--sp-3) var(--sp-5);">
            ${renderAlert('warn', "Warnings: "+result.errors.map(e=>`[${e.step}] ${e.error?.message||''}`).join('; '))}
          </div>
        ` : ''}
      </div>
    `;
    gsap.from(resultEl, { opacity:0, y:6, duration:.3, ease:'power2.out' });
    toast("Campaign created",'success');
    loadAdAccountData();

  } catch(err) {
    resultEl.innerHTML = `
      ${err.partial?.campaign ? renderAlert('warn', "Campaign created: " + esc(err.partial.campaign.id) + ". Check Meta Ads Manager before retrying.") : ''}
      ${renderAlert('error', `${esc(err.message||"Unknown error")}${err.code ? ` (code ${err.code})` : ''}${err.type==='OAuthException'||err.code===190?" — <a href=\"/auth/login\" style=\"color:var(--c-accent);\">Reconnect your account</a>":''}`)}
      ${err.code===100||err.code===17 ? renderAlert('info',"This app is in development mode. Some endpoints require Meta App Review.") : ''}
    `;
    gsap.from(resultEl, { opacity:0, y:4, duration:.2 });
    toast("Could not create the campaign",'error');
  }
}

// ── Campaigns List ────────────────────────────────────────────
function renderCampaigns() {
  const el = document.getElementById('campaignsList');
  if (!el) return;
  const cs = S.campaigns;

  if (!cs.length) {
    el.innerHTML = `<div style="color:var(--c-text-3);font-size:13px;padding:var(--sp-4) 0;">${S.adAccount?"No campaigns in this account yet.":"Choose an ad account."}</div>`;
    return;
  }

  const badgeClass = s => ({ACTIVE:'badge-green',PAUSED:'badge-amber',ARCHIVED:'badge-muted',DELETED:'badge-red'}[s]||'badge-muted');

  el.innerHTML = `
    <div class="campaigns-wrap">
      <table class="campaigns-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Objective</th>
            <th>Budget</th>
            <th>Start</th>
          </tr>
        </thead>
        <tbody>
          ${cs.map(c=>`
            <tr>
              <td class="campaign-name-cell" title="${esc(c.name)}">${esc(c.name)}</td>
              <td><span class="badge ${badgeClass(c.status)}">${c.status}</span></td>
              <td style="color:var(--c-text-2);font-size:12px;">${(c.objective||'').replace('OUTCOME_','')}</td>
              <td class="mono" style="font-size:12px;">
                ${c.daily_budget?fcur(c.daily_budget/100,S.adAccount?.currency)+"/day":''}
                ${c.lifetime_budget?fcur(c.lifetime_budget/100,S.adAccount?.currency)+' total':''}
                ${!c.daily_budget&&!c.lifetime_budget?'—':''}
              </td>
              <td style="font-size:12px;">${fdate(c.start_time)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top:var(--sp-4);text-align:right;">
      <a href="https://www.facebook.com/adsmanager" target="_blank" style="font-size:12px;color:var(--c-accent);display:inline-flex;align-items:center;gap:4px;">
        Open in Meta Ads Manager ${I.external}
      </a>
    </div>
  `;
  gsap.from('.campaigns-table tbody tr', { opacity:0, x:-6, duration:.3, stagger:.04, ease:'power2.out' });
}

// ── Alert Helper ──────────────────────────────────────────────
function renderAlert(type, msg) {
  const icons = { info:I.info, warn:I.warn, error:I.x, success:I.check };
  return `
    <div class="alert alert-${type==='error'?'error':type==='warn'?'warn':type==='success'?'success':'info'}">
      <span class="alert-icon">${icons[type]||I.info}</span>
      <div class="alert-body">${msg}</div>
    </div>
  `;
}

// ── Logout ────────────────────────────────────────────────────
async function logout() {
  await API.post('/auth/logout',{}).catch(()=>{});
  gsap.to('.app-shell',{ opacity:0, duration:.25, onComplete:()=>window.location.reload() });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', boot);
