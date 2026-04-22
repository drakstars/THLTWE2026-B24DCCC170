import moment from 'moment';

import { PostStatus } from '../types';

export const slugify = (value: string): string => {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/đ/g, 'd')
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
};

export const statusLabel = (status: PostStatus): string => {
	return status === 'published' ? 'Đã đăng' : 'Nháp';
};

export const formatDate = (value: string): string => {
	return moment(value).format('DD/MM/YYYY HH:mm');
};

export const stripMarkdown = (value: string): string => {
	return value
		.replace(/`{1,3}[^`]*`{1,3}/g, '')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
		.replace(/[#>*_~-]/g, '')
		.replace(/\n+/g, ' ')
		.trim();
};

export const toSummary = (value: string, maxLength: number = 140): string => {
	const plainText = stripMarkdown(value);
	if (plainText.length <= maxLength) {
		return plainText;
	}
	return `${plainText.slice(0, maxLength)}...`;
};
