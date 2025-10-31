import { GoogleImage } from '@deox/google-image';
import { HashIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBlogger } from '@/contexts/blogger';
import type { BlogAuthor, PostMinimal } from '@/utils/blogger-data';

function resizeAvatarImage(source: string, size: number) {
  return new GoogleImage(source, { existing: false, pass: true })
    .size(size)
    .alternateCrop(true)
    .disableAnimation(true)
    .noButton(true)
    .noUpscaling(true)
    .webp(true)
    .cacheDays(90)
    .url();
}

function PostCard({ post }: { post: PostMinimal }) {
  return (
    <div className="flex flex-col p-4 border rounded-md">
      <Link className="text-lg font-medium mb-1 hover:underline" to={post.url}>
        {post.title}
      </Link>
      <div className="text-muted-foreground text-sm mb-2" dangerouslySetInnerHTML={{ __html: post.summary }} />
      <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs">
        <div className="flex items-center gap-x-1.5">
          <Avatar className="size-5 rounded-full">
            {post.author.image && <AvatarImage alt={post.author.name} src={resizeAvatarImage(post.author.image, 35)} />}
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
            <Badge asChild key={label} variant="secondary" className="flex items-center gap-x-1">
              <Link to={`/search/label/${encodeURI(label)}`}>
                <HashIcon className="size-3" />
                {label}
              </Link>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogAuthorCard({ author }: { author: BlogAuthor }) {
  return (
    <div className="flex items-center gap-3 p-4 border rounded-md">
      <Avatar>
        {author.image && <AvatarImage className="object-cover object-center" alt={author.name} src={resizeAvatarImage(author.image, 40)} />}
        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>{author.name}</div>
    </div>
  );
}

export default function HomePage() {
  const { data } = useBlogger();

  return (
    <div className="flex flex-col gap-4">
      {data.featured && (
        <>
          <h2 className="text-xl font-medium">Featured post</h2>
          <PostCard post={data.featured.post} />
        </>
      )}
      <h2 className="text-xl font-medium">Latest posts</h2>
      {Object.values(data.posts).map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <h2 className="text-xl font-medium">Blog authors</h2>
      <div className="flex flex-col gap-5">
        {data.authors.map((author) => (
          <BlogAuthorCard key={author.id} author={author} />
        ))}
      </div>
    </div>
  );
}
