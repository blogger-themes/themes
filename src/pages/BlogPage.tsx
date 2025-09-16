import { Link } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import type { BloggerData } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function Blog({ data }: Props) {
  return (
    <RootLayout data={data}>
      <div>Currently in Blog</div>
      <Link to="/">Navigate to Home</Link>
    </RootLayout>
  );
}
