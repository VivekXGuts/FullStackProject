const dailyChallenges = [
  {
    id: 'pushup-10',
    title: 'Complete 10 Pushups',
    description: 'Any variation counts: wall, knee, incline, or standard.',
    points: 75,
    category: 'Strength'
  },
  {
    id: 'walk-5000',
    title: 'Walk 5000 Steps',
    description: 'Take a brisk walk or split the steps across the day.',
    points: 90,
    category: 'Cardio'
  },
  {
    id: 'meditation-10',
    title: '10 Minute Meditation',
    description: 'Sit, breathe, and reset your mind for ten calm minutes.',
    points: 70,
    category: 'Wellness'
  },
  {
    id: 'water-check',
    title: 'Hydration Check',
    description: 'Drink water with two meals and log the habit.',
    points: 60,
    category: 'Wellness'
  },
  {
    id: 'mobility-8',
    title: '8 Minute Mobility Flow',
    description: 'Move through hips, shoulders, ankles, and spine.',
    points: 65,
    category: 'Yoga'
  }
];

function getDailyChallenge(date = new Date()) {
  const daySeed = Math.floor(date.setHours(0, 0, 0, 0) / 86400000);
  return dailyChallenges[daySeed % dailyChallenges.length];
}

module.exports = { dailyChallenges, getDailyChallenge };
