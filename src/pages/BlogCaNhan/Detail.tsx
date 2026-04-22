import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Space, Tag, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';

import MarkdownRenderer from './components/MarkdownRenderer';
import PostCard from './components/PostCard';
import { getBlogStore, increasePostView } from './storage';
import { BlogPost, BlogTag } from './types';
import { formatDate } from './utils/helpers';

const BlogDetail: React.FC<any> = ({ match }) => {
	const [post, setPost] = useState<BlogPost | undefined>(undefined);
	const [tags, setTags] = useState<BlogTag[]>([]);
	const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
	const [views, setViews] = useState<Record<string, number>>({});

	const slug = match?.params?.slug as string;

	useEffect(() => {
		const store = getBlogStore();
		const foundPost = store.posts.find((item) => item.slug === slug && item.status === 'published');

		if (!foundPost) {
			setPost(undefined);
			setTags(store.tags);
			setRelatedPosts([]);
			setViews(store.views);
			return;
		}

		const nextView = increasePostView(foundPost.id);
		const refreshedStore = getBlogStore();
		setPost(foundPost);
		setTags(refreshedStore.tags);
		setViews({ ...refreshedStore.views, [foundPost.id]: nextView });
		setRelatedPosts(
			refreshedStore.posts.filter(
				(item) =>
					item.id !== foundPost.id &&
					item.status === 'published' &&
					item.tags.some((tag) => foundPost.tags.includes(tag)),
			),
		);
	}, [slug]);

	const displayTags = useMemo(() => {
		if (!post) {
			return [];
		}
		return tags.filter((item) => post.tags.includes(item.id));
	}, [post, tags]);

	if (!post) {
		return (
			<Space direction='vertical' size={16} style={{ width: '100%' }}>
				<Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog-ca-nhan')}>
					Quay lại danh sách
				</Button>
				<Empty description='Không tìm thấy bài viết' />
			</Space>
		);
	}

	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog-ca-nhan')}>
				Quay lại danh sách
			</Button>

			<Card>
				<Space direction='vertical' size={16} style={{ width: '100%' }}>
					<img
						alt={post.title}
						src={post.coverImage}
						style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 8 }}
					/>
					<Typography.Title level={2} style={{ margin: 0 }}>
						{post.title}
					</Typography.Title>
					<Space wrap>
						<Space size={4}>
							<UserOutlined />
							<span>{post.author}</span>
						</Space>
						<Space size={4}>
							<CalendarOutlined />
							<span>{formatDate(post.createdAt)}</span>
						</Space>
						<Space size={4}>
							<EyeOutlined />
							<span>{views[post.id] || 0} lượt xem</span>
						</Space>
					</Space>
					<Space wrap>
						{displayTags.map((tag) => (
							<Tag color='blue' key={tag.id}>
								{tag.name}
							</Tag>
						))}
					</Space>
					<MarkdownRenderer content={post.content} />
				</Space>
			</Card>

			<Card title='Bài viết liên quan'>
				{relatedPosts.length === 0 ? (
					<Empty description='Chưa có bài viết liên quan' />
				) : (
					<Space direction='vertical' size={16} style={{ width: '100%' }}>
						{relatedPosts.slice(0, 3).map((item) => (
							<PostCard key={item.id} post={item} tags={tags} viewCount={views[item.id] || 0} />
						))}
					</Space>
				)}
			</Card>
		</Space>
	);
};

export default BlogDetail;
