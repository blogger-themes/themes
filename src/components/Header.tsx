import { Link } from 'react-router';
import { ThemeToggle } from './ThemeToggle';

export interface Props {
  title: string;
}

export default function Header({ title }: Props) {
  return (
    <header className="sticky top-0 bg-background/50 z-50 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between gap-4 px-5 py-2.5 min-h-14 max-w-5xl mx-auto">
        <Link className="flex items-center justify-center shrink-0 gap-3" to="/">
          <span className="text-lg font-medium">{title}</span>
        </Link>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
