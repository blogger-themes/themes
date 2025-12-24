import { TagIcon, TagsIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useBlogger } from '@/contexts/blogger';
import type { LabelSearch } from '@/lib/blogger';

export default function LabelSearchPage() {
  const { data } = useBlogger();
  const search = data.view.search as LabelSearch;

  return (
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
  );
}
