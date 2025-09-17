import { HashIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import RootLayout from '@/layouts/RootLayout';
import type { BloggerData } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function HomePage({ data }: Props) {
  return (
    <RootLayout data={data}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">Latest posts</h2>
        {Object.values(data.posts).map((post) => (
          <div className="flex flex-col p-4 border rounded-md" key={post.id}>
            <Link className="text-lg font-medium mb-1 hover:underline" to={post.url}>
              {post.title}
            </Link>
            <div className="text-muted-foreground text-sm mb-2" dangerouslySetInnerHTML={{ __html: post.summary }} />
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs">
              <div className="flex items-center gap-x-1.5">
                <Avatar className="size-5 rounded-full">
                  {post.author.image && <AvatarImage alt={post.author.name} src={post.author.image} />}
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author.name}</span>
              </div>
              <Separator orientation="vertical" className="h-4!" />
              <span>{post.publishedTimestamp}</span>
            </div>
            {post.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.labels.map((label) => (
                  <Badge key={label} variant="secondary" className="flex items-center gap-x-1">
                    <HashIcon className="size-3" />
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
        <h2 className="text-xl font-medium">Blog authors</h2>
        <div className="flex flex-col gap-5">
          {data.authors.map((author) => (
            <div key={author.id} className="flex items-center gap-3 p-4 border rounded-md">
              <Avatar>
                {author.image && <AvatarImage className="object-cover object-center" src={author.image} alt={author.name} />}
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
