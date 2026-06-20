import { ArchiveIcon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ArchivePage() {
	return (
		<div className="flex flex-col gap-5">
			<Breadcrumbs items={[{ label: 'Archive', icon: ArchiveIcon }]} />

			<div>Archive Page</div>
		</div>
	);
}
