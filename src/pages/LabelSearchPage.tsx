import { TagIcon, TagsIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageLayout from '@/layouts/PageLayout';
import type { BloggerData, LabelSearch } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function LabelSearchPage({ data }: Props) {
  const search = data.view.search as LabelSearch;

  return (
    <PageLayout data={data}>
      <div className="flex flex-col gap-4">
        <Breadcrumbs
          items={[
            {
              label: 'Labels',
              icon: TagsIcon,
            },
            { label: search.label, icon: TagIcon },
          ]}
        />

        <h2 className="text-xl font-medium">{search.label}</h2>
      </div>
    </PageLayout>
  );
}
