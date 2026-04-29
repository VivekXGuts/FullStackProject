requireAuth();

const GOAL_CONFIG = {
  'Lean & Fit': {
    title: 'Stay lean, strong, and consistent',
    description: 'Focus on balanced training, a steady calorie target, and habits that keep you athletic without extreme dieting.',
    focus: 'Balanced maintenance',
    adjustment: -100
  },
  'Muscle Gain': {
    title: 'Build more size and strength',
    description: 'Push progressive overload, recover well, and maintain a calorie surplus that supports quality muscle growth.',
    focus: 'Controlled surplus',
    adjustment: 280
  },
  'Fat Loss': {
    title: 'Cut body fat without losing momentum',
    description: 'Keep protein high, stay active, and aim for a smart deficit so your results are visible and sustainable.',
    focus: 'Smart deficit',
    adjustment: -320
  },
  Endurance: {
    title: 'Improve stamina and long-session output',
    description: 'Support cardio-heavy training with enough fuel, hydration, and recovery to keep energy levels stable.',
    focus: 'Performance fueling',
    adjustment: 140
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const profileForm = document.getElementById('profileForm');
  const calculatorForm = document.getElementById('calorieCalculatorForm');
  const bodyGoalSelect = profileForm.bodyGoal;

  try {
    const { user, metrics } = await apiFetch('/auth/me');
    setCurrentUser(user);
    renderAdminLinks(user);
    renderProfileSummary(user, metrics);
    profileForm.fitnessLevel.value = user.fitnessLevel;
    profileForm.dailyGoal.value = user.dailyGoal;
    bodyGoalSelect.value = user.bodyGoal || 'Lean & Fit';
    renderGoalCards(bodyGoalSelect.value);
    updateGoalPreview(bodyGoalSelect.value);
    calculateCalories();
  } catch (error) {
    showMessage('profileMessage', error.message);
  }

  bodyGoalSelect.addEventListener('change', () => {
    renderGoalCards(bodyGoalSelect.value);
    updateGoalPreview(bodyGoalSelect.value);
    calculateCalories();
  });

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = profileForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const payload = Object.fromEntries(new FormData(profileForm).entries());
      const response = await apiFetch('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      setCurrentUser(response.user);
      updateGoalPreview(response.user.bodyGoal || payload.bodyGoal);
      renderGoalCards(response.user.bodyGoal || payload.bodyGoal);
      showMessage('profileMessage', 'Profile updated.', 'success');
    } catch (error) {
      showMessage('profileMessage', error.message);
    } finally {
      submitButton.disabled = false;
    }
  });

  calculatorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateCalories();
  });
});

function renderProfileSummary(user, metrics) {
  document.getElementById('profileName').textContent = user.username;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileBadges').innerHTML = badgeMarkup(user.badges);
  document.getElementById('profileStats').innerHTML = `
    <div><b>${user.points}</b><span>Points</span></div>
    <div><b>${user.streak}</b><span>Streak</span></div>
    <div><b>${metrics.completedWorkouts}</b><span>Workouts</span></div>
    <div><b>${metrics.totalCalories}</b><span>Calories</span></div>
  `;
}

function renderGoalCards(selectedGoal) {
  const container = document.getElementById('goalCards');
  container.innerHTML = Object.entries(GOAL_CONFIG)
    .map(
      ([goal, config]) => `
        <button class="goal-card ${goal === selectedGoal ? 'is-active' : ''}" type="button" data-goal-card="${goal}">
          <span>${goal}</span>
          <strong>${config.focus}</strong>
          <small>${config.description}</small>
        </button>
      `
    )
    .join('');

  document.querySelectorAll('[data-goal-card]').forEach((button) => {
    button.addEventListener('click', () => {
      document.forms.profileForm.bodyGoal.value = button.dataset.goalCard;
      renderGoalCards(button.dataset.goalCard);
      updateGoalPreview(button.dataset.goalCard);
      calculateCalories();
    });
  });
}

function updateGoalPreview(goal) {
  const config = GOAL_CONFIG[goal] || GOAL_CONFIG['Lean & Fit'];
  document.getElementById('goalHeadline').textContent = config.title;
  document.getElementById('goalDescription').textContent = config.description;
  document.getElementById('goalBadge').textContent = goal;
  document.getElementById('goalCaloriesHint').textContent = config.focus;
}

function calculateCalories() {
  const form = document.getElementById('calorieCalculatorForm');
  const bodyGoal = document.forms.profileForm.bodyGoal.value || 'Lean & Fit';
  const age = Number(form.age.value);
  const weight = Number(form.weight.value);
  const height = Number(form.height.value);
  const gender = form.gender.value;
  const activityLevel = Number(form.activityLevel.value);

  if ([age, weight, height, activityLevel].some((value) => Number.isNaN(value) || value <= 0)) {
    return;
  }

  const bmr =
    gender === 'female'
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5;
  const maintenance = Math.round(bmr * activityLevel);
  const target = Math.max(1200, Math.round(maintenance + (GOAL_CONFIG[bodyGoal]?.adjustment || 0)));

  document.getElementById('bmrValue').textContent = `${Math.round(bmr)} cal`;
  document.getElementById('maintenanceValue').textContent = `${maintenance} cal`;
  document.getElementById('goalCaloriesValue').textContent = `${target} cal`;
  document.getElementById('goalCaloriesHint').textContent = `${target} cal target`;
}
