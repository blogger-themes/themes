import { SearchIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageLayout from '@/layouts/PageLayout';
import type { BloggerData, QuerySearch } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function SearchPage({ data }: Props) {
  const search = data.view.search as QuerySearch;

  return (
    <PageLayout data={data}>
      <div className="flex flex-col gap-5">
        <Breadcrumbs items={[{ label: 'Search', icon: SearchIcon }]} />

        <div>Query: {search.query}</div>
      </div>
    </PageLayout>
  );
}
