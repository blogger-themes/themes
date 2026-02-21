import { SiCss, SiHtml5, SiJavascript, SiJson, SiReact, SiTypescript } from '@icons-pack/react-simple-icons';
import type { ComponentProps, ReactNode } from 'react';

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
];
