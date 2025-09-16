import { HomeIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import RootLayout from '@/layouts/RootLayout';
import type { BloggerData, Post } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function PostPage({ data }: Props) {
  const post = data.post as Post;

  return (
    <RootLayout data={data}>
      <div className="flex flex-col gap-4">
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
              <BreadcrumbLink>Posts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.post?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-xl font-semibold">{post.title}</h1>
        <article dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </RootLayout>
  );
}
