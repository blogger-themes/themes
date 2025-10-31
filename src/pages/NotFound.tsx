import { Link } from 'react-router';

export default function NotFound() {
  return (
    <>
      <div className="text-xl font-semibold">Not Found</div>
      <div>
        The page you are looking for was not found! Go to{' '}
        <Link to="/" className="underline">
          Home
        </Link>
      </div>
    </>
  );
}
