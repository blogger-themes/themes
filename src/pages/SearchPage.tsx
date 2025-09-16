import RootLayout from '@/layouts/RootLayout';
import type { BloggerData } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function SearchPage({ data }: Props) {
  return (
    <RootLayout data={data}>
      <div>Currently in Archive</div>
    </RootLayout>
  );
}
