/**
 * Calli Chat Widget
 * Drop-in chatbot for Calli Labs dashboards.
 *
 * Usage:
 *   <script src="calli-chat.js"></script>
 *   <script>
 *     CalliChat.init({
 *       dashboard: 'cut',           // 'cut' | 'cinematheque' | 'vault' | 'index'
 *       getContext: () => ({ ... }) // returns current dashboard state
 *     });
 *   </script>
 */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────
  // Replace with your deployed Cloudflare Worker URL
  const WORKER_URL = 'https://calli-chat.callilabs.workers.dev';

  // ── State ───────────────────────────────────────────────────
  let messages = [];
  let isOpen = false;
  let isStreaming = false;
  let getContextFn = () => ({});
  let dashboardId = 'index';

  // ── Mount ────────────────────────────────────────────────────
  function init({ dashboard = 'index', getContext = () => ({}) } = {}) {
    dashboardId = dashboard;
    getContextFn = getContext;
    injectStyles();
    mountWidget();
  }

  // ── DOM ──────────────────────────────────────────────────────
  function mountWidget() {
    const wrap = document.createElement('div');
    wrap.id = 'calli-chat-root';
    wrap.innerHTML = `
      <!-- Toggle button -->
      <button id="cc-toggle" aria-label="Open Calli assistant" title="Ask Calli">
        <span id="cc-toggle-icon">✦</span>
        <span id="cc-toggle-label">Ask Calli</span>
      </button>

      <!-- Chat panel -->
      <div id="cc-panel" role="dialog" aria-label="Calli assistant" hidden>
        <div id="cc-header">
          <div id="cc-header-left">
            <span id="cc-header-icon">✦</span>
            <div>
              <div id="cc-header-title">Calli</div>
              <div id="cc-header-sub">Creative intelligence assistant</div>
            </div>
          </div>
          <div id="cc-header-actions">
            <button id="cc-clear" title="Clear conversation">↺</button>
            <button id="cc-close" title="Close">✕</button>
          </div>
        </div>

        <div id="cc-messages"></div>

        <div id="cc-input-row">
          <textarea
            id="cc-input"
            placeholder="Ask about this dashboard…"
            rows="1"
            autocomplete="off"
          ></textarea>
          <button id="cc-send" title="Send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;
    // Append to <html> not <body> — escapes overflow:hidden on body/html
    // which is common in full-viewport dashboard layouts and clips fixed elements
    document.documentElement.appendChild(wrap);

    // Wire up events
    document.getElementById('cc-toggle').addEventListener('click', togglePanel);
    document.getElementById('cc-close').addEventListener('click', closePanel);
    document.getElementById('cc-clear').addEventListener('click', clearConversation);
    document.getElementById('cc-send').addEventListener('click', sendMessage);
    document.getElementById('cc-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    document.getElementById('cc-input').addEventListener('input', autoResize);
  }

  function togglePanel() {
    isOpen ? closePanel() : openPanel();
  }

  function openPanel() {
    isOpen = true;
    const panel = document.getElementById('cc-panel');
    const btn   = document.getElementById('cc-toggle');
    panel.hidden = false;
    panel.classList.add('cc-open');
    btn.classList.add('cc-active');
    document.getElementById('cc-toggle-icon').textContent = '✕';
    document.getElementById('cc-toggle-label').textContent = 'Close';

    // Send a greeting on first open
    if (messages.length === 0) {
      addGreeting();
    }
    setTimeout(() => document.getElementById('cc-input').focus(), 100);
  }

  function closePanel() {
    isOpen = false;
    const panel = document.getElementById('cc-panel');
    const btn   = document.getElementById('cc-toggle');
    panel.classList.remove('cc-open');
    btn.classList.remove('cc-active');
    document.getElementById('cc-toggle-icon').textContent = '✦';
    document.getElementById('cc-toggle-label').textContent = 'Ask Calli';
    setTimeout(() => { panel.hidden = true; }, 280);
  }

  function clearConversation() {
    messages = [];
    document.getElementById('cc-messages').innerHTML = '';
    addGreeting();
  }

  // ── Greeting ──────────────────────────────────────────────────
  function addGreeting() {
    const greetings = {
      cut: "I can see you're in the **CUT Channel Dashboard** — 482 videos with 22 caption and sentiment features. Click any feature in the sidebar to select it, then ask me what the correlations mean or what's driving patterns in the data.",
      cinematheque: "You're in the **Cinematheque Explorer** — feature distributions across the movie collection. Select a feature on the left to see its histogram and scatter plot, then ask me anything about what the signal measures or how genres compare.",
      vault: "You're in the **Feature Vault** — the full taxonomy of 170+ signals Calli Labs can extract. Ask me what any feature means, how it's computed, or which signals tend to be most predictive for different content types.",
      index: "Welcome to **Calli Labs Intelligence**. I can walk you through any of the dashboards — the CUT channel analytics, the Cinematheque movie data, or the Feature Vault taxonomy. What would you like to explore?",
    };
    const text = greetings[dashboardId] || greetings.index;
    appendMessage('assistant', text);
  }

  // ── Send ──────────────────────────────────────────────────────
  async function sendMessage() {
    if (isStreaming) return;
    const input = document.getElementById('cc-input');
    const text  = input.value.trim();
    if (!text) return;

    input.value = '';
    autoResize.call(input);

    // Add user message to thread
    messages.push({ role: 'user', content: text });
    appendMessage('user', text);

    // Stream reply
    await streamReply();
  }

  async function streamReply() {
    isStreaming = true;
    setSendState(false);

    const msgEl = appendMessage('assistant', '');
    const textEl = msgEl.querySelector('.cc-msg-text');
    let fullText = '';

    try {
      const context = getContextFn();
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          systemContext: { dashboard: dashboardId, ...context },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const evt = JSON.parse(data);
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
              fullText += evt.delta.text;
              textEl.innerHTML = renderMarkdown(fullText);
              scrollToBottom();
            }
          } catch { /* skip malformed chunks */ }
        }
      }

    } catch (err) {
      textEl.innerHTML = `<span style="color:#f87171">Error: ${err.message}. Check that the Cloudflare Worker is deployed and your API key is set.</span>`;
    }

    // Save to history
    if (fullText) {
      messages.push({ role: 'assistant', content: fullText });
    }

    isStreaming = false;
    setSendState(true);
    scrollToBottom();
  }

  // ── UI helpers ────────────────────────────────────────────────
  function appendMessage(role, text) {
    const container = document.getElementById('cc-messages');
    const el = document.createElement('div');
    el.className = `cc-msg cc-msg-${role}`;
    el.innerHTML = `
      <div class="cc-msg-avatar">${role === 'assistant' ? '✦' : '↑'}</div>
      <div class="cc-msg-text">${renderMarkdown(text)}</div>
    `;
    container.appendChild(el);
    scrollToBottom();
    return el;
  }

  function scrollToBottom() {
    const el = document.getElementById('cc-messages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function setSendState(enabled) {
    const btn = document.getElementById('cc-send');
    if (btn) {
      btn.disabled = !enabled;
      btn.style.opacity = enabled ? '1' : '0.4';
    }
  }

  function autoResize() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  }

  // ── Minimal markdown ──────────────────────────────────────────
  function renderMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  // ── Styles ────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('cc-styles')) return;
    const s = document.createElement('style');
    s.id = 'cc-styles';
    s.textContent = `
      #calli-chat-root { position: fixed; bottom: 24px; right: 24px; z-index: 2147483647; font-family: 'Segoe UI', system-ui, sans-serif; }

      /* ── Toggle button ── */
      #cc-toggle {
        display: flex; align-items: center; gap: 8px;
        background: #1a1d2e; border: 1px solid #3b3f6e;
        color: #c4b5fd; border-radius: 28px;
        padding: 10px 18px; font-size: 13px; font-weight: 600;
        cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        transition: background 0.18s, border-color 0.18s, transform 0.18s;
      }
      #cc-toggle:hover { background: #232638; border-color: #7c6af7; transform: translateY(-1px); }
      #cc-toggle.cc-active { background: #232638; border-color: #7c6af7; color: #e2e4f0; }
      #cc-toggle-icon { font-size: 16px; }
      #cc-toggle-label { letter-spacing: 0.01em; }

      /* ── Panel ── */
      #cc-panel {
        position: fixed; bottom: 80px; right: 24px;
        width: 380px; max-width: calc(100vw - 48px);
        height: 520px; max-height: calc(100vh - 120px);
        background: #0f1117; border: 1px solid #2d3155;
        border-radius: 16px; box-shadow: 0 24px 64px rgba(0,0,0,0.7);
        display: flex; flex-direction: column; overflow: hidden;
        opacity: 0; transform: translateY(12px) scale(0.97);
        transition: opacity 0.25s ease, transform 0.25s ease;
        pointer-events: none;
      }
      #cc-panel[hidden] { display: none !important; }
      #cc-panel.cc-open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

      /* ── Header ── */
      #cc-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 16px; background: #1a1d2e;
        border-bottom: 1px solid #2d3155; flex-shrink: 0;
      }
      #cc-header-left { display: flex; align-items: center; gap: 10px; }
      #cc-header-icon { font-size: 20px; color: #7c6af7; }
      #cc-header-title { font-size: 14px; font-weight: 700; color: #e2e4f0; }
      #cc-header-sub { font-size: 11px; color: #7a7f9a; margin-top: 1px; }
      #cc-header-actions { display: flex; gap: 6px; }
      #cc-clear, #cc-close {
        background: none; border: none; color: #7a7f9a;
        font-size: 14px; cursor: pointer; padding: 4px 6px;
        border-radius: 6px; transition: color 0.15s, background 0.15s;
        line-height: 1;
      }
      #cc-clear:hover, #cc-close:hover { color: #e2e4f0; background: #232638; }

      /* ── Messages ── */
      #cc-messages {
        flex: 1; overflow-y: auto; padding: 16px;
        display: flex; flex-direction: column; gap: 14px;
        scroll-behavior: smooth;
      }
      #cc-messages::-webkit-scrollbar { width: 4px; }
      #cc-messages::-webkit-scrollbar-track { background: transparent; }
      #cc-messages::-webkit-scrollbar-thumb { background: #2d3155; border-radius: 2px; }

      /* ── Message bubbles ── */
      .cc-msg { display: flex; gap: 10px; align-items: flex-start; }
      .cc-msg-user { flex-direction: row-reverse; }
      .cc-msg-avatar {
        width: 26px; height: 26px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; flex-shrink: 0; margin-top: 2px;
      }
      .cc-msg-assistant .cc-msg-avatar { background: rgba(124,106,247,0.15); color: #7c6af7; }
      .cc-msg-user .cc-msg-avatar { background: rgba(96,165,250,0.12); color: #60a5fa; font-size: 10px; }
      .cc-msg-text {
        font-size: 13px; line-height: 1.6; color: #e2e4f0;
        max-width: calc(100% - 40px);
      }
      .cc-msg-user .cc-msg-text {
        background: #1a1d2e; border: 1px solid #2d3155;
        border-radius: 12px 12px 4px 12px; padding: 8px 12px;
        color: #c4d8f0;
      }
      .cc-msg-assistant .cc-msg-text { padding: 2px 0; }
      .cc-msg-text strong { color: #c4b5fd; }
      .cc-msg-text em { color: #7a7f9a; }
      .cc-msg-text code {
        background: #1a1d2e; border: 1px solid #2d3155;
        padding: 1px 5px; border-radius: 4px; font-size: 12px; color: #34d399;
      }

      /* ── Input ── */
      #cc-input-row {
        display: flex; align-items: flex-end; gap: 8px;
        padding: 12px 14px; background: #1a1d2e;
        border-top: 1px solid #2d3155; flex-shrink: 0;
      }
      #cc-input {
        flex: 1; background: #0f1117; border: 1px solid #2d3155;
        color: #e2e4f0; border-radius: 10px; padding: 8px 12px;
        font-size: 13px; font-family: inherit; resize: none;
        line-height: 1.5; outline: none;
        transition: border-color 0.15s;
      }
      #cc-input:focus { border-color: #7c6af7; }
      #cc-input::placeholder { color: #4a5068; }
      #cc-send {
        width: 34px; height: 34px; border-radius: 10px;
        background: #7c6af7; border: none; color: #fff;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: background 0.15s;
      }
      #cc-send:hover { background: #9180f9; }

      /* ── Mobile ── */
      @media (max-width: 480px) {
        #cc-panel { bottom: 0; right: 0; width: 100vw; max-width: 100vw; height: 80vh; max-height: 80vh; border-radius: 16px 16px 0 0; }
        #cc-toggle { bottom: 16px; right: 16px; }
      }
    `;
    document.head.appendChild(s);
  }

  // ── Public API ─────────────────────────────────────────────────
  window.CalliChat = { init };
})();
