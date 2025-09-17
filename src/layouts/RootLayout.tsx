import { LoaderCircle } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { useNavigation } from 'react-router';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import type { BloggerData } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
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

export default function RootLayout({ data, children }: Props) {
  return (
    <ThemeProvider attribute="class">
      <Header title={data.blog.title} />
      <div className="p-5 max-w-5xl mx-auto">
        <div>{children}</div>
      </div>
      <Footer />
      <NavigationLoader />
      <Toaster />
    </ThemeProvider>
  );
}
