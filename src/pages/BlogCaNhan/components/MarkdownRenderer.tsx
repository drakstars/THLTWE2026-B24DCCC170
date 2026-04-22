import React, { useMemo } from 'react';

interface MarkdownRendererProps {
	content: string;
}

const escapeHtml = (value: string) => {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\"/g, '&quot;')
		.replace(/'/g, '&#39;');
};

const parseInline = (line: string): string => {
	return line
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
};

const toHtml = (markdown: string): string => {
	const lines = escapeHtml(markdown).split('\n');
	const htmlParts: string[] = [];
	let isInList = false;

	lines.forEach((line) => {
		const trimmed = line.trim();
		if (!trimmed) {
			if (isInList) {
				htmlParts.push('</ul>');
				isInList = false;
			}
			return;
		}

		if (trimmed.startsWith('### ')) {
			if (isInList) {
				htmlParts.push('</ul>');
				isInList = false;
			}
			htmlParts.push(`<h3>${parseInline(trimmed.slice(4))}</h3>`);
			return;
		}

		if (trimmed.startsWith('## ')) {
			if (isInList) {
				htmlParts.push('</ul>');
				isInList = false;
			}
			htmlParts.push(`<h2>${parseInline(trimmed.slice(3))}</h2>`);
			return;
		}

		if (trimmed.startsWith('# ')) {
			if (isInList) {
				htmlParts.push('</ul>');
				isInList = false;
			}
			htmlParts.push(`<h1>${parseInline(trimmed.slice(2))}</h1>`);
			return;
		}

		if (trimmed.startsWith('- ')) {
			if (!isInList) {
				htmlParts.push('<ul>');
				isInList = true;
			}
			htmlParts.push(`<li>${parseInline(trimmed.slice(2))}</li>`);
			return;
		}

		if (isInList) {
			htmlParts.push('</ul>');
			isInList = false;
		}

		htmlParts.push(`<p>${parseInline(trimmed)}</p>`);
	});

	if (isInList) {
		htmlParts.push('</ul>');
	}

	return htmlParts.join('');
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
	const html = useMemo(() => toHtml(content), [content]);

	return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownRenderer;
