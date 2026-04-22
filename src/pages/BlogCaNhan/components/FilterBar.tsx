import { Input, Space, Tag } from 'antd';
import React from 'react';

import { BlogTag } from '../types';

interface FilterBarProps {
	keyword: string;
	onKeywordChange: (value: string) => void;
	tags: BlogTag[];
	activeTag?: string;
	onTagChange: (value?: string) => void;
	placeholder?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
	keyword,
	onKeywordChange,
	tags,
	activeTag,
	onTagChange,
	placeholder = 'Tìm kiếm bài viết...',
}) => {
	return (
		<Space direction='vertical' size={16} style={{ width: '100%' }}>
			<Input.Search
				allowClear
				value={keyword}
				onChange={(event) => onKeywordChange(event.target.value)}
				placeholder={placeholder}
			/>
			<Space wrap>
				<Tag
					color={!activeTag ? 'geekblue' : 'default'}
					style={{ cursor: 'pointer' }}
					onClick={() => onTagChange(undefined)}
				>
					Tất cả
				</Tag>
				{tags.map((item) => (
					<Tag
						key={item.id}
						color={activeTag === item.id ? 'geekblue' : 'default'}
						style={{ cursor: 'pointer' }}
						onClick={() => onTagChange(item.id)}
					>
						{item.name}
					</Tag>
				))}
			</Space>
		</Space>
	);
};

export default FilterBar;
