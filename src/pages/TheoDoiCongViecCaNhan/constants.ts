import type { TaskPriority, TaskStatus } from './types';

export const TASK_STORAGE_KEY = 'theo-doi-cong-viec-ca-nhan.tasks';

export const STATUS_COLUMNS: { key: TaskStatus; title: string; description: string }[] = [
	{ key: 'todo', title: 'Cần làm', description: 'Việc cần bắt đầu hoặc đang chờ xử lý' },
	{ key: 'doing', title: 'Đang làm', description: 'Các công việc đang triển khai' },
	{ key: 'done', title: 'Hoàn thành', description: 'Những việc đã hoàn tất' },
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
	todo: 'Cần làm',
	doing: 'Đang làm',
	done: 'Hoàn thành',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
	todo: 'gold',
	doing: 'processing',
	done: 'green',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
	high: 'Cao',
	medium: 'Trung bình',
	low: 'Thấp',
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
	high: 'red',
	medium: 'orange',
	low: 'blue',
};
