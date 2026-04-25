document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

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
