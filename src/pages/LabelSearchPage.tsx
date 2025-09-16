import RootLayout from '@/layouts/RootLayout';
import type { BloggerData } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function LabelSearchPage({ data }: Props) {
  return <RootLayout data={data}>Label search</RootLayout>;
}
