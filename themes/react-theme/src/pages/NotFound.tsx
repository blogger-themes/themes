import { buttonVariants } from '@themes/ui/components/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@themes/ui/components/card';
import { cn } from '@themes/ui/lib/utils';
import { HomeIcon } from 'lucide-react';
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>404 Not Found</CardTitle>
          <CardDescription>The page you've requested can't be found.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link className={cn(buttonVariants(), 'w-full')} to="/">
            <HomeIcon /> Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
