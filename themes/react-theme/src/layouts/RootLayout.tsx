import { TooltipProvider } from '@themes/ui/components/tooltip';
import { LoaderCircle } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { ScrollRestoration, useNavigation } from 'react-router';
import Toaster from '@/components/Toaster';
import { BlogAdminProvider } from '@/contexts/blog-admin';

export interface RootLayoutProps extends PropsWithChildren {}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <TooltipProvider>
      <BlogAdminProvider>
        {children}
        <Toaster
          richColors
          style={{
            fontFamily: 'var(--font-sans)',
          }}
        />
        <NavigationLoader />
        <ScrollRestoration />
      </BlogAdminProvider>
    </TooltipProvider>
  );
}

function NavigationLoader() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  if (isNavigating) {
    return (
      <div className="flex items-center justify-center fixed bottom-4 right-4 size-9 bg-background rounded-md border shadow-sm">
        <LoaderCircle className="animate-spin" size={16} />
      </div>
    );
  }
}
