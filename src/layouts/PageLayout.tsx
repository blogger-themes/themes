import type { PropsWithChildren } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import type { BloggerData } from '@/lib/blogger';
import RootLayout from './RootLayout';

export interface PageLayoutProps extends PropsWithChildren {
  data: BloggerData;
}

export default function PageLayout({ data, children }: PageLayoutProps) {
  return (
    <RootLayout>
      <Header title={data.header.title} />
      <div className="p-5 max-w-5xl mx-auto">
        <div>{children}</div>
      </div>
      <Footer />
    </RootLayout>
  );
}
