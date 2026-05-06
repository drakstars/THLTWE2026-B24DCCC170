import moment from 'moment';
import type { TaskItem, TaskPriority, TaskStatus } from './types';

export const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const normalizeTags = (tags: string[] = []) =>
	Array.from(new Set(tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)));

export const isTaskOverdue = (task: TaskItem) => {
	return task.status !== 'done' && moment(task.deadline).isBefore(moment(), 'day');
};

export const createSeedTasks = (): TaskItem[] => {
	const now = moment();

	const seed = [
		{
			name: 'Lập kế hoạch tuần mới',
			description: 'Rà soát các đầu việc quan trọng và sắp xếp thứ tự ưu tiên.',
			deadline: now.clone().add(1, 'day').endOf('day').toISOString(),
			priority: 'high' as TaskPriority,
			tags: ['Kế hoạch', 'Cá nhân'],
			status: 'todo' as TaskStatus,
		},
		{
			name: 'Hoàn thiện báo cáo tiến độ',
			description: 'Tổng hợp kết quả của các hạng mục đang triển khai trong tuần.',
			deadline: now.clone().add(3, 'day').endOf('day').toISOString(),
			priority: 'medium' as TaskPriority,
			tags: ['Công việc', 'Báo cáo'],
			status: 'doing' as TaskStatus,
		},
		{
			name: 'Gửi email xác nhận lịch hẹn',
			description: 'Kiểm tra lại lịch và xác nhận với các bên liên quan.',
			deadline: now.clone().subtract(2, 'day').endOf('day').toISOString(),
			priority: 'low' as TaskPriority,
			tags: ['Email', 'Theo dõi'],
			status: 'done' as TaskStatus,
		},
	];

	return seed.map((item) => ({
		id: createId(),
		createdAt: now.toISOString(),
		updatedAt: now.toISOString(),
		...item,
	}));
};
