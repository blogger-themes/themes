import { BookOpenTextIcon, LibraryBigIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageLayout from '@/layouts/PageLayout';
import type { BloggerData, Post } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function PostPage({ data }: Props) {
  const post = data.post as Post;

  return (
    <PageLayout data={data}>
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
    </PageLayout>
  );
}
