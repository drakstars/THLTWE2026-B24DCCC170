import React from 'react';
import { Badge, Button, Card, Empty, Space, Tag, Typography } from 'antd';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { TaskItem, TaskStatus } from '../types';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLUMNS, STATUS_LABELS } from '../constants';
import { isTaskOverdue } from '../utils';

const { Text, Paragraph } = Typography;

type Props = {
	tasksByStatus: Record<TaskStatus, TaskItem[]>;
	onAddTask: (status?: TaskStatus) => void;
	onEditTask: (task: TaskItem) => void;
};

const TaskKanbanBoard: React.FC<Props> = ({ tasksByStatus, onAddTask, onEditTask }) => {
	return (
		<div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
			{STATUS_COLUMNS.map((column) => {
				const columnTasks = tasksByStatus[column.key] || [];

				return (
					<Card
						key={column.key}
						title={
							<Space>
								<span>{column.title}</span>
								<Badge count={columnTasks.length} style={{ backgroundColor: '#1890ff' }} />
							</Space>
						}
						extra={<Button icon={<PlusOutlined />} onClick={() => onAddTask(column.key)}>Thêm</Button>}
					>
						<Droppable droppableId={column.key}>
							{(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 140 }}>
									<Paragraph type="secondary" style={{ marginBottom: 16 }}>
										{column.description}
									</Paragraph>
									{columnTasks.length === 0 ? (
										<Empty description="Chưa có task" image={Empty.PRESENTED_IMAGE_SIMPLE} />
									) : null}
									<Space direction="vertical" style={{ width: '100%' }} size={12}>
										{columnTasks.map((task, index) => (
											<Draggable draggableId={task.id} index={index} key={task.id}>
												{(draggableProvided, snapshot) => (
													<Card
														ref={draggableProvided.innerRef}
														{...draggableProvided.draggableProps}
														{...draggableProvided.dragHandleProps}
														style={{
															...draggableProvided.draggableProps.style,
															borderColor: snapshot.isDragging ? '#1890ff' : undefined,
															boxShadow: snapshot.isDragging ? '0 8px 24px rgba(24, 144, 255, 0.18)' : undefined,
														}}>
														<Space direction="vertical" style={{ width: '100%' }} size={8}>
															<Space style={{ justifyContent: 'space-between', width: '100%' }}>
																<Text strong>{task.name}</Text>
																<Button type="link" icon={<EditOutlined />} onClick={() => onEditTask(task)}>
																	Sửa
																</Button>
															</Space>
															{task.description ? <Text type="secondary">{task.description}</Text> : null}
															<Space size={6} wrap>
																<Tag color={PRIORITY_COLORS[task.priority]}>{PRIORITY_LABELS[task.priority]}</Tag>
																<Tag color={isTaskOverdue(task) ? 'red' : 'blue'}>
																	{moment(task.deadline).format('DD/MM/YYYY')}
																</Tag>
																<Tag color="geekblue">{STATUS_LABELS[task.status]}</Tag>
															</Space>
															{task.tags.length ? (
																<Space size={4} wrap>
																	{task.tags.map((tag) => (
																		<Tag key={tag}>{tag}</Tag>
																	))}
																</Space>
															) : null}
														</Space>
													</Card>
												)}
											</Draggable>
										))}
									</Space>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</Card>
				);
			})}
		</div>
	);
};

export default TaskKanbanBoard;
