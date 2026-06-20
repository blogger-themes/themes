import { SearchIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useBlogger } from '@/contexts/blogger';
import type { QuerySearch } from '@/lib/blogger';

export default function SearchPage() {
	const { data } = useBlogger();
	const search = data.view.search as QuerySearch;

	return (
		<div className="flex flex-col gap-5">
			<Breadcrumbs items={[{ label: 'Search', icon: SearchIcon }]} />

			<div>Query: {search.query}</div>
		</div>
	);
}
