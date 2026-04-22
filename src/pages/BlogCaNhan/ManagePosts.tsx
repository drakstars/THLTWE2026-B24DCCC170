import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Input,
	message,
	Popconfirm,
	Select,
	Space,
	Table,
	Tag,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo, useState } from 'react';
import { history } from 'umi';

import PostFormModal from './components/PostFormModal';
import { getBlogStore, saveBlogStore } from './storage';
import { BlogPost, BlogTag, PostStatus } from './types';
import { formatDate, statusLabel, toSummary } from './utils/helpers';

interface PostFormValue {
	title: string;
	slug: string;
	content: string;
	coverImage: string;
	tags: string[];
	status: PostStatus;
}

const BlogManagePosts: React.FC = () => {
	const store = getBlogStore();
	const [posts, setPosts] = useState<BlogPost[]>(store.posts);
	const [tags] = useState<BlogTag[]>(store.tags);
	const [views] = useState<Record<string, number>>(store.views);
	const [keyword, setKeyword] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<PostStatus | undefined>(undefined);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);

	const tagMap = useMemo(() => {
		return tags.reduce((acc, item) => {
			acc[item.id] = item.name;
			return acc;
		}, {} as Record<string, string>);
	}, [tags]);

	const filteredPosts = useMemo(() => {
		return posts.filter((post) => {
			const matchKeyword = !keyword || post.title.toLowerCase().includes(keyword.toLowerCase());
			const matchStatus = !statusFilter || post.status === statusFilter;
			return matchKeyword && matchStatus;
		});
	}, [keyword, posts, statusFilter]);

	const refreshLocalState = (nextPosts: BlogPost[]) => {
		setPosts(nextPosts);
		saveBlogStore({ posts: nextPosts, tags, views });
	};

	const onCreateOrUpdatePost = (values: PostFormValue) => {
		const duplicatedSlug = posts.some(
			(item) => item.slug === values.slug && item.id !== editingPost?.id,
		);

		if (duplicatedSlug) {
			message.error('Slug đã tồn tại, vui lòng nhập slug khác');
			return;
		}

		const now = new Date().toISOString();
		if (editingPost) {
			const updatedPosts = posts.map((item) =>
				item.id === editingPost.id
					? {
							...item,
							...values,
							summary: toSummary(values.content),
							updatedAt: now,
						}
					: item,
			);
			refreshLocalState(updatedPosts);
			message.success('Cập nhật bài viết thành công');
		} else {
			const newPost: BlogPost = {
				id: `post-${Date.now()}`,
				author: 'Nguyễn Văn Admin',
				createdAt: now,
				updatedAt: now,
				summary: toSummary(values.content),
				...values,
			};
			refreshLocalState([newPost, ...posts]);
			message.success('Thêm bài viết thành công');
		}

		setIsModalVisible(false);
		setEditingPost(undefined);
	};

	const onDelete = (postId: string) => {
		const nextPosts = posts.filter((item) => item.id !== postId);
		refreshLocalState(nextPosts);
		message.success('Xóa bài viết thành công');
	};

	const columns: ColumnsType<BlogPost> = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
			render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (value: PostStatus) => (
				<Tag color={value === 'published' ? 'green' : 'orange'}>{statusLabel(value)}</Tag>
			),
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			key: 'tags',
			render: (value: string[]) => (
				<Space wrap>
					{value.map((tagId) => (
						<Tag key={tagId}>{tagMap[tagId] || tagId}</Tag>
					))}
				</Space>
			),
		},
		{
			title: 'Lượt xem',
			key: 'views',
			render: (_, record) => views[record.id] || 0,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (value: string) => formatDate(value),
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
							setEditingPost(record);
							setIsModalVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa bài viết này?'
						onConfirm={() => onDelete(record.id)}
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
					Thêm bài viết
				</Button>
			</Space>

			<Card>
				<Space direction='vertical' size={16} style={{ width: '100%' }}>
					<Space wrap>
						<Input.Search
							allowClear
							placeholder='Tìm theo tiêu đề'
							style={{ width: 320 }}
							value={keyword}
							onChange={(event) => setKeyword(event.target.value)}
						/>
						<Select
							allowClear
							style={{ width: 220 }}
							placeholder='Lọc theo trạng thái'
							value={statusFilter}
							onChange={(value) => setStatusFilter(value)}
						>
							<Select.Option value='draft'>Nháp</Select.Option>
							<Select.Option value='published'>Đã đăng</Select.Option>
						</Select>
					</Space>
					<Table rowKey='id' columns={columns} dataSource={filteredPosts} />
				</Space>
			</Card>

			<PostFormModal
				visible={isModalVisible}
				tags={tags}
				editingPost={editingPost}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingPost(undefined);
				}}
				onSubmit={onCreateOrUpdatePost}
			/>
		</Space>
	);
};

export default BlogManagePosts;
