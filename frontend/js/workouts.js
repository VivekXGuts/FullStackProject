requireAuth();

let allWorkouts = [];
let activeCategory = 'All';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { workouts } = await apiFetch('/workouts');
    allWorkouts = workouts;
    renderFilters(workouts);
    renderWorkouts();
  } catch (error) {
    showMessage('workoutsMessage', error.message);
  }
});

function renderFilters(workouts) {
  const categories = ['All', ...new Set(workouts.map((workout) => workout.category))];
  document.getElementById('workoutFilters').innerHTML = categories
    .map(
      (category) => `
        <button class="chip ${category === activeCategory ? 'is-active' : ''}" data-category="${category}">
          ${category}
        </button>
      `
    )
    .join('');

  document.querySelectorAll('[data-category]').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      renderFilters(allWorkouts);
      renderWorkouts();
    });
  });
}

function renderWorkouts() {
  const visible = activeCategory === 'All'
    ? allWorkouts
    : allWorkouts.filter((workout) => workout.category === activeCategory);

  document.getElementById('workoutGrid').innerHTML = visible
    .map(
      (workout) => `
        <article class="program-card">
          <div class="program-topline">
            <span class="category-pill">${workout.category}</span>
            <span>${workout.difficulty}</span>
          </div>
          <h3>${workout.title}</h3>
          <p>${workout.description}</p>
          <div class="program-stats">
            <span><b>${workout.duration}</b> min</span>
            <span><b>${workout.calories}</b> cal</span>
            <span><b>+50</b> pts</span>
          </div>
          <div class="card-actions">
            <button class="btn secondary" data-start="${workout.id}">Start</button>
            <button class="btn primary" data-complete="${workout.id}">Complete</button>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('[data-start]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.start;
      button.disabled = true;
      try {
        const response = await apiFetch(`/workouts/${id}/start`, { method: 'POST' });
        showMessage('workoutsMessage', response.message, 'success');
      } catch (error) {
        showMessage('workoutsMessage', error.message);
      } finally {
        button.disabled = false;
      }
    });
  });

  document.querySelectorAll('[data-complete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.complete;
      button.disabled = true;
      try {
        const response = await apiFetch(`/workouts/${id}/complete`, { method: 'POST' });
        showMessage('workoutsMessage', `${response.message} Level ${response.rewards.level}.`, 'success');
      } catch (error) {
        showMessage('workoutsMessage', error.message);
      } finally {
        button.disabled = false;
      }
    });
  });
}
