import { HomeIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import RootLayout from '@/layouts/RootLayout';
import type { BloggerData } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function HomePage({ data }: Props) {
  return (
    <RootLayout data={data}>
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-x-2">
                <HomeIcon className="size-4 shrink-0" /> Home
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-medium">Latest Posts</h1>
        {Object.values(data.posts).map((post) => (
          <div className="flex flex-col p-4 border rounded-md" key={post.id}>
            <Link to={post.url}>{post.title}</Link>
            <div>{post.summary}</div>
          </div>
        ))}
        <div className="text-lg font-medium">Blog Authors</div>
        <div className="flex flex-col gap-5">
          {data.authors.map((author) => (
            <div key={author.id} className="flex items-center gap-3 p-4 border rounded-md">
              <Avatar>
                {author.image && <AvatarImage className="object-cover object-center" src={author.image} />}
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>{author.name}</div>
            </div>
          ))}
        </div>
      </div>
    </RootLayout>
  );
}
