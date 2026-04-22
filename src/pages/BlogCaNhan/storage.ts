import { BLOG_STORE_KEY, DEFAULT_POSTS, DEFAULT_TAGS } from './constants';
import { BlogPost, BlogStore, BlogTag } from './types';

const defaultStore: BlogStore = {
	posts: DEFAULT_POSTS,
	tags: DEFAULT_TAGS,
	views: {},
};

export const getBlogStore = (): BlogStore => {
	if (typeof window === 'undefined') {
		return defaultStore;
	}

	const rawData = localStorage.getItem(BLOG_STORE_KEY);
	if (!rawData) {
		localStorage.setItem(BLOG_STORE_KEY, JSON.stringify(defaultStore));
		return defaultStore;
	}

	try {
		const parsed = JSON.parse(rawData) as Partial<BlogStore>;
		const parsedPosts = Array.isArray(parsed.posts) ? parsed.posts : [];
		const parsedTags = Array.isArray(parsed.tags) ? parsed.tags : [];
		const defaultPostIds = new Set(DEFAULT_POSTS.map((item) => item.id));
		const defaultTagIds = new Set(DEFAULT_TAGS.map((item) => item.id));

		const customPosts = parsedPosts.filter((item) => !defaultPostIds.has(item.id));
		const customTags = parsedTags.filter((item) => !defaultTagIds.has(item.id));

		const mergedPosts = [
			...DEFAULT_POSTS,
			...customPosts,
		];

		const mergedTags = [
			...DEFAULT_TAGS,
			...customTags,
		];

		const nextStore: BlogStore = {
			posts: mergedPosts,
			tags: mergedTags,
			views: parsed.views || {},
		};

		saveBlogStore(nextStore);

		return {
			posts: nextStore.posts,
			tags: nextStore.tags,
			views: nextStore.views,
		};
	} catch (error) {
		localStorage.setItem(BLOG_STORE_KEY, JSON.stringify(defaultStore));
		return defaultStore;
	}
};

export const saveBlogStore = (store: BlogStore) => {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.setItem(BLOG_STORE_KEY, JSON.stringify(store));
};

export const savePosts = (posts: BlogPost[]) => {
	const store = getBlogStore();
	saveBlogStore({ ...store, posts });
};

export const saveTags = (tags: BlogTag[]) => {
	const store = getBlogStore();
	saveBlogStore({ ...store, tags });
};

export const increasePostView = (postId: string): number => {
	const store = getBlogStore();
	const currentViews = store.views[postId] || 0;
	const nextViews = currentViews + 1;
	saveBlogStore({
		...store,
		views: {
			...store.views,
			[postId]: nextViews,
		},
	});
	return nextViews;
};
