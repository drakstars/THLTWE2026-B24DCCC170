import { Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

import { BlogTag } from '../types';
import { slugify } from '../utils/helpers';

interface TagFormModalProps {
	visible: boolean;
	editingTag?: BlogTag;
	onCancel: () => void;
	onSubmit: (value: BlogTag) => void;
}

const TagFormModal: React.FC<TagFormModalProps> = ({
	visible,
	editingTag,
	onCancel,
	onSubmit,
}) => {
	const [form] = Form.useForm<{ name: string }>();

	useEffect(() => {
		if (!visible) {
			return;
		}

		form.setFieldsValue({ name: editingTag?.name || '' });
	}, [editingTag, form, visible]);

	return (
		<Modal
			destroyOnClose
			visible={visible}
			title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ'}
			onCancel={onCancel}
			onOk={() => form.submit()}
		>
			<Form
				form={form}
				layout='vertical'
				onFinish={(values) => {
					const name = values.name.trim();
					onSubmit({
						id: editingTag?.id || slugify(name),
						name,
					});
				}}
			>
				<Form.Item
					name='name'
					label='Tên thẻ'
					rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
				>
					<Input placeholder='Ví dụ: React' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TagFormModal;
