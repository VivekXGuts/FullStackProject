requireAuth();

let allWorkouts = [];
let activeCategory = 'All';
let timerState = {
  workout: null,
  elapsedSeconds: 0,
  isRunning: false,
  intervalId: null
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const summary = await apiFetch('/tracking/summary');
    setCurrentUser(summary.user);
    renderAdminLinks(summary.user);
    const { workouts } = await apiFetch('/workouts');
    allWorkouts = workouts;
    renderFilters(workouts);
    renderWorkouts();
    wireTimerControls();
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
  const visible =
    activeCategory === 'All'
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
          <div class="exercise-preview">
            ${(workout.exercises || [])
              .slice(0, 4)
              .map((exercise) => `<span class="badge subtle">${normalizeExercise(exercise).name}</span>`)
              .join('')}
          </div>
          <div class="exercise-grid">
            ${(workout.exercises || [])
              .slice(0, 4)
              .map((exercise) => renderExerciseCard(exercise, workout.category))
              .join('')}
          </div>
          <div class="program-stats">
            <span><b>${workout.duration}</b> min</span>
            <span><b>${workout.calories}</b> cal</span>
            <span><b>+50</b> pts</span>
          </div>
          <div class="demo-links">
            ${(workout.demoLinks || [])
              .slice(0, 2)
              .map(
                (link) =>
                  `<a class="demo-link" href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`
              )
              .join('')}
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
        const workout = allWorkouts.find((item) => item.id === id);
        startWorkoutTimer(workout);
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
        const response = await completeWorkout(id);
        showMessage('workoutsMessage', `${response.message} Level ${response.rewards.level}.`, 'success');
      } catch (error) {
        showMessage('workoutsMessage', error.message);
      } finally {
        button.disabled = false;
      }
    });
  });
}

function wireTimerControls() {
  document.getElementById('pauseTimerButton').addEventListener('click', toggleTimerPause);
  document.getElementById('resetTimerButton').addEventListener('click', resetWorkoutTimer);
  document.getElementById('completeTimerButton').addEventListener('click', async () => {
    if (!timerState.workout) return;
    try {
      const response = await completeWorkout(timerState.workout.id);
      showMessage('workoutsMessage', `${response.message} Level ${response.rewards.level}.`, 'success');
      resetWorkoutTimer();
    } catch (error) {
      showMessage('workoutsMessage', error.message);
    }
  });
}

async function completeWorkout(id) {
  return apiFetch(`/workouts/${id}/complete`, { method: 'POST' });
}

function startWorkoutTimer(workout) {
  if (!workout) return;

  clearTimerInterval();
  timerState = {
    workout,
    elapsedSeconds: 0,
    isRunning: true,
    intervalId: setInterval(() => {
      timerState.elapsedSeconds += 1;
      renderTimer();
    }, 1000)
  };

  renderTimer();
  document.getElementById('workoutTimerPanel').hidden = false;
}

function toggleTimerPause() {
  if (!timerState.workout) return;

  timerState.isRunning = !timerState.isRunning;
  document.getElementById('pauseTimerButton').textContent = timerState.isRunning ? 'Pause' : 'Resume';

  if (timerState.isRunning) {
    clearTimerInterval();
    timerState.intervalId = setInterval(() => {
      timerState.elapsedSeconds += 1;
      renderTimer();
    }, 1000);
  } else {
    clearTimerInterval();
  }
}

function resetWorkoutTimer() {
  clearTimerInterval();
  timerState = {
    workout: null,
    elapsedSeconds: 0,
    isRunning: false,
    intervalId: null
  };
  document.getElementById('workoutTimerPanel').hidden = true;
}

function clearTimerInterval() {
  if (timerState.intervalId) {
    clearInterval(timerState.intervalId);
  }
}

function renderTimer() {
  const { workout, elapsedSeconds } = timerState;
  if (!workout) return;

  const targetSeconds = workout.duration * 60;
  const percent = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));
  const exercises = (workout.exercises || []).map((exercise) => normalizeExercise(exercise, workout.category));

  document.getElementById('timerWorkoutTitle').textContent = workout.title;
  document.getElementById('timerWorkoutMeta').textContent =
    `${workout.category} • ${workout.difficulty} • ${workout.calories} calories`;
  document.getElementById('timerElapsed').textContent = formatTimer(elapsedSeconds);
  document.getElementById('timerTarget').textContent = `Target ${workout.duration} min`;
  document.getElementById('timerProgressBar').style.width = `${percent}%`;
  document.getElementById('timerExerciseList').innerHTML = exercises
    .map((exercise) => `<span class="badge">${exercise.name}</span>`)
    .join('');
  document.getElementById('timerDemoLinks').innerHTML = exercises
    .flatMap((exercise) => exercise.learnLinks)
    .slice(0, 4)
    .map(
      (link) =>
        `<a class="demo-link" href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`
    )
    .join('');
}

function formatTimer(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function normalizeExercise(exercise, category = 'Strength') {
  if (typeof exercise === 'string') {
    return {
      name: exercise,
      focus: category,
      imageUrl: '',
      learnLinks: []
    };
  }

  return {
    name: exercise?.name || 'Exercise',
    focus: exercise?.focus || category,
    imageUrl: exercise?.imageUrl || '',
    learnLinks: Array.isArray(exercise?.learnLinks) ? exercise.learnLinks : []
  };
}

function renderExerciseCard(exercise, category) {
  const item = normalizeExercise(exercise, category);
  const links = item.learnLinks.length
    ? item.learnLinks
        .map(
          (link) =>
            `<a class="demo-link exercise-link" href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`
        )
        .join('')
    : '<span class="muted">Demo link coming soon</span>';

  return `
    <article class="exercise-card">
      <div class="exercise-visual">
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="exercise-overlay">
          <span class="exercise-chip">${category}</span>
          <strong>${item.name}</strong>
        </div>
      </div>
      <div class="exercise-copy">
        <p class="exercise-focus">${item.focus}</p>
        <div class="exercise-links">${links}</div>
      </div>
    </article>
  `;
}
