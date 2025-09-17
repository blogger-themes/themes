import { LoaderCircle } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { ScrollRestoration, useNavigation } from 'react-router';
import { Toaster } from '@/components/ui/sonner';

export interface Props {
  children: ReactNode;
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

export default function RootLayout({ children }: Props) {
  return (
    <ThemeProvider attribute="class">
      {children}
      <Toaster
        richColors
        style={{
          fontFamily: 'var(--font-sans)',
        }}
      />
      <NavigationLoader />
      <ScrollRestoration />
    </ThemeProvider>
  );
}
