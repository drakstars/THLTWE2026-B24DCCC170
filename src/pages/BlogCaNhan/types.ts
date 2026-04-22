export type PostStatus = 'draft' | 'published';

export interface BlogTag {
	id: string;
	name: string;
}

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	summary: string;
	content: string;
	coverImage: string;
	tags: string[];
	status: PostStatus;
	author: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthorProfile {
	name: string;
	avatar: string;
	bio: string;
	skills: string[];
	socials: Array<{
		name: string;
		url: string;
	}>;
}

export interface BlogStore {
	posts: BlogPost[];
	tags: BlogTag[];
	views: Record<string, number>;
}
