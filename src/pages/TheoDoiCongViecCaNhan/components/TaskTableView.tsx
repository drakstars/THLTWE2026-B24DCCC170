import React from 'react';
import { Button, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/lib/table';
import type { TaskItem, TaskPriority, TaskStatus } from '../types';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../constants';
import { isTaskOverdue } from '../utils';

const { Text } = Typography;

type Props = {
	tasks: TaskItem[];
	searchValue: string;
	statusFilter: TaskStatus | 'all';
	onSearchChange: (value: string) => void;
	onStatusFilterChange: (value: TaskStatus | 'all') => void;
	onEditTask: (task: TaskItem) => void;
	onDeleteTask: (taskId: string) => void;
};

const prioritySorter = (a: TaskItem, b: TaskItem) => {
	const order: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
	return order[a.priority] - order[b.priority];
};

const TaskTableView: React.FC<Props> = ({
	tasks,
	searchValue,
	statusFilter,
	onSearchChange,
	onStatusFilterChange,
	onEditTask,
	onDeleteTask,
}) => {
	const columns: ColumnsType<TaskItem> = [
		{
			title: 'Tên task',
			dataIndex: 'name',
			render: (value: string, record) => (
				<Space direction="vertical" size={0}>
					<Text strong>{value}</Text>
					<Text type="secondary">{record.description || 'Không có mô tả'}</Text>
				</Space>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (value: TaskStatus) => <Tag color={STATUS_COLORS[value]}>{STATUS_LABELS[value]}</Tag>,
			filters: Object.entries(STATUS_LABELS).map(([value, label]) => ({ text: label, value })),
			onFilter: (value, record) => record.status === value,
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			render: (value: TaskPriority) => <Tag color={PRIORITY_COLORS[value]}>{PRIORITY_LABELS[value]}</Tag>,
			sorter: prioritySorter,
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			render: (value: string, record) => (
				<Space direction="vertical" size={0}>
					<Text type={isTaskOverdue(record) ? 'danger' : undefined}>{moment(value).format('DD/MM/YYYY')}</Text>
					{isTaskOverdue(record) ? <Text type="danger">Quá hạn</Text> : null}
				</Space>
			),
			sorter: (a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf(),
			defaultSortOrder: 'ascend',
		},
		{
			title: 'Tag',
			dataIndex: 'tags',
			render: (value: string[]) => (
				<Space wrap>
					{value.length ? value.map((tag) => <Tag key={tag}>{tag}</Tag>) : <Text type="secondary">Không có</Text>}
				</Space>
			),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => onEditTask(record)}>
						Sửa
					</Button>
					<Button danger icon={<DeleteOutlined />} onClick={() => onDeleteTask(record.id)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<Space direction="vertical" style={{ width: '100%' }} size={16}>
			<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
				<Input.Search
					allowClear
					placeholder="Tìm theo tên task"
					value={searchValue}
					onChange={(event) => onSearchChange(event.target.value)}
					style={{ maxWidth: 360 }}
				/>
				<Select
					value={statusFilter}
					style={{ width: 220 }}
					options={[
						{ label: 'Tất cả trạng thái', value: 'all' },
						...Object.entries(STATUS_LABELS).map(([value, label]) => ({ label, value })),
					]}
					onChange={onStatusFilterChange}
				/>
			</Space>
			<Table<TaskItem> rowKey="id" columns={columns} dataSource={tasks} pagination={{ pageSize: 8 }} />
		</Space>
	);
};

export default TaskTableView;
