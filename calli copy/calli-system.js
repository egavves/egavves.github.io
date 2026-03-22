/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CALLI SYSTEM — Shared JavaScript
 *  Calli Labs · v1.0 · 2026
 * ─────────────────────────────────────────────────────────────────────────
 *  Sections:
 *  01. Config & Constants
 *  02. Proxy / API Utilities
 *  03. Unified Navigation Init
 *  04. Info Button + Popover System
 *  05. Hover Popup (rich tooltip with image/video support)
 *  06. Panel Expand / Collapse
 *  07. Calliope Command Bar (base implementation)
 *  08. Format Utilities (dates, numbers, ago, etc.)
 *  09. Math Tooltip System
 *  10. Modal Helpers
 *  11. Scroll / UI Utilities
 *  12. Dataset Switcher
 *  13. Project Dropdown
 *  14. Global Settings Panel
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ── 01. CONFIG & CONSTANTS ─────────────────────────────────────────────── */
const CALLI = window.CALLI || {};

CALLI.PROXY_BASE  = 'http://localhost:5765';
CALLI.PROXY_PING  = CALLI.PROXY_BASE + '/api/ping';
CALLI.VERSION     = '1.0';

// Expose globally so dashboards can override
window.CALLI = CALLI;


/* ── 02. PROXY / API UTILITIES ──────────────────────────────────────────── */

/**
 * Fetch JSON from local proxy with timeout and error normalisation.
 * @param {string} endpoint  – path starting with /api/...
 * @param {object} [opts]    – fetch options
 * @param {number} [timeout] – ms (default 10000)
 * @returns {Promise<any>}
 */
CALLI.fetchProxy = async function(endpoint, opts = {}, timeout = 10000) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res  = await fetch(CALLI.PROXY_BASE + endpoint, { ...opts, signal: ctrl.signal });
    clearTimeout(tid);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      throw new Error('Non-JSON response from proxy');
    }
    return await res.json();
  } catch (err) {
    clearTimeout(tid);
    throw err;
  }
};

/**
 * Check proxy health and update all .proxy-badge elements.
 * @param {string} [badgeSel] – selector for badge elements (default '.proxy-badge')
 */
CALLI.checkProxy = async function(badgeSel = '.proxy-badge') {
  const badges = document.querySelectorAll(badgeSel);
  const setAll = (cls, dotStyle, label) => {
    badges.forEach(b => {
      b.className = `proxy-badge ${cls}`;
      const dot  = b.querySelector('.status-dot');
      const span = b.querySelector('.proxy-text');
      if (dot)  dot.className = 'status-dot';
      if (span) span.textContent = label;
    });
  };
  setAll('checking', '', 'Checking…');
  try {
    await CALLI.fetchProxy('/api/ping', {}, 3000);
    setAll('online', '', 'Proxy Online');
  } catch (_) {
    setAll('offline', '', 'Proxy Offline');
  }
};

/**
 * Auto-retry proxy check until online, then call cb.
 */
CALLI.waitForProxy = function(cb, interval = 3000) {
  const check = async () => {
    try {
      await CALLI.fetchProxy('/api/ping', {}, 2000);
      cb();
    } catch (_) {
      setTimeout(check, interval);
    }
  };
  check();
};


/* ── 03. UNIFIED NAVIGATION INIT ────────────────────────────────────────── */

/**
 * Mark the correct nav-tab / nav-chip as active based on current filename.
 * Call once on DOMContentLoaded.
 */
CALLI.initNav = function() {
  const file = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.unified-nav .nav-tab, nav.unified-nav .nav-chip').forEach(el => {
    const href = el.getAttribute('href') || '';
    if (href && (href === file || href.endsWith('/' + file))) {
      el.classList.add('nav-active');
    }
  });
};

/**
 * Build the standard nav HTML string.
 * Each dashboard calls this or writes its own nav — kept here as reference.
 * @param {string} activeHref – filename of current page
 * @param {Array}  tabs       – [{label, href, soon}]
 * @param {Array}  chips      – [{label, href, icon, soon, cls}]
 * @param {object} [dataOpts] – {datasets:[{val,label}], current, addHref}
 */
