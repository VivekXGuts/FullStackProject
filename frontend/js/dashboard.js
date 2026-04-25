requireAuth();

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const connectRealtime = createRealtimeChannel({
      'challenge:completed': (payload) => {
        const message = `${payload.username} completed "${payload.title}" for ${payload.points} points.`;
        renderRealtimeMessage(message);
      },
      'leaderboard:update': ({ leaderboard }) => {
        const topEntry = leaderboard[0];
        if (topEntry) {
          document.getElementById('rankInsight').textContent =
            `${topEntry.username} is leading with ${topEntry.points} points.`;
        }
      }
    });

    const [{ user, metrics }, challengePayload] = await Promise.all([
      apiFetch('/tracking/summary'),
      apiFetch('/workouts/challenges/daily')
    ]);

    setCurrentUser(user);
    renderAdminLinks(user);
    renderDashboard(user, metrics, challengePayload);
    await connectRealtime();
    wireDailyLogForm();
  } catch (error) {
    showMessage('dashboardMessage', error.message);
  }
});

function renderDashboard(user, metrics, { challenge, completed }) {
  document.getElementById('welcomeName').textContent = user.username;
  document.getElementById('pointsValue').textContent = user.points;
  document.getElementById('streakValue').textContent = `${user.streak} days`;
  document.getElementById('levelValue').textContent = `Level ${user.level}`;
  document.getElementById('rankValue').textContent = `#${metrics.rank || '-'}`;
  document.getElementById('goalProgress').innerHTML = progressBar(metrics.dailyGoalPercent);
  document.getElementById('goalText').textContent = `${metrics.dailyGoalCompleted}/${metrics.dailyGoal} activities complete`;
  document.getElementById('levelProgress').innerHTML = progressBar(metrics.levelProgress.percent);
  document.getElementById('levelText').textContent = metrics.levelProgress.nextThreshold
    ? `${metrics.levelProgress.remaining} points to Level ${metrics.levelProgress.currentLevel + 1}`
    : 'Top level reached';
  document.getElementById('badgesList').innerHTML = badgeMarkup(user.badges);
  document.getElementById('challengeTitle').textContent = challenge.title;
  document.getElementById('challengeDescription').textContent = challenge.description;
  document.getElementById('challengePoints').textContent = `+${challenge.points} pts`;
  document.getElementById('rankInsight').textContent = `You are currently ranked #${metrics.rank || '-'}.`;

  const challengeButton = document.getElementById('completeChallenge');
  challengeButton.disabled = completed;
  challengeButton.textContent = completed ? 'Completed' : 'Complete';
  challengeButton.addEventListener('click', async () => {
    challengeButton.disabled = true;
    try {
      await apiFetch(`/workouts/challenges/${challenge.id}/complete`, { method: 'POST' });
      location.reload();
    } catch (error) {
      showMessage('dashboardMessage', error.message);
      challengeButton.disabled = false;
    }
  });

  renderWeeklyProgress(metrics.weeklyProgress);
  renderActivityHistory(user.activityHistory || []);
  renderDailyLogs(user.dailyLogs || []);
}

function renderWeeklyProgress(weeklyProgress) {
  const maxPoints = Math.max(100, ...weeklyProgress.map((day) => day.points));
  document.getElementById('weeklyBars').innerHTML = weeklyProgress
    .map((day) => {
      const height = Math.max(8, Math.round((day.points / maxPoints) * 100));
      const label = new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' });
      return `<div class="chart-bar"><span style="height:${height}%"></span><small>${label}</small></div>`;
    })
    .join('');
}

function renderActivityHistory(history) {
  const container = document.getElementById('activityHistory');
  if (!history.length) {
    container.innerHTML = '<p class="muted">No activity yet. Complete a workout or challenge to start your timeline.</p>';
    return;
  }

  container.innerHTML = history
    .slice(0, 8)
    .map(
      (activity) => `
        <article class="timeline-item">
          <div>
            <strong>${activity.title}</strong>
            <span>${formatDate(activity.completedAt)}</span>
          </div>
          <b>+${activity.points}</b>
        </article>
      `
    )
    .join('');
}

function renderDailyLogs(dailyLogs) {
  const container = document.getElementById('dailyLogHistory');
  if (!dailyLogs.length) {
    container.innerHTML = '<p class="muted">No daily logs yet. Add steps and calories to build your streak.</p>';
    return;
  }

  container.innerHTML = dailyLogs
    .slice(0, 5)
    .map(
      (log) => `
        <article class="timeline-item">
          <div>
            <strong>${log.steps} steps • ${log.caloriesBurned} calories</strong>
            <span>${formatDate(log.date)} • ${log.minutesActive || 0} active min • ${log.mood}</span>
          </div>
          <b>Log</b>
        </article>
      `
    )
    .join('');
}

function wireDailyLogForm() {
  const form = document.getElementById('dailyLogForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await apiFetch('/tracking/daily-log', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showMessage('dashboardMessage', 'Daily log saved. Your points and streak are updated.', 'success');
      location.reload();
    } catch (error) {
      showMessage('dashboardMessage', error.message);
    }
  });
}

function renderRealtimeMessage(message) {
  const container = document.getElementById('realtimeUpdates');
  const item = document.createElement('article');
  item.className = 'timeline-item';
  item.innerHTML = `<div><strong>Live update</strong><span>${message}</span></div><b>Now</b>`;
  container.prepend(item);
}
