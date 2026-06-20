import { parseBloggerData } from './blogger/parse';

const initialBloggerData = parseBloggerData(document);

export const bloggerData = {
	initial: initialBloggerData,
	current: initialBloggerData,
};