CALLI.buildNav = function(activeHref, tabs = [], chips = [], dataOpts = null) {
  const tabsHtml = tabs.map(t => {
    const cls = [
      'nav-tab',
      t.href === activeHref ? 'nav-active' : '',
      t.soon ? 'nav-soon' : ''
    ].filter(Boolean).join(' ');
    return `<a href="${t.href}" class="${cls}">${t.label}</a>`;
  }).join('');

  let dropdownHtml = '';
  if (dataOpts) {
    const options = (dataOpts.datasets || []).map(d =>
      `<option value="${d.val}" ${d.val === dataOpts.current ? 'selected' : ''}>${d.label}</option>`
    ).join('');
    dropdownHtml = `
      <div class="nav-vsep"></div>
      <div class="nav-data-dropdown">
        <span class="nav-section-label nav-data-label">Dataset</span>
        <select class="nav-data-select" id="navDataSelect">${options}</select>
        ${dataOpts.addHref ? `<a href="${dataOpts.addHref}" class="nav-add-data-btn">＋ Add Data</a>` : ''}
      </div>`;
  }

  const chipsHtml = chips.map(c => {
    const cls = [
      'nav-chip',
      c.href === activeHref ? 'nav-active' : '',
      c.soon ? 'nav-soon' : '',
      c.cls || ''
    ].filter(Boolean).join(' ');
    return `<a href="${c.href || '#'}" class="${cls}">${c.icon ? c.icon + ' ' : ''}${c.label}</a>`;
  }).join('');

  return `
    <nav class="unified-nav">
      <a href="index.html" class="nav-brand">✦ Calli</a>
      <div class="nav-vsep"></div>
      <span class="nav-section-label nav-ai-label">AI</span>
      ${tabsHtml}
      ${dropdownHtml}
      <div class="nav-spacer"></div>
      ${chipsHtml}
    </nav>`;
};


/* ── 04. INFO BUTTON + POPOVER SYSTEM ───────────────────────────────────── */

(function() {
  let _popover = null;
  let _activeBtn = null;

  function getPopover() {
    if (!_popover) {
      _popover = document.createElement('div');
      _popover.className = 'info-popover anim-fadein';
      _popover.innerHTML = `
        <button class="info-popover-close" aria-label="Close">✕</button>
        <div class="info-popover-title"></div>
        <div class="info-popover-body"></div>`;
      _popover.querySelector('.info-popover-close')
              .addEventListener('click', CALLI.hideInfo);
      document.body.appendChild(_popover);

      document.addEventListener('click', e => {
        if (_popover && _popover.classList.contains('visible')) {
          if (!_popover.contains(e.target) && e.target !== _activeBtn) {
            CALLI.hideInfo();
          }
        }
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') CALLI.hideInfo();
      });
    }
    return _popover;
  }

  /**
   * Show info popover near a button element.
   * @param {string} key   – key into CALLI.INFO_CONTENT map
   * @param {Element} btn  – the button that was clicked
   */
  CALLI.showInfo = function(key, btn) {
    const content = (CALLI.INFO_CONTENT || {})[key];
    if (!content) return;

    const pop = getPopover();
    _activeBtn = btn;

    pop.querySelector('.info-popover-title').innerHTML = content.title || '';
    pop.querySelector('.info-popover-body').innerHTML  = content.body  || '';

    pop.classList.remove('visible');
    pop.style.display = 'block';
    pop.style.visibility = 'hidden';

    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    pop.style.display = '';
    pop.style.visibility = '';

    const rect = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top  = rect.bottom + 6;
    let left = rect.left + rect.width / 2 - pw / 2;

    // Flip up if near bottom
    if (top + ph > vh - 12) top = rect.top - ph - 6;
    // Clamp horizontal
    left = Math.max(8, Math.min(left, vw - pw - 8));
    // Clamp vertical
    top  = Math.max(8, top);

    pop.style.top    = top  + 'px';
    pop.style.left   = left + 'px';
    pop.classList.add('visible');
  };

  CALLI.hideInfo = function() {
    if (_popover) _popover.classList.remove('visible');
    _activeBtn = null;
  };

  /**
   * Wire up all .info-btn elements that have data-info-key attributes.
   * Call after DOM is ready (or after dynamic content is inserted).
   */
  CALLI.initInfoButtons = function(root = document) {
    root.querySelectorAll('.info-btn[data-info-key]').forEach(btn => {
      if (btn._calliInfoWired) return;
      btn._calliInfoWired = true;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const key = btn.getAttribute('data-info-key');
        if (_activeBtn === btn && _popover && _popover.classList.contains('visible')) {
          CALLI.hideInfo();
        } else {
          CALLI.showInfo(key, btn);
        }
      });
    });
  };
})();

