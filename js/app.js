/* ==========================================================================
   Your Wedding Planner — Shared app logic
   Prototype-stage: all data lives in localStorage (no backend yet).
   Structure is written so swapping to a real API later is a small change —
   every read/write goes through WeddingApp.state.
   ========================================================================== */

const WeddingApp = (() => {
  const STORAGE_KEY = 'ywp_state_v1';

  const defaultState = {
    account: null, // { name, email }
    onboarding: {
      complete: false,
      step: 0,
      answers: {}
    },
    weddingDate: '',
    location: { area: '', radius: '' },
    style: { theme: '' },
    tasks: [],
    budget: { total: 0, spent: 0 },
    guests: { day: 0, evening: 0 },
    guestList: [],
    suppliers: [],
    documents: []
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      return { ...structuredClone(defaultState), ...JSON.parse(raw) };
    } catch (e) {
      return structuredClone(defaultState);
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getState() {
    return load();
  }

  function updateState(updater) {
    const state = load();
    const next = updater(state) || state;
    save(next);
    return next;
  }

  function requireAccount(redirectTo = 'index.html') {
    const state = load();
    if (!state.account) {
      window.location.href = redirectTo;
    }
    return state;
  }

  function requireOnboarding(redirectTo = 'onboarding.html') {
    const state = load();
    if (!state.onboarding.complete) {
      window.location.href = redirectTo;
    }
    return state;
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function formatCurrency(n) {
    return '£' + Number(n).toLocaleString('en-GB');
  }

  const NAV_ITEMS = [
    { key: 'dashboard', page: 'dashboard.html', icon: '🏠', label: 'Home' },
    { key: 'budget', page: 'budget.html', icon: '💰', label: 'Budget' },
    { key: 'guests', page: 'guests.html', icon: '👥', label: 'Guests' },
    { key: 'suppliers', page: 'suppliers.html', icon: '📋', label: 'Suppliers' },
    { key: 'documents', page: 'documents.html', icon: '📁', label: 'Docs' }
  ];

  function renderBottomNav(activeKey) {
    const nav = document.createElement('div');
    nav.className = 'bottom-nav';
    NAV_ITEMS.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = 'nav-item' + (item.key === activeKey ? ' active' : '');
      btn.onclick = () => { window.location.href = item.page; };
      btn.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${item.label}</span>`;
      nav.appendChild(btn);
    });
    document.querySelector('.app-shell').appendChild(nav);
  }

  return {
    STORAGE_KEY,
    getState,
    updateState,
    requireAccount,
    requireOnboarding,
    daysUntil,
    formatCurrency,
    renderBottomNav
  };
})();

// Register service worker for installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      /* prototype: fail silently if not served over http */
    });
  });
}
