const workouts = [
  {
    id: 'beginner-body-reset',
    title: 'Beginner Body Reset',
    description: 'A gentle full-body circuit with squats, wall pushups, hip hinges, and mobility work.',
    category: 'Beginner',
    duration: 20,
    difficulty: 'Easy',
    calories: 150,
    targetMuscles: ['Full Body', 'Mobility'],
    exercises: ['Bodyweight Squat', 'Wall Push-Up', 'Hip Hinge Drill', 'March in Place'],
    demoLinks: [
      {
        label: 'Beginner squat demo - Jeremy Ethier',
        url: 'https://www.youtube.com/results?search_query=Jeremy+Ethier+bodyweight+squat'
      },
      {
        label: 'Push-up progression - ATHLEAN-X',
        url: 'https://www.youtube.com/results?search_query=ATHLEAN-X+push+up+progression'
      }
    ]
  },
  {
    id: 'starter-core-flow',
    title: 'Starter Core Flow',
    description: 'Low-impact planks, dead bugs, bridges, and breathing drills for a stable foundation.',
    category: 'Beginner',
    duration: 18,
    difficulty: 'Easy',
    calories: 120,
    targetMuscles: ['Core', 'Glutes'],
    exercises: ['Forearm Plank', 'Dead Bug', 'Glute Bridge', 'Breathing Reset'],
    demoLinks: [
      {
        label: 'Dead bug tutorial - Squat University',
        url: 'https://www.youtube.com/results?search_query=Squat+University+dead+bug+exercise'
      },
      {
        label: 'Plank form - Jeff Nippard',
        url: 'https://www.youtube.com/results?search_query=Jeff+Nippard+plank+form'
      }
    ]
  },
  {
    id: 'tempo-strength-builder',
    title: 'Tempo Strength Builder',
    description: 'Controlled strength intervals using pushups, lunges, rows, and squat holds.',
    category: 'Intermediate',
    duration: 32,
    difficulty: 'Medium',
    calories: 280,
    targetMuscles: ['Chest', 'Legs', 'Back'],
    exercises: ['Tempo Push-Up', 'Reverse Lunge', 'Bent-Over Row', 'Squat Hold'],
    demoLinks: [
      {
        label: 'Push-up tempo cues - ATHLEAN-X',
        url: 'https://www.youtube.com/results?search_query=ATHLEAN-X+pushup+form'
      },
      {
        label: 'Dumbbell row demo - ScottHermanFitness',
        url: 'https://www.youtube.com/results?search_query=ScottHermanFitness+dumbbell+row'
      }
    ]
  },
  {
    id: 'cardio-power-ladder',
    title: 'Cardio Power Ladder',
    description: 'Escalating rounds of skaters, mountain climbers, high knees, and recovery breathwork.',
    category: 'Intermediate',
    duration: 30,
    difficulty: 'Medium',
    calories: 340,
    targetMuscles: ['Cardio', 'Core'],
    exercises: ['Skaters', 'Mountain Climbers', 'High Knees', 'Burpee Step-Back'],
    demoLinks: [
      {
        label: 'Mountain climber demo - Jeremy Ethier',
        url: 'https://www.youtube.com/results?search_query=Jeremy+Ethier+mountain+climbers'
      },
      {
        label: 'Burpee technique - ATHLEAN-X',
        url: 'https://www.youtube.com/results?search_query=ATHLEAN-X+burpee+form'
      }
    ]
  },
  {
    id: 'athlete-hiit-engine',
    title: 'Athlete HIIT Engine',
    description: 'Advanced conditioning with explosive intervals, strength bursts, and short rests.',
    category: 'Advanced',
    duration: 42,
    difficulty: 'Hard',
    calories: 520,
    targetMuscles: ['Full Body', 'Cardio'],
    exercises: ['Jump Squat', 'Push Press', 'Alternating Lunge Jump', 'Bear Crawl'],
    demoLinks: [
      {
        label: 'Jump squat cues - Jeff Nippard',
        url: 'https://www.youtube.com/results?search_query=Jeff+Nippard+jump+squat'
      },
      {
        label: 'Bear crawl demo - ATHLEAN-X',
        url: 'https://www.youtube.com/results?search_query=ATHLEAN-X+bear+crawl'
      }
    ]
  },
  {
    id: 'advanced-strength-complex',
    title: 'Advanced Strength Complex',
    description: 'Compound strength blocks that blend upper body, lower body, and core endurance.',
    category: 'Advanced',
    duration: 45,
    difficulty: 'Hard',
    calories: 480,
    targetMuscles: ['Full Body', 'Strength'],
    exercises: ['Front Squat', 'Romanian Deadlift', 'Push Press', 'Renegade Row'],
    demoLinks: [
      {
        label: 'RDL form - Jeff Nippard',
        url: 'https://www.youtube.com/results?search_query=Jeff+Nippard+romanian+deadlift'
      },
      {
        label: 'Push press demo - ScottHermanFitness',
        url: 'https://www.youtube.com/results?search_query=ScottHermanFitness+push+press'
      }
    ]
  },
  {
    id: 'sunrise-yoga-mobility',
    title: 'Sunrise Yoga Mobility',
    description: 'A refreshing yoga sequence for hips, spine, hamstrings, and mindful breathing.',
    category: 'Yoga',
    duration: 25,
    difficulty: 'Easy',
    calories: 110,
    targetMuscles: ['Mobility', 'Recovery'],
    exercises: ['Cat Cow', 'Downward Dog', 'Low Lunge', 'Hamstring Fold'],
    demoLinks: [
      {
        label: 'Morning yoga flow - Yoga With Adriene',
        url: 'https://www.youtube.com/results?search_query=Yoga+With+Adriene+morning+yoga'
      }
    ]
  },
  {
    id: 'deep-stretch-recovery',
    title: 'Deep Stretch Recovery',
    description: 'Slow holds and restorative movement to support recovery and flexibility.',
    category: 'Yoga',
    duration: 28,
    difficulty: 'Easy',
    calories: 95,
    targetMuscles: ['Recovery', 'Mobility'],
    exercises: ['Child Pose', 'Pigeon Stretch', 'Spinal Twist', 'Figure Four Stretch'],
    demoLinks: [
      {
        label: 'Recovery stretch demo - Yoga With Adriene',
        url: 'https://www.youtube.com/results?search_query=Yoga+With+Adriene+recovery+stretch'
      }
    ]
  },
  {
    id: 'zone-two-cardio',
    title: 'Zone Two Cardio',
    description: 'Steady endurance pacing with walk-jog intervals and simple heart-rate cues.',
    category: 'Cardio',
    duration: 35,
    difficulty: 'Medium',
    calories: 360,
    targetMuscles: ['Cardio'],
    exercises: ['Brisk Walk', 'Jog Interval', 'Step March', 'Cooldown Walk'],
    demoLinks: [
      {
        label: 'Running form basics - The Run Experience',
        url: 'https://www.youtube.com/results?search_query=The+Run+Experience+running+form'
      }
    ]
  },
  {
    id: 'quick-sweat-cardio',
    title: 'Quick Sweat Cardio',
    description: 'A compact cardio blast with jump-free options and crisp recovery windows.',
    category: 'Cardio',
    duration: 16,
    difficulty: 'Medium',
    calories: 210,
    targetMuscles: ['Cardio', 'Legs'],
    exercises: ['Fast Feet', 'Step Jack', 'Bodyweight Squat', 'Reverse Lunge'],
    demoLinks: [
      {
        label: 'Cardio blast demo - Pamela Reif',
        url: 'https://www.youtube.com/results?search_query=Pamela+Reif+cardio+workout'
      }
    ]
  },
  {
    id: 'functional-strength',
    title: 'Functional Strength',
    description: 'Push, pull, hinge, squat, and carry patterns designed for everyday strength.',
    category: 'Strength',
    duration: 38,
    difficulty: 'Medium',
    calories: 390,
    targetMuscles: ['Full Body', 'Strength'],
    exercises: ['Goblet Squat', 'Dumbbell Row', 'Romanian Deadlift', 'Farmer Carry'],
    demoLinks: [
      {
        label: 'Goblet squat form - Jeff Nippard',
        url: 'https://www.youtube.com/results?search_query=Jeff+Nippard+goblet+squat'
      },
      {
        label: 'Farmer carry demo - ATHLEAN-X',
        url: 'https://www.youtube.com/results?search_query=ATHLEAN-X+farmer+carry'
      }
    ]
  },
  {
    id: 'upper-body-strength',
    title: 'Upper Body Strength',
    description: 'Chest, back, shoulder, and arm training with scalable bodyweight variations.',
    category: 'Strength',
    duration: 34,
    difficulty: 'Medium',
    calories: 320,
    targetMuscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    exercises: ['Incline Push-Up', 'Band Row', 'Shoulder Tap', 'Bench Dip'],
    demoLinks: [
      {
        label: 'Bench dip demo - ScottHermanFitness',
        url: 'https://www.youtube.com/results?search_query=ScottHermanFitness+bench+dips'
      },
      {
        label: 'Band row setup - ATHLEAN-X',
        url: 'https://www.youtube.com/results?search_query=ATHLEAN-X+band+row'
      }
    ]
  },
  {
    id: 'barbell-bench-focus',
    title: 'Barbell Bench Focus',
    description: 'A chest day session focused on bench press strength, upper chest support, and triceps finishers.',
    category: 'Chest',
    duration: 48,
    difficulty: 'Medium',
    calories: 430,
    targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
    exercises: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Chest Fly', 'Cable Pushdown'],
    demoLinks: [
      {
        label: 'Bench press setup - Jeff Nippard',
        url: 'https://www.youtube.com/results?search_query=Jeff+Nippard+bench+press+technique'
      },
      {
        label: 'Chest fly demo - Jeremy Ethier',
        url: 'https://www.youtube.com/results?search_query=Jeremy+Ethier+chest+fly'
      }
    ]
  },
  {
    id: 'pull-day-mass-builder',
    title: 'Pull Day Mass Builder',
    description: 'A back and biceps gym workout built around rows, pulldowns, curls, and rear-delt work.',
    category: 'Back',
    duration: 50,
    difficulty: 'Medium',
    calories: 440,
    targetMuscles: ['Back', 'Biceps', 'Rear Delts'],
    exercises: ['Lat Pulldown', 'Barbell Row', 'Seated Cable Row', 'Barbell Curl'],
    demoLinks: [
      {
        label: 'Lat pulldown guide - ATHLEAN-X',
        url: 'https://learn.athleanx.com/articles/back-for-men/lat-pulldowns-bad-form-big-gains'
      },
      {
        label: 'Barbell curl demo - ScottHermanFitness',
        url: 'https://www.youtube.com/results?search_query=ScottHermanFitness+barbell+curl'
      }
    ]
  },
  {
    id: 'leg-day-power-session',
    title: 'Leg Day Power Session',
    description: 'Heavy lower-body work for quads, glutes, hamstrings, and calves with gym staples.',
    category: 'Legs',
    duration: 55,
    difficulty: 'Hard',
    calories: 520,
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
    exercises: ['Back Squat', 'Leg Press', 'Romanian Deadlift', 'Walking Lunge'],
    demoLinks: [
      {
        label: 'Squat form - Jeremy Ethier',
        url: 'https://www.youtube.com/results?search_query=Jeremy+Ethier+squat+form'
      },
      {
        label: 'Deadlift technique - ATHLEAN-X',
        url: 'https://www.youtube.com/results?search_query=ATHLEAN-X+deadlift+form'
      }
    ]
  },
  {
    id: 'shoulder-shape-builder',
    title: 'Shoulder Shape Builder',
    description: 'Front, side, and rear delt emphasis with presses, raises, and posture work.',
    category: 'Shoulders',
    duration: 40,
    difficulty: 'Medium',
    calories: 350,
    targetMuscles: ['Shoulders', 'Upper Back'],
    exercises: ['Seated Shoulder Press', 'Lateral Raise', 'Rear Delt Fly', 'Face Pull'],
    demoLinks: [
      {
        label: 'Shoulder press demo - ScottHermanFitness',
        url: 'https://www.youtube.com/watch?v=ECWxumBMLVQ'
      },
      {
        label: 'Lateral raise form - Jeff Nippard',
        url: 'https://www.youtube.com/results?search_query=Jeff+Nippard+lateral+raise'
      }
    ]
  },
  {
    id: 'arm-pump-primer',
    title: 'Arm Pump Primer',
    description: 'Biceps and triceps hypertrophy session built for visible arm growth and joint-friendly volume.',
    category: 'Arms',
    duration: 36,
    difficulty: 'Medium',
    calories: 280,
    targetMuscles: ['Biceps', 'Triceps', 'Forearms'],
    exercises: ['Barbell Curl', 'Hammer Curl', 'Skull Crusher', 'Cable Pushdown'],
    demoLinks: [
      {
        label: 'Biceps curl demo - ScottHermanFitness',
        url: 'https://www.youtube.com/results?search_query=ScottHermanFitness+barbell+curl'
      },
      {
        label: 'Skull crusher demo - Renaissance Periodization',
        url: 'https://www.youtube.com/results?search_query=Renaissance+Periodization+skull+crusher'
      }
    ]
  },
  {
    id: 'core-and-abs-carver',
    title: 'Core and Abs Carver',
    description: 'A gym-friendly abs session focused on trunk stability, anti-rotation, and visible core development.',
    category: 'Core',
    duration: 24,
    difficulty: 'Medium',
    calories: 190,
    targetMuscles: ['Abs', 'Obliques', 'Deep Core'],
    exercises: ['Cable Crunch', 'Hanging Knee Raise', 'Plank', 'Russian Twist'],
    demoLinks: [
      {
        label: 'Cable crunch demo - ATHLEAN-X',
        url: 'https://www.youtube.com/results?search_query=ATHLEAN-X+cable+crunch'
      },
      {
        label: 'Hanging knee raise form - Jeff Nippard',
        url: 'https://www.youtube.com/results?search_query=Jeff+Nippard+hanging+knee+raise'
      }
    ]
  }
];

module.exports = workouts;
