requireAuth();

document.addEventListener('DOMContentLoaded', async () => {
  const profileForm = document.getElementById('profileForm');

  try {
    const { user, metrics } = await apiFetch('/auth/me');
    setCurrentUser(user);
    renderAdminLinks(user);
    document.getElementById('profileName').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileBadges').innerHTML = badgeMarkup(user.badges);
    document.getElementById('profileStats').innerHTML = `
      <div><b>${user.points}</b><span>Points</span></div>
      <div><b>${user.streak}</b><span>Streak</span></div>
      <div><b>${metrics.completedWorkouts}</b><span>Workouts</span></div>
      <div><b>${metrics.totalCalories}</b><span>Calories</span></div>
    `;
    profileForm.fitnessLevel.value = user.fitnessLevel;
    profileForm.dailyGoal.value = user.dailyGoal;
  } catch (error) {
    showMessage('profileMessage', error.message);
  }

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = profileForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const payload = Object.fromEntries(new FormData(profileForm).entries());
      await apiFetch('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      showMessage('profileMessage', 'Profile updated.', 'success');
    } catch (error) {
      showMessage('profileMessage', error.message);
    } finally {
      submitButton.disabled = false;
    }
  });
});
