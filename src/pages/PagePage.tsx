import { HomeIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import RootLayout from '@/layouts/RootLayout';
import type { BloggerData, Post } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function PagePage({ data }: Props) {
  const page = data.page as Post;

  return (
    <RootLayout data={data}>
      <div className="flex flex-col gap-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="flex items-center gap-x-2" asChild>
                <Link to="/">
                  <HomeIcon className="size-4 shrink-0" /> Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Pages</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.page?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-xl font-semibold">{page.title}</h1>
        <article dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </RootLayout>
  );
}
