import { BookOutlined, SettingOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Pagination, Row, Space, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';

import FilterBar from './components/FilterBar';
import PostCard from './components/PostCard';
import { getBlogStore } from './storage';
import { BlogPost, BlogTag } from './types';

const PAGE_SIZE = 9;

const BlogCaNhanHome: React.FC = () => {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [tags, setTags] = useState<BlogTag[]>([]);
	const [views, setViews] = useState<Record<string, number>>({});
	const [keyword, setKeyword] = useState<string>('');
	const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
	const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
	const [page, setPage] = useState<number>(1);

	useEffect(() => {
		const store = getBlogStore();
		setPosts(store.posts.filter((item) => item.status === 'published'));
		setTags(store.tags);
		setViews(store.views);
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedKeyword(keyword);
			setPage(1);
		}, 300);
		return () => clearTimeout(timer);
	}, [keyword]);

	const filteredPosts = useMemo(() => {
		return posts.filter((post) => {
			const matchKeyword =
				!debouncedKeyword ||
				post.title.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
				post.summary.toLowerCase().includes(debouncedKeyword.toLowerCase());
			const matchTag = !activeTag || post.tags.includes(activeTag);
			return matchKeyword && matchTag;
		});
	}, [activeTag, debouncedKeyword, posts]);

	const pagedPosts = useMemo(() => {
		const startIndex = (page - 1) * PAGE_SIZE;
		return filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);
	}, [filteredPosts, page]);

	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<Typography.Title level={2} style={{ margin: 0 }}>
				Blog Cá Nhân
			</Typography.Title>
			<Space wrap>
				<Button icon={<BookOutlined />} type='primary' onClick={() => history.push('/blog-ca-nhan')}>
					Danh sách bài viết
				</Button>
				<Button icon={<UserOutlined />} onClick={() => history.push('/blog-ca-nhan/gioi-thieu')}>
					Giới thiệu
				</Button>
				<Button icon={<SettingOutlined />} onClick={() => history.push('/blog-ca-nhan/quan-ly-bai-viet')}>
					Quản lý bài viết
				</Button>
				<Button icon={<TagsOutlined />} onClick={() => history.push('/blog-ca-nhan/quan-ly-the')}>
					Quản lý thẻ
				</Button>
			</Space>

			<FilterBar
				keyword={keyword}
				onKeywordChange={setKeyword}
				tags={tags}
				activeTag={activeTag}
				onTagChange={(value) => {
					setActiveTag(value);
					setPage(1);
				}}
				placeholder='Tìm theo tiêu đề hoặc tóm tắt...'
			/>

			{filteredPosts.length === 0 ? (
				<Empty description='Không tìm thấy bài viết phù hợp' />
			) : (
				<>
					<Row gutter={[16, 16]}>
						{pagedPosts.map((post) => (
							<Col xs={24} sm={12} lg={8} key={post.id}>
								<PostCard
									post={post}
									tags={tags}
									viewCount={views[post.id] || 0}
									onTagClick={(tagId) => {
										setActiveTag(tagId);
										setPage(1);
									}}
								/>
							</Col>
						))}
					</Row>
					<Pagination
						current={page}
						pageSize={PAGE_SIZE}
						total={filteredPosts.length}
						onChange={(nextPage) => setPage(nextPage)}
						showSizeChanger={false}
					/>
				</>
			)}
		</Space>
	);
};

export default BlogCaNhanHome;
