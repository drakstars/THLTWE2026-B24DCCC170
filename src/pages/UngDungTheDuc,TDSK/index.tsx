import { PageContainer } from '@ant-design/pro-layout';
import { message, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

import {
  DEFAULT_EXERCISES,
  DEFAULT_GOALS,
  DEFAULT_HEALTH_METRICS,
  DEFAULT_SESSIONS,
} from './constants';
import DashboardTab from './components/DashboardTab';
import ExerciseLibraryTab from './components/ExerciseLibraryTab';
import GoalsTab from './components/GoalsTab';
import HealthMetricsTab from './components/HealthMetricsTab';
import WorkoutLogTab from './components/WorkoutLogTab';
import { Exercise, FitnessGoal, HealthMetric, WorkoutSession } from './types';
import { STORAGE_KEYS } from './utils';

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const UngDungTheDucTDSK: React.FC = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.sessions);
    return raw ? JSON.parse(raw) : DEFAULT_SESSIONS;
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.metrics);
    return raw ? JSON.parse(raw) : DEFAULT_HEALTH_METRICS;
  });

  const [goals, setGoals] = useState<FitnessGoal[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.goals);
    return raw ? JSON.parse(raw) : DEFAULT_GOALS;
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.exercises);
    return raw ? JSON.parse(raw) : DEFAULT_EXERCISES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.metrics, JSON.stringify(healthMetrics));
  }, [healthMetrics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.exercises, JSON.stringify(exercises));
  }, [exercises]);

  const handleCreateSession = (payload: Omit<WorkoutSession, 'id'>) => {
    setSessions((prev) => [...prev, { ...payload, id: createId('session') }]);
    message.success('Thêm buổi tập thành công');
  };

  const handleUpdateSession = (id: string, payload: Omit<WorkoutSession, 'id'>) => {
    setSessions((prev) => prev.map((item) => (item.id === id ? { ...payload, id } : item)));
    message.success('Cập nhật buổi tập thành công');
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((item) => item.id !== id));
    message.success('Đã xóa buổi tập');
  };

  const handleCreateMetric = (payload: Omit<HealthMetric, 'id'>) => {
    setHealthMetrics((prev) => [...prev, { ...payload, id: createId('metric') }]);
    message.success('Thêm chỉ số sức khỏe thành công');
  };

  const handleUpdateMetric = (id: string, payload: Omit<HealthMetric, 'id'>) => {
    setHealthMetrics((prev) => prev.map((item) => (item.id === id ? { ...payload, id } : item)));
    message.success('Cập nhật chỉ số thành công');
  };

  const handleDeleteMetric = (id: string) => {
    setHealthMetrics((prev) => prev.filter((item) => item.id !== id));
    message.success('Đã xóa chỉ số sức khỏe');
  };

  const handleCreateGoal = (payload: Omit<FitnessGoal, 'id'>) => {
    setGoals((prev) => [...prev, { ...payload, id: createId('goal') }]);
    message.success('Thêm mục tiêu thành công');
  };

  const handleUpdateGoal = (id: string, payload: Omit<FitnessGoal, 'id'>) => {
    setGoals((prev) => prev.map((item) => (item.id === id ? { ...payload, id } : item)));
    message.success('Cập nhật mục tiêu thành công');
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((item) => item.id !== id));
    message.success('Đã xóa mục tiêu');
  };

  const handleCreateExercise = (payload: Omit<Exercise, 'id'>) => {
    setExercises((prev) => [...prev, { ...payload, id: createId('exercise') }]);
    message.success('Thêm bài tập thành công');
  };

  const handleUpdateExercise = (id: string, payload: Omit<Exercise, 'id'>) => {
    setExercises((prev) => prev.map((item) => (item.id === id ? { ...payload, id } : item)));
    message.success('Cập nhật bài tập thành công');
  };

  const handleDeleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((item) => item.id !== id));
    message.success('Đã xóa bài tập');
  };

  return (
    <PageContainer title={<span>Ứng dụng thể dục, theo dõi sức khỏe</span>}>
      <Tabs defaultActiveKey="dashboard" destroyInactiveTabPane>
        <Tabs.TabPane tab="Dashboard" key="dashboard">
          <DashboardTab sessions={sessions} healthMetrics={healthMetrics} goals={goals} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Nhật ký tập luyện" key="workout-log">
          <WorkoutLogTab
            sessions={sessions}
            onCreate={handleCreateSession}
            onUpdate={handleUpdateSession}
            onDelete={handleDeleteSession}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Nhật ký chỉ số sức khỏe" key="health-metrics">
          <HealthMetricsTab
            metrics={healthMetrics}
            onCreate={handleCreateMetric}
            onUpdate={handleUpdateMetric}
            onDelete={handleDeleteMetric}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Quản lý mục tiêu" key="goals">
          <GoalsTab goals={goals} onCreate={handleCreateGoal} onUpdate={handleUpdateGoal} onDelete={handleDeleteGoal} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thư viện bài tập" key="exercise-library">
          <ExerciseLibraryTab
            exercises={exercises}
            onCreate={handleCreateExercise}
            onUpdate={handleUpdateExercise}
            onDelete={handleDeleteExercise}
          />
        </Tabs.TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default UngDungTheDucTDSK;
