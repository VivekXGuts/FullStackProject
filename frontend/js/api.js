const API_BASE = '/api';
const TOKEN_KEY = 'fitquest_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
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

wireLogoutButtons();
