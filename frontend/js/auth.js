document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const blockedDomains = new Set([
    'example.com',
    'example.org',
    'example.net',
    'test.com',
    'fake.com',
    'mailinator.com',
    'guerrillamail.com',
    'tempmail.com',
    'yopmail.com',
    '10minutemail.com',
    'sharklasers.com'
  ]);

  if (getToken() && (signupForm || loginForm)) {
    location.href = '/dashboard.html';
    return;
  }

  signupForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = signupForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const formData = new FormData(signupForm);
      const payload = Object.fromEntries(formData.entries());
      const normalizedEmail = payload.email?.toLowerCase().trim() || '';

      if (!isRealisticEmail(normalizedEmail, blockedDomains)) {
        throw new Error('Please enter a real email address. Temporary and fake emails are not allowed.');
      }

      payload.email = normalizedEmail;
      const result = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setToken(result.token);
      setCurrentUser(result.user);
      location.href = '/dashboard.html';
    } catch (error) {
      showMessage('signupMessage', error.message);
    } finally {
      submitButton.disabled = false;
    }
  });

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const formData = new FormData(loginForm);
      const payload = Object.fromEntries(formData.entries());
      const result = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setToken(result.token);
      setCurrentUser(result.user);
      location.href = '/dashboard.html';
    } catch (error) {
      showMessage('loginMessage', error.message);
    } finally {
      submitButton.disabled = false;
    }
  });
});

function isRealisticEmail(email, blockedDomains) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;

  const [, domain = ''] = email.split('@');

  if (!domain || blockedDomains.has(domain)) return false;
  if (email.includes('..')) return false;
  if (email.startsWith('.') || email.endsWith('.')) return false;
  if (domain.startsWith('-') || domain.endsWith('-')) return false;
  if (!/^[a-z0-9.-]+$/.test(domain)) return false;

  return true;
}
