import { SiAstro, SiCplusplus, SiCss, SiHtml5, SiJavascript, SiJson, SiReact, SiTypescript } from '@icons-pack/react-simple-icons';
import { type ComponentProps, type ReactNode, useMemo } from 'react';

export const langIcons: {
  langs: string[];
  icon: (props: ComponentProps<'svg'>) => ReactNode;
}[] = [
  {
    langs: ['js', 'javascript'],
    icon: SiJavascript,
  },
  {
    langs: ['ts', 'typescript'],
    icon: SiTypescript,
  },
  {
    langs: ['jsx', 'tsx'],
    icon: SiReact,
  },
  {
    langs: ['html'],
    icon: SiHtml5,
  },
  {
    langs: ['css'],
    icon: SiCss,
  },
  {
    langs: ['json', 'jsonc'],
    icon: SiJson,
  },
  {
    langs: ['c'],
    icon(props) {
      return (
        /**
         * Modified icon of simple-icons:cplusplus
         * Icon by Simple Icons Collaborators
         *
         * @license https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md
         */
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24" {...props}>
          <title>C</title>
          <path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11z" />
        </svg>
      );
    },
  },
  {
    langs: ['cpp', 'c++'],
    icon: SiCplusplus,
  },
  {
    langs: ['astro'],
    icon: SiAstro,
  },
];

export interface LangIconProps extends ComponentProps<'svg'> {
  fallback?: (props: ComponentProps<'svg'>) => ReactNode;
  lang: string;
}

export function LangIcon({ lang, fallback: Fallback, ...props }: LangIconProps) {
  const Icon = useMemo(() => langIcons.find((e) => e.langs.includes(lang.toLowerCase()))?.icon, [lang]);

  if (Icon) {
    return <Icon {...props} />;
  }
  if (Fallback) {
    return <Fallback {...props} />;
  }
}