/** Default INFO_CONTENT map — dashboards extend this */
CALLI.INFO_CONTENT = {
  nav: {
    title: '✦ Calli Navigation',
    body: `<p>Use the top navigation bar to switch between dashboards.</p>
           <p>The <strong>Dataset selector</strong> (teal dropdown) switches the active data collection.</p>
           <p><strong>Keyboard:</strong> <code>Alt+1…9</code> to jump to tabs.</p>`
  },
  calliope: {
    title: '✦ Calliope — AI Command Bar',
    body: `<p>Type natural language commands and press <code>Enter</code> or click <strong>Ask</strong>.</p>
           <p>Examples: <code>Analyse "Tribute: Battle of the Bands"</code> · <code>track Variety</code> · <code>show trending drama</code></p>
           <p>Use preset chips below the bar for one-click queries.</p>
           <p><strong>KOL shortcuts:</strong> <code>track [name]</code>, <code>remove [name]</code>, <code>follow [name]</code></p>`
  }
};


/* ── 05. HOVER POPUP (rich tooltip) ─────────────────────────────────────── */

(function() {
  let _popup = null;

  function getPopup() {
    if (!_popup) {
      _popup = document.createElement('div');
      _popup.className = 'hover-popup';
      _popup.innerHTML = `
        <div class="hover-popup-media-wrap"></div>
        <div class="hover-popup-body">
          <div class="hover-popup-title"></div>
          <div class="hover-popup-desc"></div>
          <div class="hover-popup-meta"></div>
        </div>`;
      document.body.appendChild(_popup);
    }
    return _popup;
  }

  /**
   * Show hover popup near a target element.
   * @param {Element} target
   * @param {object} data – { title, desc, img, video, tags:[], meta:{} }
   */
  CALLI.showHoverPopup = function(target, data) {
    const pop = getPopup();
    const mediaWrap = pop.querySelector('.hover-popup-media-wrap');

    // Media
    mediaWrap.innerHTML = '';
    if (data.video) {
      mediaWrap.innerHTML = `<video class="hover-popup-video" src="${data.video}" autoplay loop muted playsinline></video>`;
    } else if (data.img) {
      mediaWrap.innerHTML = `<img class="hover-popup-media" src="${data.img}" alt="">`;
    }

    pop.querySelector('.hover-popup-title').textContent = data.title || '';
    pop.querySelector('.hover-popup-desc').textContent  = data.desc  || '';

    const metaEl = pop.querySelector('.hover-popup-meta');
    const tags = data.tags || [];
    metaEl.innerHTML = tags.map(t => `<span class="hover-popup-tag">${t}</span>`).join('');

    pop.classList.add('visible');

    const rect = target.getBoundingClientRect();
    const pw = 360;
    const ph = pop.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = rect.right + 10;
    let top  = rect.top;
    if (left + pw > vw - 8) left = rect.left - pw - 10;
    if (top  + ph > vh - 8) top  = vh - ph - 8;
    top  = Math.max(8, top);
    left = Math.max(8, left);

    pop.style.top  = top  + 'px';
    pop.style.left = left + 'px';
  };

  CALLI.hideHoverPopup = function() {
    if (_popup) _popup.classList.remove('visible');
  };

  /**
   * Wire hover popup to elements with data-hover-popup JSON attribute.
   * Usage: <div data-hover-popup='{"title":"...","desc":"...","tags":["a"]}'>
   */
  CALLI.initHoverPopups = function(root = document) {
    root.querySelectorAll('[data-hover-popup]').forEach(el => {
      if (el._calliHoverWired) return;
      el._calliHoverWired = true;
      el.addEventListener('mouseenter', () => {
        try {
          const data = JSON.parse(el.getAttribute('data-hover-popup'));
          CALLI.showHoverPopup(el, data);
        } catch (_) {}
      });
      el.addEventListener('mouseleave', CALLI.hideHoverPopup);
    });
  };
})();


/* ── 06. PANEL EXPAND / COLLAPSE ────────────────────────────────────────── */

