import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, message, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo, useState } from 'react';
import { history } from 'umi';

import TagFormModal from './components/TagFormModal';
import { getBlogStore, saveBlogStore } from './storage';
import { BlogTag } from './types';

interface TagRow extends BlogTag {
	postCount: number;
}

const BlogManageTags: React.FC = () => {
	const store = getBlogStore();
	const [tags, setTags] = useState<BlogTag[]>(store.tags);
	const [posts, setPosts] = useState(store.posts);
	const [views] = useState(store.views);
	const [editingTag, setEditingTag] = useState<BlogTag | undefined>(undefined);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

	const rows = useMemo<TagRow[]>(() => {
		return tags.map((tag) => ({
			...tag,
			postCount: posts.filter((post) => post.tags.includes(tag.id)).length,
		}));
	}, [posts, tags]);

	const saveState = (nextTags: BlogTag[], nextPosts = posts) => {
		setTags(nextTags);
		setPosts(nextPosts);
		saveBlogStore({
			posts: nextPosts,
			tags: nextTags,
			views,
		});
	};

	const onSubmit = (value: BlogTag) => {
		const duplicatedName = tags.some(
			(tag) => tag.name.toLowerCase() === value.name.toLowerCase() && tag.id !== editingTag?.id,
		);
		if (duplicatedName) {
			message.error('Tên thẻ đã tồn tại');
			return;
		}

		if (editingTag) {
			const nextTags = tags.map((tag) => (tag.id === editingTag.id ? value : tag));
			saveState(nextTags);
			message.success('Cập nhật thẻ thành công');
		} else {
			const existsById = tags.some((tag) => tag.id === value.id);
			const nextTag = existsById ? { ...value, id: `${value.id}-${Date.now()}` } : value;
			saveState([nextTag, ...tags]);
			message.success('Thêm thẻ thành công');
		}

		setEditingTag(undefined);
		setIsModalVisible(false);
	};

	const onDelete = (tag: BlogTag) => {
		const nextTags = tags.filter((item) => item.id !== tag.id);
		const nextPosts = posts.map((post) => ({
			...post,
			tags: post.tags.filter((tagId) => tagId !== tag.id),
		}));
		saveState(nextTags, nextPosts);
		message.success('Xóa thẻ thành công');
	};

	const columns: ColumnsType<TagRow> = [
		{
			title: 'Tên thẻ',
			dataIndex: 'name',
			key: 'name',
			render: (value: string) => (
				<Tag color='blue'>
					<Typography.Text>{value}</Typography.Text>
				</Tag>
			),
		},
		{
			title: 'Số bài viết đang sử dụng',
			dataIndex: 'postCount',
			key: 'postCount',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_, record) => (
				<Space>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingTag({ id: record.id, name: record.name });
							setIsModalVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa thẻ này?'
						onConfirm={() => onDelete(record)}
					>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Space direction='vertical' size={16} style={{ width: '100%' }}>
			<Space wrap>
				<Button onClick={() => history.push('/blog-ca-nhan')}>Về danh sách bài viết</Button>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
					Thêm thẻ
				</Button>
			</Space>

			<Card>
				<Table rowKey='id' columns={columns} dataSource={rows} />
			</Card>

			<TagFormModal
				visible={isModalVisible}
				editingTag={editingTag}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingTag(undefined);
				}}
				onSubmit={onSubmit}
			/>
		</Space>
	);
};

export default BlogManageTags;
