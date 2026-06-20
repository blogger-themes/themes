import {
	type LoaderFunction,
	type RouteObject,
	useRouteError,
	useRouteLoaderData,
} from 'react-router';
import { BloggerProvider } from '@/contexts/blogger';
import BlogLayout from '@/layouts/BlogLayout';
import ErrorLayout from '@/layouts/ErrorLayout';
import { type BloggerData, fetchBlogger } from '@/lib/blogger';
import { bloggerData } from '@/lib/blogger-data';

const shouldRevalidate = ({ nextUrl: url }: { nextUrl: string | URL }) => {
	const currentUrl = new URL(bloggerData.current.view.url);
	const nextUrl = new URL(url);

	for (const url of [currentUrl, nextUrl]) {
		url.pathname = url.pathname.replace(/^\/\//, '/');
		if (url.search) {
			url.searchParams.delete('m');
			url.searchParams.delete('view');
			url.searchParams.sort();
		}
	}

	return nextUrl.toString() !== currentUrl.toString();
};

interface RootLoaderData {
	data: BloggerData;
}

const rootLoader = (async ({ request }): Promise<RootLoaderData> => {
	if (shouldRevalidate({ nextUrl: request.url })) {
		const newData = await fetchBlogger(request.url, {
			mobile: bloggerData.initial.blog.isMobileRequest ? 'force' : 'ignore',
		}).asData();

		bloggerData.current = newData;
	}

	return { data: bloggerData.current };
}) satisfies LoaderFunction;

function RootComponent() {
	const { data } = useRouteLoaderData<RootLoaderData>('root') as RootLoaderData;

	return (
		<BloggerProvider data={data}>
			<BlogLayout />
		</BloggerProvider>
	);
}

function RootErrorBoundary() {
	const error = useRouteError();

	return <ErrorLayout error={error} />;
}

export default [
	{
		id: 'root',
		path: '*',
		loader: rootLoader,
		shouldRevalidate,
		element: <RootComponent />,
		errorElement: <RootErrorBoundary />,
	},
] satisfies RouteObject[];
