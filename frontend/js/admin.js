requireAuth();

let currentUserPage = 1;
let currentChallengePage = 1;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { user } = await apiFetch('/tracking/summary');
    setCurrentUser(user);
    renderAdminLinks(user);

    if (user.role !== 'admin') {
      location.href = '/dashboard.html';
      return;
    }

    await Promise.all([loadOverview(), loadUsers(), loadChallenges()]);
    wireChallengeForm();

    const connectRealtime = createRealtimeChannel({
      'challenge:created': (payload) => {
        showMessage(
          'adminMessage',
          `New live challenge published: ${payload.title} (${payload.points} pts).`,
          'success'
        );
        loadChallenges();
      },
      'leaderboard:update': ({ leaderboard }) => {
        renderTopPerformer(leaderboard[0]);
      }
    });

    await connectRealtime();
  } catch (error) {
    showMessage('adminMessage', error.message);
  }
});

async function loadOverview() {
  const { metrics, leaderboard } = await apiFetch('/admin/overview');
  document.getElementById('adminMetrics').innerHTML = `
    <article class="stat-card"><span>Total users</span><strong>${metrics.totalUsers}</strong></article>
    <article class="stat-card"><span>Active challenges</span><strong>${metrics.activeChallenges}</strong></article>
    <article class="stat-card"><span>Total points</span><strong>${metrics.totalPoints}</strong></article>
    <article class="stat-card"><span>Average streak</span><strong>${metrics.averageStreak}</strong></article>
  `;
  renderTopPerformer(leaderboard[0]);
}

function renderTopPerformer(entry) {
  const target = document.getElementById('topPerformer');
  target.textContent = entry
    ? `${entry.username} leads the board with ${entry.points} points and a ${entry.streak}-day streak.`
    : 'No leaderboard data yet.';
}

async function loadUsers(page = currentUserPage) {
  currentUserPage = page;
  const { items, pagination } = await apiFetch(`/admin/users?page=${page}&limit=6`);
  const container = document.getElementById('adminUsers');
  container.innerHTML = items
    .map(
      (user) => `
        <article class="timeline-item">
          <div>
            <strong>${user.username}</strong>
            <span>${user.email} • ${user.role} • ${user.points} pts</span>
          </div>
          <button class="btn secondary" data-role-toggle="${user.id}" data-role="${user.role}">
            Make ${user.role === 'admin' ? 'User' : 'Admin'}
          </button>
        </article>
      `
    )
    .join('');

  document.getElementById('userPageLabel').textContent = `${pagination.page}/${pagination.totalPages}`;

  document.querySelectorAll('[data-role-toggle]').forEach((button) => {
    button.addEventListener('click', async () => {
      const nextRole = button.dataset.role === 'admin' ? 'user' : 'admin';
      await apiFetch(`/admin/users/${button.dataset.roleToggle}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: nextRole })
      });
      loadUsers(currentUserPage);
    });
  });
}

async function loadChallenges(page = currentChallengePage) {
  currentChallengePage = page;
  const { items, pagination } = await apiFetch(`/admin/challenges?page=${page}&limit=4`);
  const container = document.getElementById('adminChallenges');
  container.innerHTML = items
    .map(
      (challenge) => `
        <article class="program-card compact">
          <div class="program-topline">
            <span class="category-pill">${challenge.category}</span>
            <span>${challenge.difficulty}</span>
          </div>
          <h3>${challenge.title}</h3>
          <p>${challenge.description}</p>
          <div class="program-stats">
            <span><b>${challenge.points}</b> pts</span>
            <span><b>${challenge.goalType}</b></span>
            <span><b>${challenge.isActive ? 'Active' : 'Paused'}</b></span>
          </div>
        </article>
      `
    )
    .join('');

  document.getElementById('challengePageLabel').textContent = `${pagination.page}/${pagination.totalPages}`;
}

function wireChallengeForm() {
  const form = document.getElementById('challengeForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.points = Number(payload.points);
    try {
      await apiFetch('/admin/challenges', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      form.reset();
      showMessage('adminMessage', 'Challenge created and broadcast live.', 'success');
      loadChallenges(1);
      loadOverview();
    } catch (error) {
      showMessage('adminMessage', error.message);
    }
  });

  document.getElementById('usersPrev').addEventListener('click', () => {
    if (currentUserPage > 1) loadUsers(currentUserPage - 1);
  });
  document.getElementById('usersNext').addEventListener('click', () => loadUsers(currentUserPage + 1));
  document
    .getElementById('challengesPrev')
    .addEventListener('click', () => currentChallengePage > 1 && loadChallenges(currentChallengePage - 1));
  document
    .getElementById('challengesNext')
    .addEventListener('click', () => loadChallenges(currentChallengePage + 1));
}
