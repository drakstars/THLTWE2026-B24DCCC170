import { CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Space, Tag, Typography } from 'antd';
import React from 'react';
import { Link } from 'umi';

import { BlogPost, BlogTag } from '../types';
import { formatDate } from '../utils/helpers';

interface PostCardProps {
	post: BlogPost;
	tags: BlogTag[];
	viewCount: number;
	onTagClick?: (tagId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, tags, viewCount, onTagClick }) => {
	const relatedTags = tags.filter((item) => post.tags.includes(item.id));

	return (
		<Card
			hoverable
			cover={
				<img
					alt={post.title}
					src={post.coverImage}
					style={{ height: 190, width: '100%', objectFit: 'cover' }}
				/>
			}
		>
			<Space direction='vertical' size={12} style={{ width: '100%' }}>
				<Link to={`/blog-ca-nhan/bai-viet/${post.slug}`}>
					<Typography.Title level={4} style={{ margin: 0 }}>
						{post.title}
					</Typography.Title>
				</Link>
				<Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2 }}>
					{post.summary}
				</Typography.Paragraph>
				<Space wrap size='small'>
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
						<span>{viewCount} lượt xem</span>
					</Space>
				</Space>
				<Space wrap>
					{relatedTags.map((tag) => (
						<Tag
							key={tag.id}
							color='blue'
							style={{ cursor: onTagClick ? 'pointer' : 'default' }}
							onClick={() => onTagClick?.(tag.id)}
						>
							{tag.name}
						</Tag>
					))}
				</Space>
			</Space>
		</Card>
	);
};

export default PostCard;
