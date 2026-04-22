import { Form, Input, Modal, Select } from 'antd';
import React, { useEffect } from 'react';

import { BlogPost, BlogTag, PostStatus } from '../types';
import { slugify } from '../utils/helpers';

interface PostFormValue {
	title: string;
	slug: string;
	content: string;
	coverImage: string;
	tags: string[];
	status: PostStatus;
}

interface PostFormModalProps {
	visible: boolean;
	tags: BlogTag[];
	editingPost?: BlogPost;
	onCancel: () => void;
	onSubmit: (values: PostFormValue) => void;
}

const PostFormModal: React.FC<PostFormModalProps> = ({
	visible,
	tags,
	editingPost,
	onCancel,
	onSubmit,
}) => {
	const [form] = Form.useForm<PostFormValue>();

	useEffect(() => {
		if (!visible) {
			return;
		}

		if (editingPost) {
			form.setFieldsValue({
				title: editingPost.title,
				slug: editingPost.slug,
				content: editingPost.content,
				coverImage: editingPost.coverImage,
				tags: editingPost.tags,
				status: editingPost.status,
			});
		} else {
			form.setFieldsValue({
				title: '',
				slug: '',
				content: '',
				coverImage: '',
				tags: [],
				status: 'draft',
			});
		}
	}, [editingPost, form, visible]);

	return (
		<Modal
			destroyOnClose
			visible={visible}
			title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}
			onCancel={onCancel}
			onOk={() => form.submit()}
			width={900}
		>
			<Form
				form={form}
				layout='vertical'
				onFinish={onSubmit}
				onValuesChange={(changedValues) => {
					if (!editingPost && changedValues.title) {
						form.setFieldsValue({ slug: slugify(changedValues.title) });
					}
				}}
			>
				<Form.Item
					name='title'
					label='Tiêu đề'
					rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
				>
					<Input placeholder='Nhập tiêu đề bài viết' />
				</Form.Item>
				<Form.Item
					name='slug'
					label='Slug'
					rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
				>
					<Input placeholder='Ví dụ: bai-viet-dau-tien' />
				</Form.Item>
				<Form.Item
					name='coverImage'
					label='Ảnh đại diện (URL)'
					rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
				>
					<Input placeholder='https://...' />
				</Form.Item>
				<Form.Item name='tags' label='Thẻ'>
					<Select mode='multiple' placeholder='Chọn thẻ'>
						{tags.map((tag) => (
							<Select.Option key={tag.id} value={tag.id}>
								{tag.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name='status'
					label='Trạng thái'
					rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
				>
					<Select>
						<Select.Option value='draft'>Nháp</Select.Option>
						<Select.Option value='published'>Đã đăng</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item
					name='content'
					label='Nội dung (Markdown)'
					rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
				>
					<Input.TextArea rows={10} placeholder='Nhập nội dung Markdown...' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default PostFormModal;
