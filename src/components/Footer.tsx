import { GithubIcon, MailIcon } from 'lucide-react';
import { buttonVariants } from './ui/button';
import { Separator } from './ui/separator';

export default function Footer() {
  return (
    <footer className="py-4">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-y-2 px-4 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-x-2 text-center">
          <span className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} All rights reserved.</span>
          <Separator orientation="vertical" className="hidden h-4! sm:block" />
          <p className="text-muted-foreground text-sm">
            Made with 🤍 by{' '}
            <a href="https://github.com/kumardeo" className="text-foreground" target="_blank" rel="noopener">
              Deo Kumar
            </a>
            !
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          <li>
            <a href="https://github.com/kumardeo" aria-label="GitHub" title="GitHub" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
              <GithubIcon className="size-4" />
            </a>
          </li>
          <li>
            <a href="mailto:deo@fineshopdesign.com" aria-label="Email" title="Email" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
              <MailIcon className="size-4" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
