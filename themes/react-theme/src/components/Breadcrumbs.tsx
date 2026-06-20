import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@themes/ui/components/breadcrumb';
import { cn } from '@themes/ui/lib/utils';
import { HomeIcon } from 'lucide-react';
import { type ComponentType, Fragment, type SVGProps } from 'react';
import { Link } from 'react-router';

export interface BreadcrumbItemType {
	label: string;
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
	link?: string;
}

export interface BreadcrumbsProps {
	items: BreadcrumbItemType[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink className="flex items-center gap-x-2" asChild>
						<Link to="/">
							<HomeIcon className="size-4 shrink-0" />
							<span className="sr-only">Home</span>
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{items.map(({ label, link, icon: Icon }, index) => (
					<Fragment key={`${label}:${link ?? ''}`}>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							{link ? (
								<BreadcrumbLink
									className={cn(
										'flex items-center gap-x-2',
										index === items.length - 1 && 'text-foreground',
									)}
									asChild
								>
									<Link to={link}>
										{Icon && <Icon className="size-4 shrink-0" />}
										<span>{label}</span>
									</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage
									className={cn(
										'flex items-center gap-x-2',
										!link &&
											index < items.length - 1 &&
											'text-muted-foreground',
									)}
								>
									{Icon && <Icon className="size-4 shrink-0" />}
									<span>{label}</span>
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
