import { BookOpenTextIcon, LibraryBigIcon } from 'lucide-react';
import ArticleContent from '@/components/ArticleContent';
import Breadcrumbs from '@/components/Breadcrumbs';
// import Thumbnail from '@/components/Thumbnail';
import { useBlogger } from '@/contexts/blogger';
import type { Post } from '@/lib/blogger';

export default function PostPage() {
	const { data } = useBlogger();
	const post = data.post as Post;

	return (
		<main className="flex flex-col gap-5">
			<Breadcrumbs
				items={[
					{ label: 'Posts', icon: LibraryBigIcon },
					{ label: post.title, icon: BookOpenTextIcon },
				]}
			/>

			<h1 className="text-3xl font-semibold">{post.title}</h1>

			{/* <Thumbnail title={post.title} description={post.summary} logo={data.meta.favicon.src} organization={data.blog.title} /> */}

			<article className="prose">
				<ArticleContent html={post.content} />
			</article>
		</main>
	);
}