/**
 * Toggle a panel between expanded (fixed fullscreen) and normal.
 * Expand btn should have data-panel="panelId".
 */
CALLI.togglePanel = function(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.classList.toggle('expanded');
  const btn = panel.querySelector('.panel-expand-btn');
  if (btn) btn.textContent = panel.classList.contains('expanded') ? '⤡' : '⤢';
};

CALLI.initPanelExpand = function(root = document) {
  root.querySelectorAll('.panel-expand-btn[data-panel]').forEach(btn => {
    if (btn._calliExpandWired) return;
    btn._calliExpandWired = true;
    btn.addEventListener('click', () => CALLI.togglePanel(btn.getAttribute('data-panel')));
  });
};


/* ── 07. CALLIOPE COMMAND BAR ────────────────────────────────────────────── */

/**
 * Base Calliope command bar.
 * Dashboard-specific logic is layered on top via CALLI.CALLIOPE_HANDLERS.
 *
 * Usage:
 *   CALLI.initCalliope({
 *     inputSel:    '#calliopeInput',
 *     btnSel:      '#calliopeBtn',
 *     feedbackSel: '#calliope-feedback',
 *     presetSel:   '.cmd-preset',
 *     onQuery:     async (input) => { ... }  // override to handle custom logic
 *   });
 */
CALLI.initCalliope = function({
  inputSel    = '#calliopeInput',
  btnSel      = '#calliopeBtn',
  feedbackSel = '.command-feedback',
  presetSel   = '.cmd-preset',
  onQuery     = null
} = {}) {
  const input    = document.querySelector(inputSel);
  const btn      = document.querySelector(btnSel);
  const feedback = document.querySelector(feedbackSel);

  if (!input) return;

  const showFeedback = (msg, duration = 3000) => {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.classList.add('visible');
    clearTimeout(feedback._tid);
    feedback._tid = setTimeout(() => feedback.classList.remove('visible'), duration);
  };

  const run = async () => {
    const val = input.value.trim();
    if (!val) return;

    // KOL intent detection (built-in)
    const kolIntent = CALLI.parseKolIntent(val);
    if (kolIntent) {
      try {
        if (kolIntent.action === 'add_kol') {
          await CALLI.fetchProxy('/api/kol/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: kolIntent.name, handle: '', type: 'outlet', topics: [] })
          });
          showFeedback(`✓ Now tracking ${kolIntent.name}`);
          document.dispatchEvent(new CustomEvent('calli:kol-updated'));
        } else if (kolIntent.action === 'remove_kol') {
          await CALLI.fetchProxy('/api/kol/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: kolIntent.name })
          });
          showFeedback(`✓ Removed ${kolIntent.name}`);
          document.dispatchEvent(new CustomEvent('calli:kol-updated'));
        }
        input.value = '';
        return;
      } catch (err) {
        showFeedback(`✗ ${err.message}`);
        return;
      }
    }

    // Delegate to dashboard handler
    if (onQuery) {
      try {
        showFeedback('⏳ Thinking…', 30000);
        await onQuery(val, showFeedback);
      } catch (err) {
        showFeedback(`✗ ${err.message}`);
      }
    } else {
      showFeedback(`Query: "${val}"`);
    }
  };

  input.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
  if (btn) btn.addEventListener('click', run);

  // Preset chips
  document.querySelectorAll(presetSel).forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.query || chip.textContent.trim();
      input.focus();
      run();
    });
  });
};

/**
 * Parse KOL-related intents from a command string.
 * Returns { action: 'add_kol'|'remove_kol', name } or null.
 */
CALLI.parseKolIntent = function(input) {
  const low = input.toLowerCase().trim();

  const addVerbs    = ['track ', 'follow ', 'add ', 'monitor ', 'watch '];
  const removeVerbs = ['untrack ', 'remove ', 'delete ', 'stop tracking ', 'unfollow '];

  for (const v of removeVerbs) {
    if (low.startsWith(v)) {
      const raw = input.slice(v.length)
        .replace(/\s+(as\s+)?(kol|outlet|source|blog|site)\.?$/i, '')
        .trim();
      if (raw.length >= 2) return { action: 'remove_kol', name: raw };
    }
  }
  for (const v of addVerbs) {
    if (low.startsWith(v)) {
      const raw = input.slice(v.length)
        .replace(/\s+(as\s+)?(kol|outlet|source|blog|site)\.?$/i, '')
        .trim();
      if (raw.length >= 2) return { action: 'add_kol', name: raw };
    }
  }
  return null;
};


