import { BookTextIcon, FileTextIcon, HomeIcon } from 'lucide-react';
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
              <BreadcrumbLink className="flex items-center gap-x-2">
                <BookTextIcon className="size-4 shrink-0" /> Pages
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-x-2">
                <FileTextIcon className="size-4 shrink-0" />
                {data.page?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-semibold">{page.title}</h1>
        <article className="prose" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </RootLayout>
  );
}
