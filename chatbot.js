(function () {
  if (window._EE_BOT_INIT) return;
  window._EE_BOT_INIT = true;

  /* ── Styles ─────────────────────────────────────────────── */
  const css = `
    #ee-bot-fab {
      position:fixed; bottom:22px; right:22px; z-index:9999;
      width:58px; height:58px; border-radius:50%;
      background:linear-gradient(135deg,#b8860b,#ffd700,#ffe066);
      border:none; cursor:pointer; padding:0; overflow:hidden;
      box-shadow:0 4px 24px rgba(255,215,0,0.35),0 2px 8px rgba(0,0,0,0.55);
      transition:transform 0.22s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.22s;
      display:flex; align-items:center; justify-content:center;
    }
    #ee-bot-fab:hover { transform:scale(1.09); box-shadow:0 6px 32px rgba(255,215,0,0.5),0 2px 8px rgba(0,0,0,0.55); }
    #ee-bot-fab img { width:38px; height:38px; object-fit:contain; border-radius:50%; }
    #ee-bot-fab .ee-bot-badge {
      position:absolute; top:2px; right:2px; width:13px; height:13px;
      background:#4ade80; border-radius:50%; border:2px solid #111;
      animation:eePulse 2s infinite;
    }
    @keyframes eePulse { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.6);}60%{box-shadow:0 0 0 7px rgba(74,222,128,0);} }

    #ee-bot-panel {
      position:fixed; bottom:92px; right:22px; z-index:9998;
      width:340px; max-width:calc(100vw - 32px);
      background:#0f0f0f; border:1px solid rgba(255,215,0,0.18);
      border-radius:20px; overflow:hidden;
      box-shadow:0 8px 48px rgba(0,0,0,0.7),0 2px 12px rgba(255,215,0,0.08);
      display:flex; flex-direction:column;
      transform:translateY(14px) scale(0.97); opacity:0; pointer-events:none;
      transition:transform 0.28s cubic-bezier(0.34,1.2,0.64,1), opacity 0.22s ease;
      max-height:78vh;
    }
    #ee-bot-panel.open {
      transform:translateY(0) scale(1); opacity:1; pointer-events:all;
    }
    #ee-bot-header {
      display:flex; align-items:center; gap:10px; padding:13px 16px;
      background:linear-gradient(135deg,rgba(184,134,11,0.18),rgba(255,215,0,0.06));
      border-bottom:1px solid rgba(255,215,0,0.1); flex-shrink:0;
    }
    #ee-bot-logo {
      width:34px; height:34px; border-radius:50%; object-fit:contain;
      border:1.5px solid rgba(255,215,0,0.35); flex-shrink:0;
      background:#1a1a1a;
    }
    #ee-bot-header-text { flex:1; }
    #ee-bot-name { font-size:0.84rem; font-weight:800; color:#fff; letter-spacing:0.04em; }
    #ee-bot-status { font-size:0.62rem; color:rgba(74,222,128,0.8); margin-top:1px; }
    #ee-bot-page-badge {
      font-size:0.58rem; font-weight:700; letter-spacing:0.12em;
      color:rgba(255,215,0,0.45); background:rgba(255,215,0,0.05);
      padding:4px 16px; border-bottom:1px solid rgba(255,215,0,0.06);
      flex-shrink:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }
    #ee-bot-close {
      background:none; border:none; color:rgba(255,255,255,0.3); font-size:1rem;
      cursor:pointer; padding:2px 6px; transition:color 0.18s; flex-shrink:0;
    }
    #ee-bot-close:hover { color:#fff; }
    #ee-bot-messages {
      flex:1; overflow-y:auto; padding:14px 14px 6px;
      display:flex; flex-direction:column; gap:9px;
      scroll-behavior:smooth; min-height:140px; max-height:320px;
    }
    #ee-bot-messages::-webkit-scrollbar { width:3px; }
    #ee-bot-messages::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:2px; }
    .ee-msg {
      max-width:88%; padding:9px 13px; font-size:0.82rem;
      line-height:1.55; white-space:pre-wrap; word-break:break-word;
    }
    .ee-msg-bot {
      align-self:flex-start; background:rgba(255,255,255,0.06);
      color:rgba(255,255,255,0.82); border-radius:4px 14px 14px 14px;
    }
    .ee-msg-user {
      align-self:flex-end; background:rgba(255,215,0,0.11);
      color:#fff; border-radius:14px 14px 4px 14px;
      border:1px solid rgba(255,215,0,0.15);
    }
    .ee-typing { display:flex; gap:5px; align-items:center; padding:4px 2px; }
    .ee-typing span {
      width:7px; height:7px; border-radius:50%;
      background:rgba(255,255,255,0.3); animation:eeDot 1.2s infinite;
    }
    .ee-typing span:nth-child(2){animation-delay:0.2s;}
    .ee-typing span:nth-child(3){animation-delay:0.4s;}
    @keyframes eeDot{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-5px);}}
    #ee-bot-suggestions {
      display:flex; gap:6px; padding:6px 12px 4px; flex-wrap:wrap; flex-shrink:0;
    }
    .ee-sugg {
      background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
      border-radius:20px; padding:5px 11px; font-size:0.68rem;
      color:rgba(255,255,255,0.4); cursor:pointer; font-family:inherit;
      transition:all 0.18s; white-space:nowrap;
    }
    .ee-sugg:hover { border-color:rgba(255,215,0,0.3); color:#ffd700; }
    #ee-bot-input-row {
      display:flex; gap:8px; padding:10px 12px 12px; flex-shrink:0;
      border-top:1px solid rgba(255,255,255,0.05);
    }
    #ee-bot-input {
      flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
      border-radius:10px; padding:9px 12px; font-size:0.84rem; color:#fff;
      font-family:inherit; outline:none; transition:border-color 0.2s;
    }
    #ee-bot-input:focus { border-color:rgba(255,215,0,0.38); }
    #ee-bot-input::placeholder { color:rgba(255,255,255,0.2); }
    #ee-bot-send {
      width:38px; height:38px; border-radius:10px; border:none; cursor:pointer;
      background:linear-gradient(135deg,#b8860b,#ffd700);
      color:#000; font-size:1.1rem; font-weight:900;
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0; transition:opacity 0.18s; font-family:inherit;
    }
    #ee-bot-send:hover { opacity:0.85; }
    #ee-bot-send:disabled { opacity:0.3; cursor:default; }
    @media(max-width:400px){
      #ee-bot-panel { right:10px; bottom:84px; width:calc(100vw - 20px); }
      #ee-bot-fab { right:14px; bottom:16px; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Widget HTML ─────────────────────────────────────────── */
  const logoSrc = (function () {
    const scripts = document.querySelectorAll('script[src]');
    for (const s of scripts) {
      if (s.src.includes('chatbot.js')) {
        return s.src.replace('chatbot.js', 'images/ethos-empire-logo.webp');
      }
    }
    return '/images/ethos-empire-logo.webp';
  })();

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div id="ee-bot-panel" role="dialog" aria-label="Empire AI Chat">
      <div id="ee-bot-header">
        <img id="ee-bot-logo" src="${logoSrc}" alt="Ethos Empire">
        <div id="ee-bot-header-text">
          <div id="ee-bot-name">Empire AI</div>
          <div id="ee-bot-status">● Online · Your personal coach</div>
        </div>
        <button id="ee-bot-close" aria-label="Close chat">✕</button>
      </div>
      <div id="ee-bot-page-badge"></div>
      <div id="ee-bot-messages"></div>
      <div id="ee-bot-suggestions">
        <button class="ee-sugg">Build my full plan</button>
        <button class="ee-sugg">Recommend an ebook</button>
        <button class="ee-sugg">Help with discipline</button>
        <button class="ee-sugg">How do I cancel?</button>
      </div>
      <div id="ee-bot-input-row">
        <input id="ee-bot-input" type="text" placeholder="Ask anything..." autocomplete="off">
        <button id="ee-bot-send" aria-label="Send">↑</button>
      </div>
    </div>
    <button id="ee-bot-fab" aria-label="Open Empire AI">
      <img src="${logoSrc}" alt="EE">
      <span class="ee-bot-badge"></span>
    </button>
  `;
  document.body.appendChild(wrap);

  /* ── State ────────────────────────────────────────────────── */
  let isOpen = false;
  let messages = [];
  let sending = false;

  /* ── Page detection ──────────────────────────────────────── */
  const PAGE_LABELS = {
    'index.html': 'Home page',
    'login.html': 'Login page',
    'onboarding.html': 'Onboarding / Goal Setup',
    'plan.html': 'Subscription & Plans page',
    'dashboard.html': 'Member Dashboard',
    'privacy-policy.html': 'Privacy Policy page',
    'terms.html': 'Terms of Service page',
  };

  function getCurrentPage() {
    const file = (window.location.pathname.split('/').pop() || 'index.html');
    let label = PAGE_LABELS[file] || document.title || 'Ethos Empire';
    if (file === 'dashboard.html') {
      const tab = document.querySelector('.db-tab.active');
      if (tab) label = 'Dashboard — ' + tab.textContent.replace(/[^\w\s]/g,'').trim() + ' tab';
    }
    return label;
  }

  function refreshPageBadge() {
    const el = document.getElementById('ee-bot-page-badge');
    if (el) el.textContent = '📍 ' + getCurrentPage().toUpperCase();
  }

  /* ── Auth token ──────────────────────────────────────────── */
  async function getToken() {
    try {
      if (window.EE_USER?.firebaseUser?.getIdToken) {
        return await window.EE_USER.firebaseUser.getIdToken();
      }
    } catch (_) {}
    return null;
  }

  /* ── Render messages ─────────────────────────────────────── */
  function renderMessages() {
    const el = document.getElementById('ee-bot-messages');
    if (!el) return;
    if (messages.length === 0) {
      const name = window.EE_USER?.name || window.EE_PLAN_PROFILE?.name || '';
      el.innerHTML = `<div class="ee-msg ee-msg-bot">Hey${name ? ' ' + name.split(' ')[0] : ''} 👋 I'm Empire AI — your personal Ethos Empire coach. Ask me anything, or tap a suggestion below.</div>`;
      return;
    }
    el.innerHTML = messages.map(m =>
      `<div class="ee-msg ee-msg-${m.role === 'user' ? 'user' : 'bot'}">${escapeHtml(m.content)}</div>`
    ).join('');
    el.scrollTop = el.scrollHeight;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  /* ── Send message ────────────────────────────────────────── */
  async function sendMessage(text) {
    text = text.trim();
    if (!text || sending) return;
    sending = true;

    document.getElementById('ee-bot-input').value = '';
    document.getElementById('ee-bot-send').disabled = true;
    document.getElementById('ee-bot-suggestions').style.display = 'none';

    messages.push({ role: 'user', content: text });
    renderMessages();

    // Typing indicator
    const msgEl = document.getElementById('ee-bot-messages');
    const typing = document.createElement('div');
    typing.className = 'ee-msg ee-msg-bot';
    typing.innerHTML = '<div class="ee-typing"><span></span><span></span><span></span></div>';
    msgEl.appendChild(typing);
    msgEl.scrollTop = msgEl.scrollHeight;

    try {
      const token = await getToken();
      const weekData = typeof getWeekData === 'function'
        ? getWeekData().map(d => ({ day: d.day, pct: d.pct ?? 0 }))
        : [];

      const res = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {})
        },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          planProfile: window.EE_PLAN_PROFILE || {},
          weekData,
          currentPage: getCurrentPage(),
          userName: window.EE_USER?.name || window.EE_PLAN_PROFILE?.name || ''
        })
      });

      typing.remove();

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server returned ' + res.status);
      }

      const data = await res.json();
      const reply = data.reply || 'No response — please try again.';
      messages.push({ role: 'assistant', content: reply });

    } catch (err) {
      typing.remove();
      console.error('Empire AI error:', err.message);
      messages.push({
        role: 'assistant',
        content: 'Something went wrong reaching Empire AI. Make sure you\'re connected, then try again. If this keeps happening, contact info.ethosempire@gmail.com.'
      });
    }

    renderMessages();
    document.getElementById('ee-bot-send').disabled = false;
    sending = false;
  }

  /* ── Open / close ────────────────────────────────────────── */
  function openPanel() {
    isOpen = true;
    document.getElementById('ee-bot-panel').classList.add('open');
    refreshPageBadge();
    renderMessages();
    setTimeout(() => document.getElementById('ee-bot-input').focus(), 220);
  }

  function closePanel() {
    isOpen = false;
    document.getElementById('ee-bot-panel').classList.remove('open');
  }

  /* ── Events ──────────────────────────────────────────────── */
  document.getElementById('ee-bot-fab').addEventListener('click', () => {
    isOpen ? closePanel() : openPanel();
  });

  document.getElementById('ee-bot-close').addEventListener('click', closePanel);

  document.getElementById('ee-bot-send').addEventListener('click', () => {
    sendMessage(document.getElementById('ee-bot-input').value);
  });

  document.getElementById('ee-bot-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage(e.target.value);
  });

  document.querySelectorAll('.ee-sugg').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent));
  });

  // Keep page badge current when dashboard tabs change
  document.addEventListener('click', e => {
    if (e.target.closest?.('.db-tab')) {
      setTimeout(refreshPageBadge, 80);
    }
  });
})();