/* ── 08. FORMAT UTILITIES ────────────────────────────────────────────────── */

/** Format a number with K/M suffix */
CALLI.fmtNum = function(n) {
  if (n == null || isNaN(n)) return '—';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toLocaleString();
};

/** Format a decimal as a percentage string */
CALLI.fmtPct = function(n, decimals = 1) {
  if (n == null || isNaN(n)) return '—';
  return (n * 100).toFixed(decimals) + '%';
};

/** "2 hours ago" style relative time */
CALLI.fmtAgo = function(dateStr) {
  if (!dateStr) return '';
  const d   = new Date(dateStr);
  const now = Date.now();
  const s   = Math.floor((now - d) / 1000);
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400)return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

/** Format published date string (from RSS) */
CALLI.fmtPubDate = function(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (_) { return dateStr; }
};

/** Format ISO timestamp as compact local time */
CALLI.fmtTime = function(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch (_) { return ''; }
};

/** Round to N decimal places */
CALLI.round = function(n, dp = 2) {
  return Math.round(n * Math.pow(10, dp)) / Math.pow(10, dp);
};

/** Clamp a value between min and max */
CALLI.clamp = function(n, min, max) {
  return Math.max(min, Math.min(max, n));
};

/** Strip HTML tags from a string */
CALLI.stripHtml = function(str) {
  const d = document.createElement('div');
  d.innerHTML = str;
  return d.textContent || '';
};


/* ── 09. MATH TOOLTIP SYSTEM ─────────────────────────────────────────────── */

/**
 * Math tooltips — show formula/explanation for .math-tooltip spans.
 * Add data-math="key" to any element; define CALLI.MATH_CONTENT[key].
 */
CALLI.MATH_CONTENT = {
  pearson_r: {
    title: 'Pearson Correlation (r)',
    formula: 'r = Σ[(xᵢ−x̄)(yᵢ−ȳ)] / √[Σ(xᵢ−x̄)² · Σ(yᵢ−ȳ)²]',
    desc: 'Measures linear association between two variables. Range: −1 to +1. |r| > 0.5 is considered moderate.'
  },
  shap: {
    title: 'SHAP Value',
    formula: 'φᵢ = Σ [|S|!(p−|S|−1)!/p!] · [f(S∪{i}) − f(S)]',
    desc: 'Shapley Additive exPlanations — how much each feature contributed to a specific prediction vs. baseline.'
  },
  momentum_score: {
    title: 'Cross-Platform Momentum',
    formula: 'score × (1 + crossPlatformCount × 0.6)',
    desc: 'Base social score boosted by presence across multiple platforms (Twitter, Reddit, Trends, News, KOLs).'
  },
  lasso: {
    title: 'LASSO Coefficient',
    formula: 'min{½n Σ(yᵢ − β·xᵢ)² + λΣ|βⱼ|}',
    desc: 'L1-regularised linear regression that drives less important feature coefficients to exactly zero, performing implicit feature selection.'
  }
};

CALLI.initMathTooltips = function(root = document) {
  const pop = document.createElement('div');
  pop.className = 'hover-popup anim-fadein';
  pop.style.cssText = 'width:320px;pointer-events:none;';
  pop.innerHTML = `
    <div class="hover-popup-body" style="padding:12px 14px">
      <div class="hover-popup-title" style="margin-bottom:6px"></div>
      <div style="font-size:12px;color:var(--teal);font-family:monospace;margin-bottom:6px;padding:5px 8px;background:var(--surface3);border-radius:5px"></div>
      <div class="hover-popup-desc"></div>
    </div>`;
  document.body.appendChild(pop);

  root.querySelectorAll('[data-math]').forEach(el => {
    if (el._calliMathWired) return;
    el._calliMathWired = true;
    el.addEventListener('mouseenter', () => {
      const key     = el.getAttribute('data-math');
      const content = (CALLI.MATH_CONTENT || {})[key];
      if (!content) return;
      pop.querySelector('.hover-popup-title').textContent = content.title || key;
      pop.querySelectorAll('div')[1].textContent = content.formula || '';
      pop.querySelector('.hover-popup-desc').textContent = content.desc || '';
      pop.classList.add('visible');
      const rect = el.getBoundingClientRect();
      let top  = rect.bottom + 8;
      let left = rect.left;
      const pw = 320;
      const ph = pop.offsetHeight;
      if (top  + ph > window.innerHeight - 8) top  = rect.top  - ph - 8;
      if (left + pw > window.innerWidth  - 8) left = window.innerWidth - pw - 8;
      pop.style.top  = Math.max(8, top)  + 'px';
      pop.style.left = Math.max(8, left) + 'px';
    });
    el.addEventListener('mouseleave', () => pop.classList.remove('visible'));
  });
};


