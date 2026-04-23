requireAuth();

document.addEventListener('DOMContentLoaded', async () => {
  try {
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
    .map(
      (entry) => `
        <tr>
          <td><span class="rank-badge">${entry.rank}</span></td>
          <td>${entry.username}</td>
          <td>${entry.points}</td>
          <td>${entry.streak} days</td>
          <td>Level ${entry.level}</td>
        </tr>
      `
    )
    .join('');
}
