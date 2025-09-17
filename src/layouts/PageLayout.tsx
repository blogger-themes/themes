import type { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import type { BloggerData } from '@/utils/blogger-data';
import RootLayout from './RootLayout';

export interface Props {
  data: BloggerData;
  children: ReactNode;
}

export default function PageLayout({ data, children }: Props) {
  return (
    <RootLayout>
      <Header title={data.blog.title} />
      <div className="p-5 max-w-5xl mx-auto">
        <div>{children}</div>
      </div>
      <Footer />
    </RootLayout>
  );
}
