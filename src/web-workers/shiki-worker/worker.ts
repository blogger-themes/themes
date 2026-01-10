import { register } from '@deox/worker-rpc/register';
import type { CodeToHastOptions, CodeToTokensOptions } from 'shiki/core';
import { highlighterPromise } from '@/lib/shiki/wasm';

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
  };
});

export type Registered = typeof registered;
