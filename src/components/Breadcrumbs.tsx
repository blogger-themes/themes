import { HomeIcon, type LucideProps } from 'lucide-react';
import { type ForwardRefExoticComponent, Fragment, type RefAttributes } from 'react';
import { Link } from 'react-router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

export interface BreadcrumbItemType {
  label: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  href?: string;
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
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, index) => (
          <Fragment key={`${item.label}:${item.href ?? ''}`}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <BreadcrumbPage className="flex items-center gap-x-2">
                  {item.icon && <item.icon className="size-4 shrink-0" />}
                  <span>{item.label}</span>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink className="flex items-center gap-x-2" asChild={Boolean(item.href)}>
                  {item.href ? (
                    <Link to={item.href}>
                      {item.icon && <item.icon className="size-4 shrink-0" />}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      {item.icon && <item.icon className="size-4 shrink-0" />}
                      <span>{item.label}</span>
                    </>
                  )}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
