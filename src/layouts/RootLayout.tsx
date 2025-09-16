import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import type { BloggerData } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
  children: ReactNode;
}

export default function RootLayout({ data, children }: Props) {
  return (
    <ThemeProvider attribute="class">
      <Header title={data.blog.title} />
      <div className="p-5 max-w-5xl mx-auto">
        <div>{children}</div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
