import { BookTextIcon, FileTextIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageLayout from '@/layouts/PageLayout';
import type { BloggerData, Post } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function PagePage({ data }: Props) {
  const page = data.page as Post;

  return (
    <PageLayout data={data}>
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
    </PageLayout>
  );
}
