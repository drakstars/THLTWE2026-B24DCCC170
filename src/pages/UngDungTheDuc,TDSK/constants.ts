import moment from 'moment';

import { Difficulty, Exercise, FitnessGoal, GoalStatus, GoalType, HealthMetric, MuscleGroup, WorkoutSession, WorkoutStatus, WorkoutType } from './types';
import { calculateBMI } from './utils';

export const WORKOUT_TYPES: WorkoutType[] = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
export const WORKOUT_STATUSES: WorkoutStatus[] = ['Hoàn thành', 'Bỏ lỡ'];

export const GOAL_TYPES: GoalType[] = ['Giảm cân', 'Tăng cơ', 'Cải thiện sức bền', 'Khác'];
export const GOAL_STATUSES: GoalStatus[] = ['Đang thực hiện', 'Đã đạt', 'Đã hủy'];

export const MUSCLE_GROUPS: MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
export const DIFFICULTIES: Difficulty[] = ['Dễ', 'Trung bình', 'Khó'];

export const DEFAULT_SESSIONS: WorkoutSession[] = [
  {
    id: 'ws-1',
    date: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    type: 'Cardio',
    duration: 45,
    calories: 420,
    note: 'Chạy bộ máy',
    status: 'Hoàn thành',
  },
  {
    id: 'ws-2',
    date: moment().subtract(2, 'day').format('YYYY-MM-DD'),
    type: 'Strength',
    duration: 60,
    calories: 500,
    note: 'Tập thân trên',
    status: 'Hoàn thành',
  },
  {
    id: 'ws-3',
    date: moment().subtract(4, 'day').format('YYYY-MM-DD'),
    type: 'Yoga',
    duration: 35,
    calories: 180,
    note: 'Phục hồi cơ bắp',
    status: 'Hoàn thành',
  },
  {
    id: 'ws-4',
    date: moment().subtract(6, 'day').format('YYYY-MM-DD'),
    type: 'HIIT',
    duration: 30,
    calories: 360,
    note: 'Bài tập cường độ cao',
    status: 'Hoàn thành',
  },
  {
    id: 'ws-5',
    date: moment().subtract(8, 'day').format('YYYY-MM-DD'),
    type: 'Cardio',
    duration: 40,
    calories: 390,
    note: 'Đạp xe',
    status: 'Bỏ lỡ',
  },
  {
    id: 'ws-6',
    date: moment().subtract(10, 'day').format('YYYY-MM-DD'),
    type: 'Strength',
    duration: 50,
    calories: 470,
    note: 'Lower body',
    status: 'Hoàn thành',
  },
];

const metricSeed = [
  { dayOffset: 21, weight: 72.4, heartRate: 71, sleep: 6.8 },
  { dayOffset: 16, weight: 71.8, heartRate: 69, sleep: 7.2 },
  { dayOffset: 12, weight: 71.5, heartRate: 68, sleep: 7.1 },
  { dayOffset: 8, weight: 71.0, heartRate: 67, sleep: 7.4 },
  { dayOffset: 4, weight: 70.7, heartRate: 66, sleep: 7.5 },
  { dayOffset: 1, weight: 70.4, heartRate: 65, sleep: 7.3 },
];

export const DEFAULT_HEALTH_METRICS: HealthMetric[] = metricSeed.map((item, index) => ({
  id: `hm-${index + 1}`,
  date: moment().subtract(item.dayOffset, 'day').format('YYYY-MM-DD'),
  weight: item.weight,
  height: 173,
  bmi: calculateBMI(item.weight, 173),
  restingHeartRate: item.heartRate,
  sleepHours: item.sleep,
}));

export const DEFAULT_GOALS: FitnessGoal[] = [
  {
    id: 'goal-1',
    name: 'Giảm 3kg trong 2 tháng',
    type: 'Giảm cân',
    targetValue: 3,
    currentValue: 1.8,
    deadline: moment().add(45, 'day').format('YYYY-MM-DD'),
    status: 'Đang thực hiện',
  },
  {
    id: 'goal-2',
    name: 'Nâng tạ 80kg squat',
    type: 'Tăng cơ',
    targetValue: 80,
    currentValue: 72,
    deadline: moment().add(60, 'day').format('YYYY-MM-DD'),
    status: 'Đang thực hiện',
  },
  {
    id: 'goal-3',
    name: 'Chạy 5km dưới 30 phút',
    type: 'Cải thiện sức bền',
    targetValue: 30,
    currentValue: 31.5,
    deadline: moment().add(25, 'day').format('YYYY-MM-DD'),
    status: 'Đang thực hiện',
  },
];

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Push-up cơ bản',
    muscleGroup: 'Chest',
    difficulty: 'Dễ',
    shortDescription: 'Tăng sức mạnh ngực và tay sau.',
    instructions: 'Đặt 2 tay rộng hơn vai một chút, giữ thân người thẳng, hạ ngực xuống gần sàn rồi đẩy lên.',
    caloriesPerHour: 360,
  },
  {
    id: 'ex-2',
    name: 'Squat',
    muscleGroup: 'Legs',
    difficulty: 'Trung bình',
    shortDescription: 'Bài tập tổng hợp cho thân dưới.',
    instructions: 'Đứng chân rộng bằng vai, đẩy hông ra sau, hạ người đến khi đùi song song sàn, dùng đẩy mạnh để đứng lên.',
    caloriesPerHour: 430,
  },
  {
    id: 'ex-3',
    name: 'Deadlift',
    muscleGroup: 'Back',
    difficulty: 'Khó',
    shortDescription: 'Phát triển lưng dưới và chuỗi cơ sau.',
    instructions: 'Giữ lưng thẳng, thanh đòn sát ống chân, đẩy hông và đứng lên bằng lực chân và hông.',
    caloriesPerHour: 510,
  },
  {
    id: 'ex-4',
    name: 'Plank',
    muscleGroup: 'Core',
    difficulty: 'Dễ',
    shortDescription: 'Ổn định thân giữa, cải thiện tư thế.',
    instructions: 'Chống khuỷu tay ngay dưới vai, ép bụng, giữ cơ thể thành đường thẳng trong 20-60 giây.',
    caloriesPerHour: 260,
  },
  {
    id: 'ex-5',
    name: 'Burpee',
    muscleGroup: 'Full Body',
    difficulty: 'Khó',
    shortDescription: 'Cardio toàn thân đốt calo cao.',
    instructions: 'Từ đứng hạ người xuống plank, bật chân về trước, bật nhảy lên cao và lặp lại liên tục.',
    caloriesPerHour: 700,
  },
  {
    id: 'ex-6',
    name: 'Overhead Press',
    muscleGroup: 'Shoulders',
    difficulty: 'Trung bình',
    shortDescription: 'Tăng sức mạnh vai và tay sau.',
    instructions: 'Cầm tạ ngang vai, ép bụng, đẩy tạ thẳng lên qua đầu, hạ xuống có kiểm soát.',
    caloriesPerHour: 380,
  },
  {
    id: 'ex-7',
    name: 'Bicep Curl',
    muscleGroup: 'Arms',
    difficulty: 'Dễ',
    shortDescription: 'Cô lập nhóm cơ tay trước.',
    instructions: 'Giữ khuỷu tay sát thân, gập tạ lên đến ngang vai, hạ xuống chậm rãi.',
    caloriesPerHour: 240,
  },
];
