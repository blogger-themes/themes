import { SiGithub } from '@icons-pack/react-simple-icons';
import { MailIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

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
          {[
            {
              label: 'Github',
              link: 'https://github.com/kumardeo',
              icon: SiGithub,
            },
            {
              label: 'Email',
              link: 'mailto:deo@fineshopdesign.com',
              icon: MailIcon,
            },
          ].map(({ label, link, icon: Icon }) => (
            <li key={`${label}:${link}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <a href={link}>
                      <span className="sr-only">{label}</span>
                      <Icon className="size-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
