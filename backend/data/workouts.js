const categoryPhotos = {
  Beginner: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  Intermediate: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80',
  Advanced: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
  Yoga: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
  Cardio: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=900&q=80',
  Strength: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80',
  Chest: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  Back: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
  Legs: 'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=900&q=80',
  Shoulders: 'https://images.unsplash.com/photo-1571019613540-9960a4f9f8d1?auto=format&fit=crop&w=900&q=80',
  Arms: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80',
  Core: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80'
};

function youtubeSearch(channel, query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${channel} ${query}`)}`;
}

function detailExercise(category, name, focus, channel, query) {
  return {
    name,
    focus,
    imageUrl: categoryPhotos[category] || categoryPhotos.Strength,
    learnLinks: [
      {
        label: `${channel} demo`,
        url: youtubeSearch(channel, query || name)
      }
    ]
  };
}

function makeWorkout({
  id,
  title,
  description,
  category,
  duration,
  difficulty,
  calories,
  targetMuscles,
  exercises,
  demoLinks
}) {
  return {
    id,
    title,
    description,
    category,
    duration,
    difficulty,
    calories,
    targetMuscles,
    exercises,
    demoLinks:
      demoLinks ||
      exercises.slice(0, 2).flatMap((exercise) => exercise.learnLinks || [])
  };
}

