import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';

type Props = {
	totalTasks: number;
	completedTasks: number;
	overdueTasks: number;
};

const DashboardStats: React.FC<Props> = ({ totalTasks, completedTasks, overdueTasks }) => {
	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} md={8}>
				<Card>
					<Statistic title="Tổng số task" value={totalTasks} />
				</Card>
			</Col>
			<Col xs={24} md={8}>
				<Card>
					<Statistic title="Task hoàn thành" value={completedTasks} valueStyle={{ color: '#52c41a' }} />
				</Card>
			</Col>
			<Col xs={24} md={8}>
				<Card>
					<Statistic title="Task quá hạn" value={overdueTasks} valueStyle={{ color: '#ff4d4f' }} />
				</Card>
			</Col>
		</Row>
	);
};

export default DashboardStats;
