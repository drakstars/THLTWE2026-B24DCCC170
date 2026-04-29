import moment from 'moment';

import { FitnessGoal, HealthMetric, WorkoutSession } from './types';

export const STORAGE_KEYS = {
  sessions: 'fitness_sessions',
  metrics: 'fitness_health_metrics',
  goals: 'fitness_goals',
  exercises: 'fitness_exercises',
};

export const calculateBMI = (weight: number, heightCm: number): number => {
  if (!weight || !heightCm) return 0;
  const heightM = heightCm / 100;
  return Number((weight / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' };
  if (bmi < 25) return { label: 'Bình thường', color: 'green' };
  if (bmi < 30) return { label: 'Thừa cân', color: 'gold' };
  return { label: 'Béo phì', color: 'red' };
};

export const calculateWorkoutStreak = (sessions: WorkoutSession[]): number => {
  const completedDates = Array.from(
    new Set(sessions.filter((item) => item.status === 'Hoàn thành').map((item) => item.date)),
  ).sort((a, b) => moment(b).diff(moment(a)));

  if (completedDates.length === 0) return 0;

  const latestDate = moment(completedDates[0]);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');

  if (!latestDate.isSame(today, 'day') && !latestDate.isSame(yesterday, 'day')) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < completedDates.length; i += 1) {
    const prev = moment(completedDates[i - 1]);
    const current = moment(completedDates[i]);
    const diff = prev.startOf('day').diff(current.startOf('day'), 'days');
    if (diff === 1) {
      streak += 1;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
};

export const getWeeklySessionsInMonth = (sessions: WorkoutSession[]) => {
  const monthSessions = sessions.filter((item) => moment(item.date).isSame(moment(), 'month'));
  const weekData: Record<string, number> = {
    'Tuần 1': 0,
    'Tuần 2': 0,
    'Tuần 3': 0,
    'Tuần 4': 0,
    'Tuần 5': 0,
  };

  monthSessions.forEach((item) => {
    const dayOfMonth = moment(item.date).date();
    const week = Math.min(Math.ceil(dayOfMonth / 7), 5);
    const key = `Tuần ${week}`;
    weekData[key] += 1;
  });

  return Object.entries(weekData).map(([label, value]) => ({ label, value }));
};

export const getGoalCompletionPercent = (goals: FitnessGoal[]): number => {
  const activeGoals = goals.filter((goal) => goal.status !== 'Đã hủy');
  if (activeGoals.length === 0) return 0;

  const totalPercent = activeGoals.reduce((sum, goal) => {
    if (goal.targetValue <= 0) return sum;
    const percent = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
    return sum + percent;
  }, 0);

  return Math.round(totalPercent / activeGoals.length);
};

export const getWeightTrend = (metrics: HealthMetric[]) => {
  return [...metrics]
    .sort((a, b) => moment(a.date).diff(moment(b.date)))
    .map((item) => ({
      label: moment(item.date).format('DD/MM'),
      value: item.weight,
    }));
};
