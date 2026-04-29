requireAuth();

const RANK_NICKNAMES = {
  1: 'The Cardio King',
  2: 'Protein Panther',
  3: 'Squat Sorcerer',
  4: 'Burpee Boss',
  5: 'Rep Ranger'
};

const RANK_AVATARS = {
  1: 'Crown',
  2: 'Bolt',
  3: 'Flame'
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const summary = await apiFetch('/tracking/summary');
    setCurrentUser(summary.user);
    renderAdminLinks(summary.user);
    const { leaderboard } = await apiFetch('/leaderboard');
    renderLeaderboard(leaderboard);
  } catch (error) {
    showMessage('leaderboardMessage', error.message);
  }
});

function renderLeaderboard(leaderboard) {
  const body = document.getElementById('leaderboardRows');

  if (!leaderboard.length) {
    body.innerHTML = '<tr><td colspan="5">No leaderboard entries yet.</td></tr>';
    return;
  }

  body.innerHTML = leaderboard
    .map((entry) => {
      const nickname = RANK_NICKNAMES[entry.rank] || `${entry.username.split('@')[0]} the Fit Machine`;
      const avatar = RANK_AVATARS[entry.rank] || entry.username.slice(0, 2).toUpperCase();

      return `
        <tr>
          <td><span class="rank-badge rank-${entry.rank}">${entry.rank}</span></td>
          <td>
            <div class="leaderboard-user">
              <span class="leaderboard-avatar rank-${entry.rank}">${avatar}</span>
              <div>
                <strong>${entry.username}</strong>
                <span>${nickname}</span>
              </div>
            </div>
          </td>
          <td>${entry.points}</td>
          <td>${entry.streak} days</td>
          <td>Level ${entry.level}</td>
        </tr>
      `;
    })
    .join('');
}