const workouts = [
  makeWorkout({
    id: 'beginner-body-reset',
    title: 'Beginner Body Reset',
    description: 'A gentle full-body circuit with squats, wall pushups, hip hinges, and mobility work.',
    category: 'Beginner',
    duration: 20,
    difficulty: 'Easy',
    calories: 150,
    targetMuscles: ['Full Body', 'Mobility'],
    exercises: [
      detailExercise('Beginner', 'Bodyweight Squat', 'Quads and glutes', 'Jeremy Ethier', 'bodyweight squat form'),
      detailExercise('Beginner', 'Wall Push-Up', 'Chest and shoulders', 'ATHLEAN-X', 'push up progression'),
      detailExercise('Beginner', 'Hip Hinge Drill', 'Hamstrings and posture', 'Squat University', 'hip hinge drill'),
      detailExercise('Beginner', 'March in Place', 'Cardio warmup', 'The Body Coach TV', 'march in place warm up')
    ]
  }),
  makeWorkout({
    id: 'starter-core-flow',
    title: 'Starter Core Flow',
    description: 'Low-impact planks, dead bugs, bridges, and breathing drills for a stable foundation.',
    category: 'Beginner',
    duration: 18,
    difficulty: 'Easy',
    calories: 120,
    targetMuscles: ['Core', 'Glutes'],
    exercises: [
      detailExercise('Core', 'Forearm Plank', 'Deep core stability', 'Jeff Nippard', 'plank form'),
      detailExercise('Core', 'Dead Bug', 'Core control', 'Squat University', 'dead bug exercise'),
      detailExercise('Core', 'Glute Bridge', 'Glutes and lower back', 'Bret Contreras', 'glute bridge form'),
      detailExercise('Core', 'Breathing Reset', 'Core bracing', 'E3 Rehab', 'diaphragmatic breathing exercise')
    ]
  }),
  makeWorkout({
    id: 'tempo-strength-builder',
    title: 'Tempo Strength Builder',
    description: 'Controlled strength intervals using pushups, lunges, rows, and squat holds.',
    category: 'Intermediate',
    duration: 32,
    difficulty: 'Medium',
    calories: 280,
    targetMuscles: ['Chest', 'Legs', 'Back'],
    exercises: [
      detailExercise('Intermediate', 'Tempo Push-Up', 'Chest and triceps', 'ATHLEAN-X', 'push up form'),
      detailExercise('Intermediate', 'Reverse Lunge', 'Glutes and quads', 'Jeremy Ethier', 'reverse lunge'),
      detailExercise('Intermediate', 'Bent-Over Row', 'Mid back', 'ScottHermanFitness', 'dumbbell row'),
      detailExercise('Intermediate', 'Squat Hold', 'Leg endurance', 'Jeff Nippard', 'squat hold')
    ]
  }),
  makeWorkout({
    id: 'cardio-power-ladder',
    title: 'Cardio Power Ladder',
    description: 'Escalating rounds of skaters, mountain climbers, high knees, and recovery breathwork.',
    category: 'Intermediate',
    duration: 30,
    difficulty: 'Medium',
    calories: 340,
    targetMuscles: ['Cardio', 'Core'],
    exercises: [
      detailExercise('Cardio', 'Skaters', 'Lateral power', 'Pamela Reif', 'skaters exercise'),
      detailExercise('Cardio', 'Mountain Climbers', 'Core and cardio', 'Jeremy Ethier', 'mountain climbers'),
      detailExercise('Cardio', 'High Knees', 'Conditioning', 'The Body Coach TV', 'high knees exercise'),
      detailExercise('Cardio', 'Burpee Step-Back', 'Full body conditioning', 'ATHLEAN-X', 'burpee form')
    ]
  }),
  makeWorkout({
    id: 'athlete-hiit-engine',
    title: 'Athlete HIIT Engine',
    description: 'Advanced conditioning with explosive intervals, strength bursts, and short rests.',
    category: 'Advanced',
    duration: 42,
    difficulty: 'Hard',
    calories: 520,
    targetMuscles: ['Full Body', 'Cardio'],
    exercises: [
      detailExercise('Advanced', 'Jump Squat', 'Power output', 'Jeff Nippard', 'jump squat'),
      detailExercise('Advanced', 'Push Press', 'Shoulders and triceps', 'ScottHermanFitness', 'push press'),
      detailExercise('Advanced', 'Alternating Lunge Jump', 'Leg power', 'Jeremy Ethier', 'jump lunge'),
      detailExercise('Advanced', 'Bear Crawl', 'Core and shoulders', 'ATHLEAN-X', 'bear crawl')
    ]
  }),
  makeWorkout({
    id: 'advanced-strength-complex',
    title: 'Advanced Strength Complex',
    description: 'Compound strength blocks that blend upper body, lower body, and core endurance.',
    category: 'Advanced',
    duration: 45,
    difficulty: 'Hard',
    calories: 480,
    targetMuscles: ['Full Body', 'Strength'],
    exercises: [
      detailExercise('Advanced', 'Front Squat', 'Quads and core', 'Jeff Nippard', 'front squat'),
      detailExercise('Advanced', 'Romanian Deadlift', 'Hamstrings and glutes', 'Jeff Nippard', 'romanian deadlift'),
      detailExercise('Advanced', 'Push Press', 'Shoulders and triceps', 'ScottHermanFitness', 'push press'),
      detailExercise('Advanced', 'Renegade Row', 'Back and core', 'ATHLEAN-X', 'renegade row')
    ]
  }),
  makeWorkout({
    id: 'sunrise-yoga-mobility',
    title: 'Sunrise Yoga Mobility',
    description: 'A refreshing yoga sequence for hips, spine, hamstrings, and mindful breathing.',
    category: 'Yoga',
    duration: 25,
    difficulty: 'Easy',
    calories: 110,
    targetMuscles: ['Mobility', 'Recovery'],
    exercises: [
      detailExercise('Yoga', 'Cat Cow', 'Spine mobility', 'Yoga With Adriene', 'cat cow yoga'),
      detailExercise('Yoga', 'Downward Dog', 'Shoulders and hamstrings', 'Yoga With Adriene', 'downward dog'),
      detailExercise('Yoga', 'Low Lunge', 'Hip flexors', 'Yoga With Adriene', 'low lunge yoga'),
      detailExercise('Yoga', 'Hamstring Fold', 'Posterior chain mobility', 'Yoga With Adriene', 'forward fold yoga')
    ]
  }),
  makeWorkout({
    id: 'deep-stretch-recovery',
    title: 'Deep Stretch Recovery',
    description: 'Slow holds and restorative movement to support recovery and flexibility.',
    category: 'Yoga',
    duration: 28,
    difficulty: 'Easy',
    calories: 95,
    targetMuscles: ['Recovery', 'Mobility'],
    exercises: [
      detailExercise('Yoga', 'Child Pose', 'Recovery and breathing', 'Yoga With Adriene', 'child pose'),
      detailExercise('Yoga', 'Pigeon Stretch', 'Glutes and hips', 'Yoga With Adriene', 'pigeon pose'),
      detailExercise('Yoga', 'Spinal Twist', 'Thoracic mobility', 'Yoga With Adriene', 'supine twist'),
      detailExercise('Yoga', 'Figure Four Stretch', 'Glutes', 'Yoga With Adriene', 'figure four stretch')
    ]
  }),
  makeWorkout({
    id: 'zone-two-cardio',
    title: 'Zone Two Cardio',
    description: 'Steady endurance pacing with walk-jog intervals and simple heart-rate cues.',
    category: 'Cardio',
    duration: 35,
    difficulty: 'Medium',
    calories: 360,
    targetMuscles: ['Cardio'],
    exercises: [
      detailExercise('Cardio', 'Brisk Walk', 'Low-intensity cardio', 'The Run Experience', 'walking warmup'),
      detailExercise('Cardio', 'Jog Interval', 'Aerobic base', 'The Run Experience', 'jogging form'),
      detailExercise('Cardio', 'Step March', 'Heart-rate control', 'Pamela Reif', 'march cardio'),
      detailExercise('Cardio', 'Cooldown Walk', 'Recovery pace', 'The Run Experience', 'cool down walk')
    ]
  }),
  makeWorkout({
    id: 'quick-sweat-cardio',
    title: 'Quick Sweat Cardio',
    description: 'A compact cardio blast with jump-free options and crisp recovery windows.',
    category: 'Cardio',
    duration: 16,
    difficulty: 'Medium',
    calories: 210,
    targetMuscles: ['Cardio', 'Legs'],
    exercises: [
      detailExercise('Cardio', 'Fast Feet', 'Agility and conditioning', 'Pamela Reif', 'fast feet cardio'),
      detailExercise('Cardio', 'Step Jack', 'Low-impact cardio', 'The Body Coach TV', 'step jack exercise'),
      detailExercise('Cardio', 'Bodyweight Squat', 'Leg endurance', 'Jeremy Ethier', 'bodyweight squat form'),
      detailExercise('Cardio', 'Reverse Lunge', 'Glutes and quads', 'Jeremy Ethier', 'reverse lunge')
    ]
  }),
  makeWorkout({
    id: 'functional-strength',
    title: 'Functional Strength',
    description: 'Push, pull, hinge, squat, and carry patterns designed for everyday strength.',
    category: 'Strength',
    duration: 38,
    difficulty: 'Medium',
    calories: 390,
    targetMuscles: ['Full Body', 'Strength'],
    exercises: [
      detailExercise('Strength', 'Goblet Squat', 'Legs and core', 'Jeff Nippard', 'goblet squat'),
      detailExercise('Strength', 'Dumbbell Row', 'Lats and mid back', 'ScottHermanFitness', 'dumbbell row'),
      detailExercise('Strength', 'Romanian Deadlift', 'Hamstrings and glutes', 'Jeff Nippard', 'romanian deadlift'),
      detailExercise('Strength', 'Farmer Carry', 'Grip and core', 'ATHLEAN-X', 'farmer carry')
    ]
  }),
  makeWorkout({
    id: 'upper-body-strength',
    title: 'Upper Body Strength',
    description: 'Chest, back, shoulder, and arm training with scalable bodyweight variations.',
    category: 'Strength',
    duration: 34,
    difficulty: 'Medium',
    calories: 320,
    targetMuscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    exercises: [
      detailExercise('Strength', 'Incline Push-Up', 'Chest and shoulders', 'ATHLEAN-X', 'incline push up'),
      detailExercise('Strength', 'Band Row', 'Upper back', 'ATHLEAN-X', 'band row'),
      detailExercise('Strength', 'Shoulder Tap', 'Core and shoulders', 'Jeff Nippard', 'shoulder tap plank'),
      detailExercise('Strength', 'Bench Dip', 'Triceps', 'ScottHermanFitness', 'bench dips')
    ]
  }),
  makeWorkout({
    id: 'barbell-bench-focus',
    title: 'Chest Day Builder',
    description: 'A true gym chest day with four classic presses and fly patterns to grow pressing strength.',
    category: 'Chest',
    duration: 48,
    difficulty: 'Medium',
    calories: 430,
    targetMuscles: ['Chest', 'Triceps', 'Front Delts'],
    exercises: [
      detailExercise('Chest', 'Barbell Bench Press', 'Mid chest strength', 'Jeff Nippard', 'bench press technique'),
      detailExercise('Chest', 'Incline Dumbbell Press', 'Upper chest', 'Jeremy Ethier', 'incline dumbbell press'),
      detailExercise('Chest', 'Cable Chest Fly', 'Chest contraction', 'ScottHermanFitness', 'cable chest fly'),
      detailExercise('Chest', 'Machine Chest Press', 'Chest volume', 'ATHLEAN-X', 'machine chest press')
    ]
  }),
  makeWorkout({
    id: 'pull-day-mass-builder',
    title: 'Back Day Builder',
    description: 'A back-focused gym day built around vertical pulls, rows, and balanced lat development.',
    category: 'Back',
    duration: 50,
    difficulty: 'Medium',
    calories: 440,
    targetMuscles: ['Lats', 'Mid Back', 'Biceps'],
    exercises: [
      detailExercise('Back', 'Lat Pulldown', 'Lats and upper back', 'ATHLEAN-X', 'lat pulldown form'),
      detailExercise('Back', 'Barbell Row', 'Mid back thickness', 'Jeff Nippard', 'barbell row'),
      detailExercise('Back', 'Seated Cable Row', 'Mid back control', 'ScottHermanFitness', 'seated cable row'),
      detailExercise('Back', 'Single-Arm Dumbbell Row', 'Lat isolation', 'Jeremy Ethier', 'single arm dumbbell row')
    ]
  }),
  makeWorkout({
    id: 'leg-day-power-session',
    title: 'Leg Day Builder',
    description: 'A heavy lower-body gym day covering squat strength, posterior chain work, and quad volume.',
    category: 'Legs',
    duration: 55,
    difficulty: 'Hard',
    calories: 520,
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
    exercises: [
      detailExercise('Legs', 'Back Squat', 'Quads and glutes', 'Jeremy Ethier', 'squat form'),
      detailExercise('Legs', 'Romanian Deadlift', 'Hamstrings and glutes', 'Jeff Nippard', 'romanian deadlift'),
      detailExercise('Legs', 'Leg Press', 'Quad volume', 'ScottHermanFitness', 'leg press'),
      detailExercise('Legs', 'Walking Lunge', 'Glutes and balance', 'ATHLEAN-X', 'walking lunge')
    ]
  }),
  makeWorkout({
    id: 'shoulder-shape-builder',
    title: 'Shoulder Day Builder',
    description: 'A shoulder session built for rounder delts with presses, raises, rear-delt work, and posture support.',
    category: 'Shoulders',
    duration: 40,
    difficulty: 'Medium',
    calories: 350,
    targetMuscles: ['Front Delts', 'Side Delts', 'Rear Delts'],
    exercises: [
      detailExercise('Shoulders', 'Seated Dumbbell Shoulder Press', 'Overhead pressing strength', 'ScottHermanFitness', 'shoulder press'),
      detailExercise('Shoulders', 'Lateral Raise', 'Side delt growth', 'Jeff Nippard', 'lateral raise'),
      detailExercise('Shoulders', 'Rear Delt Fly', 'Rear delt isolation', 'Jeremy Ethier', 'rear delt fly'),
      detailExercise('Shoulders', 'Face Pull', 'Rear delts and posture', 'ATHLEAN-X', 'face pull')
    ]
  }),
  makeWorkout({
    id: 'arm-pump-primer',
    title: 'Arm Day Builder',
    description: 'A focused arm day for biceps and triceps using four gym staples that are easy to learn and track.',
    category: 'Arms',
    duration: 36,
    difficulty: 'Medium',
    calories: 280,
    targetMuscles: ['Biceps', 'Triceps', 'Forearms'],
    exercises: [
      detailExercise('Arms', 'EZ-Bar Curl', 'Biceps thickness', 'ScottHermanFitness', 'ez bar curl'),
      detailExercise('Arms', 'Hammer Curl', 'Biceps and brachialis', 'Jeremy Ethier', 'hammer curl'),
      detailExercise('Arms', 'Skull Crusher', 'Triceps long head', 'Renaissance Periodization', 'skull crusher'),
      detailExercise('Arms', 'Rope Pushdown', 'Triceps finish', 'ATHLEAN-X', 'rope pushdown')
    ]
  }),
  makeWorkout({
    id: 'core-and-abs-carver',
    title: 'Core and Abs Carver',
    description: 'A gym-friendly abs session focused on trunk stability, anti-rotation, and visible core development.',
    category: 'Core',
    duration: 24,
    difficulty: 'Medium',
    calories: 190,
    targetMuscles: ['Abs', 'Obliques', 'Deep Core'],
    exercises: [
      detailExercise('Core', 'Cable Crunch', 'Upper abs', 'ATHLEAN-X', 'cable crunch'),
      detailExercise('Core', 'Hanging Knee Raise', 'Lower abs', 'Jeff Nippard', 'hanging knee raise'),
      detailExercise('Core', 'Plank', 'Core stability', 'Jeff Nippard', 'plank form'),
      detailExercise('Core', 'Russian Twist', 'Obliques', 'ScottHermanFitness', 'russian twist')
    ]
  })
];

module.exports = workouts;
