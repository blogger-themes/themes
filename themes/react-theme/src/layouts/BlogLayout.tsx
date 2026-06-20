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
	}, [data.meta.title]);

	if (
		!data.view.isHomepage &&
		!data.view.isPost &&
		!data.view.isPage &&
		!data.view.isArchive &&
		!data.view.isBlog &&
		!data.view.isLabelSearch &&
		!data.view.isSearch
	) {
		return (
			<RootLayout>
				<NotFound />
			</RootLayout>
		);
	}

	return (
		<PageLayout>
			{data.view.isHomepage ? (
				<HomePage />
			) : data.view.isPost ? (
				<PostPage />
			) : data.view.isPage ? (
				<PagePage />
			) : data.view.isArchive ? (
				<ArchivePage />
			) : data.view.isLabelSearch ? (
				<LabelSearchPage />
			) : data.view.isSearch && data.view.search ? (
				<SearchPage />
			) : (
				<BlogPage />
			)}
		</PageLayout>
	);
}
