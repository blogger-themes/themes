import { register } from '@deox/worker-rpc/register';
import type { CodeToHastOptions } from 'shiki/core';
import { getHighlighter } from '../highlighter';
import { transformers } from '../transformers';
import type { HighlightOptions, HighlightResult } from './types';
import { processShikiHtml } from './utils';

const registered = register(async () => {
  const highlighter = await getHighlighter();

  return {
    highlight(code: string, lang: string, options: HighlightOptions = {}): HighlightResult {
      const opts: CodeToHastOptions = {
        lang,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        defaultColor: false,
        ...options,
        transformers,
      };

      const html = highlighter.codeToHtml(code, opts);

      if (opts.structure === 'inline') {
        return {
          html,
          props: {},
        };
      }

      return processShikiHtml(html);
    },
  };
});

export type Registered = typeof registered;
