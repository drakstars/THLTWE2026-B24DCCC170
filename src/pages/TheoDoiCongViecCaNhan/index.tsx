import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Divider, Empty, Modal, Space, Tabs, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import DashboardStats from './components/DashboardStats';
import TaskFormModal from './components/TaskFormModal';
import TaskKanbanBoard from './components/TaskKanbanBoard';
import TaskTableView from './components/TaskTableView';
import { TASK_STORAGE_KEY } from './constants';
import type { TaskFormValues, TaskItem, TaskStatus } from './types';
import { createId, createSeedTasks, isTaskOverdue } from './utils';
import './style.less';

const statusOrder: TaskStatus[] = ['todo', 'doing', 'done'];
const { TabPane } = Tabs;

const TheoDoiCongViecCaNhan: React.FC = () => {
	const [tasks, setTasks] = useState<TaskItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [formVisible, setFormVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
	const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
	const [tableSearch, setTableSearch] = useState('');
	const [tableStatusFilter, setTableStatusFilter] = useState<TaskStatus | 'all'>('all');
	const [activeTab, setActiveTab] = useState('dashboard');

	useEffect(() => {
		const storedTasks = localStorage.getItem(TASK_STORAGE_KEY);
		if (storedTasks) {
			try {
				setTasks(JSON.parse(storedTasks));
			} catch {
				setTasks(createSeedTasks());
			}
		} else {
			setTasks(createSeedTasks());
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		if (!loading) {
			localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
		}
	}, [loading, tasks]);

	const orderedTasks = useMemo(() => {
		return [...tasks].sort((a, b) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt)));
	}, [tasks]);

	const tasksByStatus = useMemo(() => {
		return statusOrder.reduce<Record<TaskStatus, TaskItem[]>>(
			(acc, status) => {
				acc[status] = orderedTasks.filter((task) => task.status === status);
				return acc;
			},
			{ todo: [], doing: [], done: [] },
		);
	}, [orderedTasks]);

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((task) => task.status === 'done').length;
	const overdueTasks = tasks.filter(isTaskOverdue).length;

	const filteredTableTasks = useMemo(() => {
		return tasks.filter((task) => {
			const matchesSearch = task.name.toLowerCase().includes(tableSearch.trim().toLowerCase());
			const matchesStatus = tableStatusFilter === 'all' ? true : task.status === tableStatusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [tableSearch, tableStatusFilter, tasks]);

	const openCreateModal = (status: TaskStatus = 'todo') => {
		setEditingTask(null);
		setDefaultStatus(status);
		setFormVisible(true);
	};

	const handleSubmitTask = (values: TaskFormValues) => {
		const deadline = values.deadline.toISOString();
		const now = new Date().toISOString();

		if (editingTask) {
			setTasks((currentTasks) =>
				currentTasks.map((task) =>
					task.id === editingTask.id
						? {
							...task,
							name: values.name,
							description: values.description,
							deadline,
							priority: values.priority,
							tags: values.tags,
							status: values.status,
							updatedAt: now,
						}
						: task,
				),
			);
			message.success('Đã cập nhật task');
		} else {
			setTasks((currentTasks) => [
				{
					id: createId(),
					name: values.name,
					description: values.description,
					deadline,
					priority: values.priority,
					tags: values.tags,
					status: values.status,
					createdAt: now,
					updatedAt: now,
				},
				...currentTasks,
			]);
			message.success('Đã thêm task mới');
		}

		setEditingTask(null);
		setFormVisible(false);
	};

	const handleDeleteTask = (taskId: string) => {
		Modal.confirm({
			title: 'Xóa task',
			content: 'Bạn có chắc chắn muốn xóa task này không?',
			okText: 'Xóa',
			cancelText: 'Hủy',
			onOk: () => {
				setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
				message.success('Đã xóa task');
			},
		});
	};

	const handleEditTask = (task: TaskItem) => {
		setEditingTask(task);
		setDefaultStatus(task.status);
		setFormVisible(true);
	};

	const handleDragEnd = (result: DropResult) => {
		const { source, destination, draggableId } = result;
		if (!destination) return;
		if (source.droppableId === destination.droppableId && source.index === destination.index) return;

		setTasks((currentTasks) =>
			currentTasks.map((task) =>
				task.id === draggableId
					? {
						...task,
						status: destination.droppableId as TaskStatus,
						updatedAt: new Date().toISOString(),
					}
					: task,
			),
		);
	};

	return (
		<div className="task-page">
			<div className="task-page__hero">
				<h1 className="task-page__hero-title">Theo dõi công việc cá nhân</h1>
				<p className="task-page__hero-subtitle">
					Quản lý công việc theo kiểu Kanban, xem nhanh thống kê, lọc danh sách task và lưu dữ liệu trực tiếp
					sang trình duyệt bằng localStorage.
				</p>
				<Space wrap>
					<Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateModal()}>
						Thêm task
					</Button>
					<Button ghost onClick={() => setActiveTab('kanban')}>Xem bảng Kanban</Button>
				</Space>
			</div>

			<DashboardStats totalTasks={totalTasks} completedTasks={completedTasks} overdueTasks={overdueTasks} />

			<Divider />

			<Tabs
				activeKey={activeTab}
				onChange={setActiveTab}
				tabBarStyle={{ marginBottom: 24 }}
			>
				<TabPane tab="Tổng quan" key="dashboard">
					<Card>
						<Empty
							description="Chọn các tab bên dưới để làm việc với bảng Kanban hoặc danh sách task"
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						/>
					</Card>
				</TabPane>
				<TabPane tab="Kanban Board" key="kanban">
					<Card>
						<DragDropContext onDragEnd={handleDragEnd}>
							<TaskKanbanBoard
								tasksByStatus={tasksByStatus}
								onAddTask={openCreateModal}
								onEditTask={handleEditTask}
							/>
						</DragDropContext>
					</Card>
				</TabPane>
				<TabPane tab="Danh sách task" key="table">
					<Card>
						<TaskTableView
							tasks={filteredTableTasks}
							searchValue={tableSearch}
							statusFilter={tableStatusFilter}
							onSearchChange={setTableSearch}
							onStatusFilterChange={setTableStatusFilter}
							onEditTask={handleEditTask}
							onDeleteTask={handleDeleteTask}
						/>
					</Card>
				</TabPane>
			</Tabs>

			<TaskFormModal
				visible={formVisible}
				initialTask={editingTask}
				defaultStatus={defaultStatus}
				onCancel={() => {
					setFormVisible(false);
					setEditingTask(null);
				}}
				onSubmit={handleSubmitTask}
			/>
		</div>
	);
};

export default TheoDoiCongViecCaNhan;
