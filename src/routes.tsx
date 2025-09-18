import { useEffect } from 'react';
import { type LoaderFunction, type RouteObject, useLoaderData, useRouteError } from 'react-router';
import BlogPage from './pages/BlogPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import LabelSearchPage from './pages/LabelSearchPage';
import NotFound from './pages/NotFound';
import PagePage from './pages/PagePage';
import PostPage from './pages/PostPage';
import SearchPage from './pages/SearchPage';
import { fetchBloggerData, parseBloggerData } from './utils/blogger-data';

const initialBloggerData = parseBloggerData(document);

const store = {
  initial: initialBloggerData,
  data: initialBloggerData,
};

const loader = (async ({ request }) => {
  const viewUrl = new URL(store.data.view.url);
  viewUrl.pathname = viewUrl.pathname.replace(/^\/\//, '/');

  const requestUrl = new URL(request.url);

  for (const url of [viewUrl, requestUrl]) {
    url.searchParams.delete('m');
    if (url.search) {
      url.search = new URLSearchParams([...url.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b))).toString();
    }
  }

  const shouldFetch = requestUrl.href !== viewUrl.href;

  if (shouldFetch) {
    const newData = await fetchBloggerData(requestUrl, {
      mobile: store.initial.blog.isMobileRequest,
    });

    store.data = newData;
  }

  return { data: store.data };
}) satisfies LoaderFunction;

function Component() {
  const { data } = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  useEffect(() => {
    document.title = data.meta.title;
  }, [data.meta.title]);

  if (data.view.isHomepage) {
    return <HomePage data={data} />;
  }
  if (data.view.isPost) {
    return <PostPage data={data} />;
  }
  if (data.view.isPage) {
    return <PagePage data={data} />;
  }
  if (data.view.isBlog) {
    return <BlogPage data={data} />;
  }
  if (data.view.isLabelSearch) {
    return <LabelSearchPage data={data} />;
  }
  if (data.view.isSearch && data.view.search) {
    return <SearchPage data={data} />;
  }
  return <NotFound data={data} />;
}

function ErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    document.title = 'Something went wrong!';
  }, []);

  return <ErrorPage error={error} />;
}

export default [
  {
    path: '/*',
    loader,
    Component,
    ErrorBoundary,
  },
] satisfies RouteObject[];
