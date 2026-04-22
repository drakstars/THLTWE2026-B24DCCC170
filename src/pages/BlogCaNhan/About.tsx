import { GithubOutlined, GlobalOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Divider, Space, Tag, Typography } from 'antd';
import React from 'react';
import { history } from 'umi';

import { DEFAULT_AUTHOR } from './constants';

const iconByName: Record<string, React.ReactNode> = {
	GitHub: <GithubOutlined />,
	LinkedIn: <LinkedinOutlined />,
	Facebook: <GlobalOutlined />,
};

const BlogAbout: React.FC = () => {
	return (
		<Space direction='vertical' size={16} style={{ width: '100%' }}>
			<Card>
				<Space direction='vertical' size={16} style={{ width: '100%' }}>
					<Space align='center' size={16}>
						<Avatar src={DEFAULT_AUTHOR.avatar} size={100} />
						<div>
							<Typography.Title level={2} style={{ margin: 0 }}>
								{DEFAULT_AUTHOR.name}
							</Typography.Title>
							<Typography.Text type='secondary'>{DEFAULT_AUTHOR.bio}</Typography.Text>
						</div>
					</Space>

					<Divider style={{ margin: '8px 0' }} />

					<div>
						<Typography.Title level={4}>Kỹ năng</Typography.Title>
						<Space wrap>
							{DEFAULT_AUTHOR.skills.map((skill) => (
								<Tag color='geekblue' key={skill}>
									{skill}
								</Tag>
							))}
						</Space>
					</div>

					<div>
						<Typography.Title level={4}>Mạng xã hội</Typography.Title>
						<Space wrap>
							{DEFAULT_AUTHOR.socials.map((social) => (
								<a href={social.url} key={social.name} rel='noreferrer' target='_blank'>
									<Space>
										{iconByName[social.name] || <GlobalOutlined />}
										<span>{social.name}</span>
									</Space>
								</a>
							))}
						</Space>
					</div>

					<Button type='link' onClick={() => history.push('/blog-ca-nhan')}>
						Quay lại trang danh sách
					</Button>
				</Space>
			</Card>
		</Space>
	);
};

export default BlogAbout;
