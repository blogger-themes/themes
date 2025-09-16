import { Link } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import type { BloggerData } from '@/utils/blogger-data';

export interface Props {
  data: BloggerData;
}

export default function NotFound({ data }: Props) {
  return (
    <RootLayout data={data}>
      <div className="text-xl font-semibold">Not Found</div>
      <div>
        The page you are looking for was not found! Go to{' '}
        <Link to="/" className="underline">
          Home
        </Link>
      </div>
    </RootLayout>
  );
}
