import { Button } from '@themes/ui/components/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@themes/ui/components/card';
import { RefreshCwIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useNavigation } from 'react-router';
import { toast } from 'sonner';
import RootLayout from '@/layouts/RootLayout';

export interface ErrorPageProps {
  error: unknown;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  useEffect(() => {
    document.title = 'Something went wrong!';
  }, []);

  useEffect(() => {
    if (isNavigating) {
      toast.info('Reloading...');
    } else {
      toast.dismiss();
      toast.error(<b>An unexpected error occurred</b>, {
        description: error instanceof Error ? String(error) : undefined,
      });
    }
  });

  return (
    <RootLayout>
      <div className="bg-muted min-h-svh flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Something went wrong!</CardTitle>
            <CardDescription>
              An unexpected error occurred while loading the page. Make sure you are connected to the internet and try again.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              disabled={isNavigating}
              className="grow"
              type="button"
              onClick={() => navigate(navigation.location?.pathname ?? window.location.pathname, { replace: true })}
            >
              {isNavigating ? (
                <>
                  <RefreshCwIcon className="animate-spin" /> Reloading...
                </>
              ) : (
                <>
                  <RefreshCwIcon /> Reload
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </RootLayout>
  );
}
