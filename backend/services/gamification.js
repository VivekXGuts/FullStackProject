const LEVELS = [
  { level: 1, points: 0 },
  { level: 2, points: 500 },
  { level: 3, points: 1000 },
  { level: 4, points: 2000 }
];

const BADGES = {
  BEGINNER: 'Beginner Badge',
  CONSISTENCY: 'Consistency Badge',
  STREAK_7: '7-Day Streak Badge',
  POINTS_1000: '1000 Points Badge'
};

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(previousKey, currentKey) {
  if (!previousKey) return null;
  const previous = new Date(`${previousKey}T00:00:00.000Z`);
  const current = new Date(`${currentKey}T00:00:00.000Z`);
  return Math.round((current - previous) / 86400000);
}

function isDateKey(value, key) {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).startsWith(key);
  return date.toISOString().slice(0, 10) === key;
}

function calculateLevel(points = 0) {
  return LEVELS.reduce((currentLevel, levelConfig) => {
    return points >= levelConfig.points ? levelConfig.level : currentLevel;
  }, 1);
}

function levelProgress(points = 0) {
  const currentLevel = calculateLevel(points);
  const currentThreshold = LEVELS.find((item) => item.level === currentLevel)?.points || 0;
  const nextThreshold = LEVELS.find((item) => item.level === currentLevel + 1)?.points;

  if (!nextThreshold) {
    return {
      currentLevel,
      currentThreshold,
      nextThreshold: null,
      percent: 100,
      remaining: 0
    };
  }

  const percent = Math.min(
    100,
    Math.round(((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
  );

  return {
    currentLevel,
    currentThreshold,
    nextThreshold,
    percent,
    remaining: nextThreshold - points
  };
}

function applyActivity(user, { type, title, basePoints, metadata = {}, completedAt = new Date() }) {
  const today = dateKey(completedAt);
  const gap = daysBetween(user.lastActivityDate, today);
  let streak = user.streak || 0;
  let streakBonus = 0;

  if (gap === 0) {
    streak = user.streak || 1;
  } else if (gap === 1) {
    streak += 1;
    streakBonus = Math.min(100, streak * 10);
  } else {
    streak = 1;
  }

  const pointsAwarded = basePoints + streakBonus;
  const nextPoints = (user.points || 0) + pointsAwarded;
  const completedToday = activitiesForDate(user.activityHistory || [], today).length + 1;
  let dailyGoalBonus = 0;

  if (completedToday === (user.dailyGoal || 2)) {
    dailyGoalBonus = 100;
  }

  const finalPoints = nextPoints + dailyGoalBonus;
  const badges = new Set(user.badges || [BADGES.BEGINNER]);
  badges.add(BADGES.BEGINNER);

  if (streak >= 3 || (user.completedWorkouts || []).length >= 3) badges.add(BADGES.CONSISTENCY);
  if (streak >= 7) badges.add(BADGES.STREAK_7);
  if (finalPoints >= 1000) badges.add(BADGES.POINTS_1000);

  const pointsHistory = [
    ...(user.pointsHistory || []),
    {
      points: basePoints,
      reason: title,
      date: completedAt.toISOString()
    }
  ];

  if (streakBonus > 0) {
    pointsHistory.push({
      points: streakBonus,
      reason: `${streak}-day streak bonus`,
      date: completedAt.toISOString()
    });
  }

  if (dailyGoalBonus > 0) {
    pointsHistory.push({
      points: dailyGoalBonus,
      reason: 'Daily goal completed',
      date: completedAt.toISOString()
    });
  }

  const activityHistory = [
    {
      type,
      title,
      points: pointsAwarded + dailyGoalBonus,
      metadata,
      completedAt: completedAt.toISOString()
    },
    ...(user.activityHistory || [])
  ].slice(0, 30);

  return {
    ...user,
    points: finalPoints,
    level: calculateLevel(finalPoints),
    badges: Array.from(badges),
    streak,
    longestStreak: Math.max(user.longestStreak || 0, streak),
    lastActivityDate: today,
    pointsHistory,
    activityHistory,
    rewards: {
      pointsAwarded,
      streakBonus,
      dailyGoalBonus,
      badges: Array.from(badges),
      level: calculateLevel(finalPoints)
    }
  };
}

function activitiesForDate(activityHistory, key) {
  return activityHistory.filter((activity) => isDateKey(activity.completedAt, key));
}

function dashboardMetrics(user, rank) {
  const today = dateKey();
  const workouts = user.completedWorkouts || [];
  const history = user.activityHistory || [];
  const dailyLogs = user.dailyLogs || [];
  const todayActivities = activitiesForDate(history, today);
  const weeklyDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return dateKey(date);
  });

  const weeklyProgress = weeklyDates.map((key) => ({
    date: key,
    count: history.filter((activity) => isDateKey(activity.completedAt, key)).length,
    points: (user.pointsHistory || [])
      .filter((entry) => isDateKey(entry.date, key))
      .reduce((total, entry) => total + entry.points, 0)
  }));

  const latestLog = dailyLogs[0] || null;
  const averageSleep = dailyLogs.length
    ? Number((dailyLogs.reduce((total, log) => total + (log.sleepHours || 0), 0) / dailyLogs.length).toFixed(1))
    : 0;
  const averageRecovery = dailyLogs.length
    ? Math.round(dailyLogs.reduce((total, log) => total + (log.recoveryRate || 0), 0) / dailyLogs.length)
    : 0;

  return {
    dailyGoal: user.dailyGoal || 2,
    dailyGoalCompleted: todayActivities.length,
    dailyGoalPercent: Math.min(100, Math.round((todayActivities.length / (user.dailyGoal || 2)) * 100)),
    completedWorkouts: workouts.length,
    totalCalories: workouts.reduce((total, workout) => total + (workout.calories || 0), 0),
    totalMinutes: workouts.reduce((total, workout) => total + (workout.duration || 0), 0),
    latestRecoveryRate: latestLog?.recoveryRate || 0,
    latestSleepHours: latestLog?.sleepHours || 0,
    averageSleep,
    averageRecovery,
    levelProgress: levelProgress(user.points || 0),
    weeklyProgress,
    rank
  };
}

module.exports = {
  LEVELS,
  BADGES,
  calculateLevel,
  levelProgress,
  applyActivity,
  dashboardMetrics
};
