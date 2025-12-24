import { BookOpenTextIcon, LibraryBigIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useBlogger } from '@/contexts/blogger';
import type { Post } from '@/lib/blogger';

export default function PostPage() {
  const { data } = useBlogger();
  const post = data.post as Post;

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs
        items={[
          {
            label: 'Posts',
            icon: LibraryBigIcon,
          },
          {
            label: post.title,
            icon: BookOpenTextIcon,
          },
        ]}
      />

      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <article className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
