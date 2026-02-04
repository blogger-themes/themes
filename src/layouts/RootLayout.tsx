import { LoaderCircle } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { ScrollRestoration, useNavigation } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { BlogAdminProvider } from '@/contexts/blog-admin';

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

export interface RootLayoutProps extends PropsWithChildren {}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider attribute="class">
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
    </ThemeProvider>
  );
}