/* ── 10. MODAL HELPERS ───────────────────────────────────────────────────── */

CALLI.openModal = function(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.classList.add('visible');
};

CALLI.closeModal = function(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.classList.remove('visible');
};

/** Auto-wire .modal-close and overlay-click-to-close for all modals */
CALLI.initModals = function(root = document) {
  root.querySelectorAll('.modal-overlay').forEach(overlay => {
    if (overlay._calliModalWired) return;
    overlay._calliModalWired = true;

    overlay.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => overlay.classList.remove('visible'));
    });
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('visible');
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.visible').forEach(m => m.classList.remove('visible'));
    }
  });
};


/* ── 11. SCROLL / UI UTILITIES ───────────────────────────────────────────── */

/** Scroll element into view smoothly */
CALLI.scrollTo = function(el) {
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

/** Create a loading skeleton row */
CALLI.skeletonRows = function(count = 4, height = 40) {
  return Array.from({ length: count }, () =>
    `<div class="cs-skeleton" style="height:${height}px;margin-bottom:6px;border-radius:6px"></div>`
  ).join('');
};

/** Render an error state into a container */
CALLI.renderError = function(container, msg = 'Failed to load data') {
  container.innerHTML = `<div class="cs-error"><span class="cs-error-icon">⚠</span>${msg}</div>`;
};

/** Render a loading state into a container */
CALLI.renderLoading = function(container, msg = 'Loading…') {
  container.innerHTML = `<div class="cs-loading"><div class="cs-spinner"></div>${msg}</div>`;
};

/** Render an empty state into a container */
CALLI.renderEmpty = function(container, icon = '🔍', msg = 'No data') {
  container.innerHTML = `<div class="cs-empty"><span class="cs-empty-icon">${icon}</span>${msg}</div>`;
};

/** Simple debounce */
CALLI.debounce = function(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

/** Simple throttle */
CALLI.throttle = function(fn, limit = 200) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) { last = now; fn(...args); }
  };
};


/* ── 12. DATASET SWITCHER ────────────────────────────────────────────────── */

/**
 * Wire the nav dataset select to reload pages in the same collection.
 * Expects: <select class="nav-data-select" id="navDataSelect">
 */
CALLI.initDatasetSwitcher = function(onChange = null) {
  const sel = document.getElementById('navDataSelect');
  if (!sel) return;
  sel.addEventListener('change', () => {
    if (onChange) {
      onChange(sel.value);
    } else {
      // Default: reload page with ?dataset= query param
      const url = new URL(location.href);
      url.searchParams.set('dataset', sel.value);
      location.href = url.toString();
    }
  });
};


/* ── 14. GLOBAL SETTINGS PANEL ──────────────────────────────────────────── */

/**
 * Shared settings panel — injected once into <body>.
 * All dashboards call CALLI.toggleSettings() from their gear button.
 * On egavves.github.io the key inputs are replaced with proxy notices.
 */

CALLI._settingsInjected = false;

