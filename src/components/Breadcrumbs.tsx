import { HomeIcon, type LucideProps } from 'lucide-react';
import { type ForwardRefExoticComponent, Fragment, type RefAttributes } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

export interface BreadcrumbItemType {
  label: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
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
                <BreadcrumbLink className={cn('flex items-center gap-x-2', index === items.length - 1 && 'text-foreground')} asChild>
                  <Link to={link}>
                    {Icon && <Icon className="size-4 shrink-0" />}
                    <span>{label}</span>
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className={cn('flex items-center gap-x-2', !link && index < items.length - 1 && 'text-muted-foreground')}>
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
