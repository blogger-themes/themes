import { LibraryBigIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageLayout from '@/layouts/PageLayout';
import type { BloggerData } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function BlogPage({ data }: Props) {
  return (
    <PageLayout data={data}>
      <div className="flex flex-col gap-5">
        <Breadcrumbs items={[{ label: 'Blog', icon: LibraryBigIcon }]} />

        <div>Blog Page</div>
      </div>
    </PageLayout>
  );
}
