import { BookTextIcon, FileTextIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useBlogger } from '@/contexts/blogger';
import type { Post } from '@/utils/blogger-data';

export default function PagePage() {
  const { data } = useBlogger();
  const page = data.page as Post;

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs
        items={[
          {
            label: 'Pages',
            icon: BookTextIcon,
          },
          {
            label: page.title,
            icon: FileTextIcon,
          },
        ]}
      />

      <h1 className="text-3xl font-semibold">{page.title}</h1>
      <article className="prose" dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
