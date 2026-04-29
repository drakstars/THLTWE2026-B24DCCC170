export type WorkoutType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
export type WorkoutStatus = 'Hoàn thành' | 'Bỏ lỡ';

export interface WorkoutSession {
  id: string;
  date: string;
  type: WorkoutType;
  duration: number;
  calories: number;
  note?: string;
  status: WorkoutStatus;
}

export interface HealthMetric {
  id: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
  restingHeartRate: number;
  sleepHours: number;
}

export type GoalType = 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
export type GoalStatus = 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';

export interface FitnessGoal {
  id: string;
  name: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: GoalStatus;
}

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Full Body';

export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  shortDescription: string;
  instructions: string;
  caloriesPerHour: number;
}