CALLI._injectSettingsPanel = function() {
  if (CALLI._settingsInjected || document.getElementById('calli-settings-panel')) {
    CALLI._settingsInjected = true;
    return;
  }
  CALLI._settingsInjected = true;

  const isProd = location.hostname === 'egavves.github.io';

  const anthropicHTML = isProd
    ? `<div class="settings-label" style="color:var(--positive)">✓ Anthropic API</div>
       <div class="settings-note">Routed via secure proxy — no key needed.</div>
       <div class="settings-status" id="calli-anthropic-status"></div>`
    : `<div class="settings-label">Anthropic API Key</div>
       <div class="settings-row">
         <input class="api-key-input" id="calli-anthropic-key" type="password" placeholder="sk-ant-api03-…">
         <button class="api-save-btn" onclick="CALLI.saveAnthropicKey()">Save</button>
         <button class="api-save-btn" onclick="CALLI.clearAnthropicKey()" style="color:var(--negative)">Clear</button>
       </div>
       <div class="settings-status" id="calli-anthropic-status"></div>
       <div class="settings-note" style="margin-top:5px">
         Stored only in your browser's localStorage.<br>
         Sent only to <code>api.anthropic.com</code>. Never logged.
       </div>`;

  const falHTML = isProd
    ? `<div class="settings-label" style="color:var(--positive)">✓ fal.ai Image Generation</div>
       <div class="settings-note">Routed via secure proxy — no key needed.</div>
       <div class="settings-status" id="calli-fal-status"></div>`
    : `<div class="settings-label">fal.ai API Key</div>
       <div class="settings-row">
         <input class="api-key-input" id="calli-fal-key" type="password" placeholder="fal_…">
         <button class="api-save-btn" onclick="CALLI.saveFalKey()">Save</button>
         <button class="api-save-btn" onclick="CALLI.clearFalKey()" style="color:var(--negative)">Clear</button>
       </div>
       <div class="settings-status" id="calli-fal-status"></div>
       <div class="settings-note" style="margin-top:3px">For image generation in Ideation Studio.</div>`;

  const panel = document.createElement('div');
  panel.className = 'settings-panel';
  panel.id = 'calli-settings-panel';
  panel.innerHTML =
    `<div class="settings-panel-title">` +
      `⚙&#xFE0E; Settings` +
      `<button class="settings-close" onclick="CALLI.closeSettings()">✕</button>` +
    `</div>` +
    `<hr class="settings-divider">` +
    `<div id="calli-anthropic-section">${anthropicHTML}</div>` +
    `<hr class="settings-divider">` +
    `<div id="calli-fal-section">${falHTML}</div>`;

  document.body.appendChild(panel);

  // Pre-fill with any previously saved keys
  if (!isProd) {
    const savedAnth = localStorage.getItem('anthropic_api_key') || localStorage.getItem('anthropicKey') || '';
    const savedFal  = localStorage.getItem('fal_api_key')       || localStorage.getItem('falKey')       || '';
    const ainp = document.getElementById('calli-anthropic-key');
    const finp = document.getElementById('calli-fal-key');
    if (ainp && savedAnth) ainp.value = savedAnth;
    if (finp && savedFal)  finp.value = savedFal;
  }
};

CALLI.openSettings = function() {
  CALLI._injectSettingsPanel();
  const panel = document.getElementById('calli-settings-panel');
  const btn   = document.getElementById('gear-btn');
  if (!panel) return;
  panel.classList.add('open');
  if (btn) btn.classList.add('active');
  setTimeout(() => document.addEventListener('click', CALLI._outsideSettingsClick), 10);
};

CALLI.closeSettings = function() {
  const panel = document.getElementById('calli-settings-panel');
  const btn   = document.getElementById('gear-btn');
  if (panel) panel.classList.remove('open');
  if (btn)   btn.classList.remove('active');
  document.removeEventListener('click', CALLI._outsideSettingsClick);
};

CALLI.toggleSettings = function() {
  CALLI._injectSettingsPanel();
  const panel = document.getElementById('calli-settings-panel');
  if (!panel) return;
  if (panel.classList.contains('open')) {
    CALLI.closeSettings();
  } else {
    CALLI.openSettings();
  }
};

CALLI._outsideSettingsClick = function(e) {
  const panel = document.getElementById('calli-settings-panel');
  const btn   = document.getElementById('gear-btn');
  if (panel && panel.contains(e.target)) return;
  if (btn   && btn.contains(e.target))   return;
  CALLI.closeSettings();
};

CALLI._setSettingsStatus = function(elId, msg, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.className = 'settings-status ' + (type || '');
  setTimeout(() => { if (el) { el.textContent = ''; el.className = 'settings-status'; } }, 3000);
};

CALLI.saveAnthropicKey = function() {
  const inp = document.getElementById('calli-anthropic-key');
  const key = inp ? inp.value.trim() : '';
  if (!key) { CALLI._setSettingsStatus('calli-anthropic-status', 'Please enter an API key.', 'err'); return; }
  localStorage.setItem('anthropic_api_key', key);
  localStorage.setItem('anthropicKey', key);  // legacy alias
  CALLI._setSettingsStatus('calli-anthropic-status', '✓ Anthropic key saved.', 'ok');
};

