import { BookTextIcon, FileTextIcon } from 'lucide-react';
import ArticleContent from '@/components/ArticleContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useBlogger } from '@/contexts/blogger';
import type { Post } from '@/lib/blogger';

export default function PagePage() {
  const { data } = useBlogger();
  const page = data.page as Post;

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs
        items={[
          { label: 'Pages', icon: BookTextIcon },
          { label: page.title, icon: FileTextIcon },
        ]}
      />

      <h1 className="text-3xl font-semibold">{page.title}</h1>
      <article className="prose">
        <ArticleContent html={page.content} />
      </article>
    </div>
  );
}
