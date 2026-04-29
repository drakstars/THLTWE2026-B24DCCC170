import { CalendarOutlined, FireOutlined, RiseOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Empty, List, Progress, Row, Space, Statistic, Tag, Timeline, Typography } from 'antd';
import moment from 'moment';
import React, { useMemo } from 'react';

import { FitnessGoal, HealthMetric, WorkoutSession } from '../types';
import { calculateWorkoutStreak, getGoalCompletionPercent, getWeightTrend, getWeeklySessionsInMonth } from '../utils';

interface DashboardTabProps {
  sessions: WorkoutSession[];
  healthMetrics: HealthMetric[];
  goals: FitnessGoal[];
}

const chartCardStyle: React.CSSProperties = {
  minHeight: 280,
};

const DashboardTab: React.FC<DashboardTabProps> = ({ sessions, healthMetrics, goals }) => {
  const monthlySessions = useMemo(
    () => sessions.filter((item) => moment(item.date).isSame(moment(), 'month')).length,
    [sessions],
  );

  const monthlyCalories = useMemo(
    () =>
      sessions
        .filter((item) => moment(item.date).isSame(moment(), 'month') && item.status === 'Hoàn thành')
        .reduce((sum, item) => sum + item.calories, 0),
    [sessions],
  );

  const streak = useMemo(() => calculateWorkoutStreak(sessions), [sessions]);
  const goalCompletion = useMemo(() => getGoalCompletionPercent(goals), [goals]);
  const weeklyData = useMemo(() => getWeeklySessionsInMonth(sessions), [sessions]);
  const weightTrend = useMemo(() => getWeightTrend(healthMetrics), [healthMetrics]);

  const recentSessions = useMemo(
    () => [...sessions].sort((a, b) => moment(b.date).diff(moment(a.date))).slice(0, 5),
    [sessions],
  );

  const maxWeekValue = Math.max(...weeklyData.map((item) => item.value), 1);
  const maxWeight = Math.max(...weightTrend.map((item) => item.value), 1);
  const minWeight = Math.min(...weightTrend.map((item) => item.value), maxWeight);

  const linePoints = weightTrend
    .map((item, index) => {
      const x = weightTrend.length === 1 ? 50 : (index / (weightTrend.length - 1)) * 100;
      const denominator = maxWeight - minWeight || 1;
      const y = 100 - ((item.value - minWeight) / denominator) * 80 - 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tổng buổi tập trong tháng" value={monthlySessions} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tổng calo đã đốt" value={monthlyCalories} suffix="kcal" prefix={<FireOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Số ngày tập liên tiếp" value={streak} suffix="ngày" prefix={<RiseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Mục tiêu hoàn thành" value={goalCompletion} suffix="%" prefix={<TrophyOutlined />} />
            <Progress percent={goalCompletion} size="small" style={{ marginTop: 10 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Số buổi tập theo tuần" style={chartCardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, paddingTop: 16 }}>
              {weeklyData.map((item) => {
                const height = `${Math.max((item.value / maxWeekValue) * 140, 8)}px`;
                return (
                  <div key={item.label} style={{ flex: 1, textAlign: 'center' }}>
                    <Typography.Text strong>{item.value}</Typography.Text>
                    <div
                      style={{
                        height,
                        marginTop: 8,
                        borderRadius: 8,
                        background: 'linear-gradient(180deg, #36cfc9 0%, #08979c 100%)',
                      }}
                    />
                    <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                      {item.label}
                    </Typography.Text>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Biến động cân nặng" style={chartCardStyle}>
            {weightTrend.length === 0 ? (
              <Empty description="Chưa có dữ liệu cân nặng" />
            ) : (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: 180, overflow: 'visible' }}>
                  <polyline
                    fill="none"
                    stroke="#1677ff"
                    strokeWidth="2"
                    points={linePoints}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {weightTrend.map((item, index) => {
                    const x = weightTrend.length === 1 ? 50 : (index / (weightTrend.length - 1)) * 100;
                    const denominator = maxWeight - minWeight || 1;
                    const y = 100 - ((item.value - minWeight) / denominator) * 80 - 10;
                    return <circle key={`${item.label}-${item.value}`} cx={x} cy={y} r="1.8" fill="#1677ff" />;
                  })}
                </svg>

                <List
                  size="small"
                  dataSource={weightTrend}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text type="secondary">{item.label}</Typography.Text>
                      <Typography.Text strong>{item.value} kg</Typography.Text>
                    </List.Item>
                  )}
                />
              </Space>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="5 buổi tập gần nhất">
        {recentSessions.length === 0 ? (
          <Empty description="Chưa có buổi tập" />
        ) : (
          <Timeline mode="left">
            {recentSessions.map((item) => (
              <Timeline.Item
                key={item.id}
                label={moment(item.date).format('DD/MM/YYYY')}
                color={item.status === 'Hoàn thành' ? 'green' : 'red'}
              >
                <Space split={<span>|</span>} wrap>
                  <Typography.Text strong>{item.type}</Typography.Text>
                  <Typography.Text>{item.duration} phút</Typography.Text>
                  <Typography.Text>{item.calories} kcal</Typography.Text>
                  <Tag color={item.status === 'Hoàn thành' ? 'success' : 'error'}>{item.status}</Tag>
                </Space>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </Space>
  );
};

export default DashboardTab;