CALLI.clearAnthropicKey = function() {
  localStorage.removeItem('anthropic_api_key');
  localStorage.removeItem('anthropicKey');
  const inp = document.getElementById('calli-anthropic-key');
  if (inp) inp.value = '';
  CALLI._setSettingsStatus('calli-anthropic-status', 'Key cleared.', '');
};

CALLI.saveFalKey = function() {
  const inp = document.getElementById('calli-fal-key');
  const key = inp ? inp.value.trim() : '';
  if (!key) { CALLI._setSettingsStatus('calli-fal-status', 'Please enter a fal.ai key.', 'err'); return; }
  localStorage.setItem('fal_api_key', key);
  localStorage.setItem('falKey', key);  // legacy alias
  CALLI._setSettingsStatus('calli-fal-status', '✓ fal.ai key saved.', 'ok');
};

CALLI.clearFalKey = function() {
  localStorage.removeItem('fal_api_key');
  localStorage.removeItem('falKey');
  const inp = document.getElementById('calli-fal-key');
  if (inp) inp.value = '';
  CALLI._setSettingsStatus('calli-fal-status', 'Key cleared.', '');
};

CALLI.initSettings = function() {
  // Pre-inject on DOMContentLoaded so the panel is ready before first use
  CALLI._injectSettingsPanel();
};


/* ── AUTO-INIT ───────────────────────────────────────────────────────────── */

/**
 * CALLI.init() — call once per page after DOM is ready.
 * Runs all initialisation that is safe to run globally.
 */
CALLI.init = function(options = {}) {
  CALLI.initNav();
  CALLI.initInfoButtons();
  CALLI.initHoverPopups();
  CALLI.initPanelExpand();
  CALLI.initModals();
  CALLI.initMathTooltips();
  CALLI.initSettings();
  if (options.proxyBadge !== false) CALLI.checkProxy();
  if (options.datasetSwitcher) CALLI.initDatasetSwitcher(options.onDatasetChange);
};

// Auto-init on DOMContentLoaded unless data-calli-manual is set on <html>
if (!document.documentElement.hasAttribute('data-calli-manual')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CALLI.init());
  } else {
    CALLI.init();
  }
}


/* ── 13. PROJECT DROPDOWN ───────────────────────────────────────────────── */

/**
 * Toggle the "Open project" custom dropdown in the nav.
 * Called by the nav-proj-btn button's onclick.
 */
function navProjToggle() {
  const btn  = document.getElementById('nav-proj-dd')  && document.querySelector('.nav-proj-btn');
  const menu = document.getElementById('nav-proj-menu');
  if (!menu || !btn) return;
  const opening = !menu.classList.contains('open');
  menu.classList.toggle('open', opening);
  btn.classList.toggle('open', opening);
  if (opening) {
    // Close on any outside click
    setTimeout(() => {
      document.addEventListener('click', _navProjOutside, { once: true });
    }, 0);
  }
}

function _navProjOutside(e) {
  const dd = document.getElementById('nav-proj-dd');
  if (dd && dd.contains(e.target)) {
    // click was inside — re-attach listener
    setTimeout(() => {
      document.addEventListener('click', _navProjOutside, { once: true });
    }, 0);
    return;
  }
  const menu = document.getElementById('nav-proj-menu');
  const btn  = document.querySelector('.nav-proj-btn');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
}

/**
 * Add a new project to the Open-project dropdown.
 * Prompts the user to ask Claude to generate the full dashboard set.
 */
function addDataSource() {
  const msg = [
    '🎸 New Project Wizard',
    '',
    'To add a new project with a full set of dashboards, open a Cowork session with Claude and say:',
    '',
    '  "Add a new project called [project name]"',
    '',
    'Claude will ask you a few questions and generate:',
    '  • Home dashboard',
    '  • Social Pulse dashboard',
    '  • Ideation Studio',
    '  • Executive Summary (placeholder)',
    '  • Hypothesis Validation (placeholder)',
    '',
    'It will also update the project dropdown in all existing dashboards automatically.',
    '',
    'See NEW_PROJECT_SKILL.md in your workspace for full details.'
  ].join('\n');
  alert(msg);
}
