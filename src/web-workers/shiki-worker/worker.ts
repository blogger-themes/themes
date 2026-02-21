import { register } from '@deox/worker-rpc/register';
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveNotationEscape,
} from '@shikijs/transformers';
import type { CodeToHastOptions, CodeToTokensOptions } from 'shiki/core';
import styleToJs from 'style-to-js';
import { highlighterPromise } from '@/lib/shiki/wasm';

export interface HighlightProps {
  style?: Record<string, string | number>;
  className?: string;
}

export type HighlightOptions = Partial<Omit<CodeToHastOptions, 'transformers'>>;

export interface HighlightResult {
  content: string;
  props: HighlightProps;
}

const registered = register(async () => {
  const highlighter = await highlighterPromise;

  return {
    codeToTokens(code: string, options: CodeToTokensOptions) {
      return highlighter.codeToTokens(code, options);
    },
    codeToHast(code: string, options: CodeToHastOptions) {
      return highlighter.codeToHast(code, options);
    },
    codeToHtml(code: string, options: CodeToHastOptions) {
      return highlighter.codeToHtml(code, options);
    },
    highlight(code: string, lang: string, options: HighlightOptions = {}): HighlightResult {
      const opts: CodeToHastOptions = {
        lang,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        defaultColor: false,
        ...options,
        transformers: [
          transformerNotationDiff(),
          transformerNotationHighlight(),
          transformerNotationWordHighlight(),
          transformerNotationFocus(),
          transformerNotationErrorLevel(),
          transformerRemoveNotationEscape(),
        ],
      };
      const html = highlighter.codeToHtml(code, opts);

      if (opts.structure === 'inline') {
        return {
          content: html,
          props: {},
        };
      }

      const matches = html.match(/^<pre([^>]*)><code[^>]*>([\s\S]*?)<\/code><\/pre>$/);

      return {
        content: matches?.[2] || '',
        props: matches?.[1] ? processAttributes(matches[1]) : {},
      };
    },
  };
});

export type Registered = typeof registered;

function processAttributes(htmlAttrs: string) {
  const props: HighlightProps = {};
  const regex = /(class|style)="([^"]*)"/g;

  let match = regex.exec(htmlAttrs);

  while (match !== null) {
    const name = match[1];
    const value = match[2];

    if (name === 'class') {
      props.className = value;
    } else if (name === 'style') {
      props.style = styleToJs(value, { reactCompat: true });
    }

    match = regex.exec(htmlAttrs);
  }

  return props;
}
