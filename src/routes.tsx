import { type LoaderFunction, type RouteObject, useRouteError, useRouteLoaderData } from 'react-router';
import { BloggerProvider } from '@/contexts/blogger';
import BlogLayout from '@/layouts/BlogLayout';
import { type BloggerData, fetchBlogger, parseBloggerData } from '@/lib/blogger-data';
import ErrorPage from '@/pages/ErrorPage';

const initialBloggerData = parseBloggerData(document);

const bloggerData = {
  initial: initialBloggerData,
  current: initialBloggerData,
};

const shouldRevalidate = ({ nextUrl: url }: { nextUrl: string | URL }) => {
  const currentUrl = new URL(bloggerData.current.view.url);
  currentUrl.pathname = currentUrl.pathname.replace(/^\/\//, '/');

  const nextUrl = new URL(url);

  for (const url of [currentUrl, nextUrl]) {
    url.searchParams.delete('m');
    url.searchParams.delete('view');
    if (url.search) {
      url.search = new URLSearchParams([...url.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b))).toString();
    }
  }

  return nextUrl.toString() !== currentUrl.toString();
};

export interface RootLoaderData {
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

  return <ErrorPage error={error} />;
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
