import React, { useEffect } from 'react';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import type { TaskFormValues, TaskItem, TaskStatus } from '../types';
import { PRIORITY_LABELS, STATUS_LABELS } from '../constants';
import { normalizeTags } from '../utils';

type Props = {
	visible: boolean;
	initialTask?: TaskItem | null;
	defaultStatus: TaskStatus;
	onCancel: () => void;
	onSubmit: (values: TaskFormValues) => void;
};

const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }));
const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

const TaskFormModal: React.FC<Props> = ({ visible, initialTask, defaultStatus, onCancel, onSubmit }) => {
	const [form] = Form.useForm<TaskFormValues>();

	useEffect(() => {
		if (visible) {
			form.setFieldsValue({
				name: initialTask?.name || '',
				description: initialTask?.description || '',
				deadline: initialTask ? moment(initialTask.deadline) : moment().add(1, 'day'),
				priority: initialTask?.priority || 'medium',
				tags: initialTask?.tags || [],
				status: initialTask?.status || defaultStatus,
			});
		}
	}, [defaultStatus, form, initialTask, visible]);

	return (
		<Modal
			visible={visible}
			title={initialTask ? 'Chỉnh sửa task' : 'Thêm task mới'}
			onCancel={onCancel}
			onOk={() => form.submit()}
			okText={initialTask ? 'Cập nhật' : 'Tạo task'}
			destroyOnClose
			width={680}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={{ priority: 'medium', status: defaultStatus }}
				onFinish={(values) => {
					onSubmit({
						...values,
						tags: normalizeTags(values.tags),
					});
					form.resetFields();
				}}
			>
				<Form.Item
					name="name"
					label="Tên task"
					rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}
				>
					<Input placeholder="Ví dụ: Chuẩn bị tài liệu họp" />
				</Form.Item>
				<Form.Item name="description" label="Mô tả">
					<Input.TextArea rows={4} placeholder="Mô tả ngắn về nội dung cần làm" />
				</Form.Item>
				<Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}>
					<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
				</Form.Item>
				<Form.Item name="priority" label="Mức độ ưu tiên" rules={[{ required: true }]}> 
					<Select options={priorityOptions} />
				</Form.Item>
				<Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}> 
					<Select options={statusOptions} />
				</Form.Item>
				<Form.Item name="tags" label="Tag">
					<Select mode="tags" tokenSeparators={[',']} placeholder="Nhập tag rồi nhấn Enter" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaskFormModal;
