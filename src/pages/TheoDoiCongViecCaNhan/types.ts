import type moment from 'moment';

export type TaskStatus = 'todo' | 'doing' | 'done';

export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskItem = {
	id: string;
	name: string;
	description: string;
	deadline: string;
	priority: TaskPriority;
	tags: string[];
	status: TaskStatus;
	createdAt: string;
	updatedAt: string;
};

export type TaskFormValues = {
	name: string;
	description: string;
	deadline: moment.Moment;
	priority: TaskPriority;
	tags: string[];
	status: TaskStatus;
};
