import { lazy, useEffect } from 'react';
import { useBlogger } from '@/contexts/blogger';
import PageLayout from './PageLayout';
import RootLayout from './RootLayout';

const HomePage = lazy(() => import('@/pages/HomePage'));
const PostPage = lazy(() => import('@/pages/PostPage'));
const PagePage = lazy(() => import('@/pages/PagePage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const LabelSearchPage = lazy(() => import('@/pages/LabelSearchPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ArchivePage = lazy(() => import('@/pages/ArchivePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function BlogLayout() {
  const { data } = useBlogger();

  useEffect(() => {
    document.title = data.meta.title;
  }, [data]);

  return data.view.isError ? (
    <RootLayout>
      <NotFound />
    </RootLayout>
  ) : (
    <PageLayout data={data}>
      {data.view.isHomepage ? (
        <HomePage />
      ) : data.view.isPost ? (
        <PostPage />
      ) : data.view.isPage ? (
        <PagePage />
      ) : data.view.isArchive ? (
        <ArchivePage />
      ) : data.view.isBlog ? (
        <BlogPage />
      ) : data.view.isLabelSearch ? (
        <LabelSearchPage />
      ) : data.view.isSearch && data.view.search ? (
        <SearchPage />
      ) : data.view.isError ? (
        <NotFound />
      ) : (
        <>No matching page</>
      )}
    </PageLayout>
  );
}
