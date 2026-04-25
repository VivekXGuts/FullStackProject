const configuredApiBase = window.FITQUEST_CONFIG?.API_BASE_URL?.trim();
const API_BASE = configuredApiBase || 'https://full-stack-project-xi-amber.vercel.app/api';
const TOKEN_KEY = 'fitquest_token';
const USER_KEY = 'fitquest_user';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
      if (!location.pathname.endsWith('/login.html') && !location.pathname.endsWith('/signup.html')) {
        location.href = '/login.html';
      }
    }
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
}

function requireAuth() {
  if (!getToken()) {
    location.href = '/login.html';
  }
}

function logout() {
  clearToken();
  location.href = '/index.html';
}

function wireLogoutButtons() {
  document.querySelectorAll('[data-logout]').forEach((button) => {
    button.addEventListener('click', logout);
  });
}

function showMessage(targetId, message, type = 'error') {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.textContent = message;
  target.className = `form-message ${type}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
}

function badgeMarkup(badges = []) {
  return badges.map((badge) => `<span class="badge">${badge}</span>`).join('');
}

function progressBar(percent) {
  const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
  return `<div class="progress"><span style="width:${safePercent}%"></span></div>`;
}

function getApiOrigin() {
  return API_BASE.replace(/\/api$/, '');
}

async function ensureSocketClient() {
  if (window.io) return window.io;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${getApiOrigin()}/socket.io/socket.io.js`;
    script.onload = () => resolve(window.io);
    script.onerror = () => reject(new Error('Realtime client could not be loaded.'));
    document.head.appendChild(script);
  });
}

// Closure demo: the returned function keeps access to the socket callbacks.
function createRealtimeChannel(handlers = {}) {
  return async function connect() {
    try {
      const socketFactory = await ensureSocketClient();
      const socket = socketFactory(getApiOrigin(), { transports: ['websocket', 'polling'] });

      Object.entries(handlers).forEach(([eventName, handler]) => {
        socket.on(eventName, handler);
      });

      return socket;
    } catch (_error) {
      return null;
    }
  };
}

function renderAdminLinks(user = getCurrentUser()) {
  document.querySelectorAll('[data-admin-link]').forEach((link) => {
    link.hidden = !user || user.role !== 'admin';
  });
}

wireLogoutButtons();
renderAdminLinks();
