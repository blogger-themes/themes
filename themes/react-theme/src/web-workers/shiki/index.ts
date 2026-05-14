import { Worker } from '@deox/worker-rpc';
import type { HighlightOptions, Registered } from './worker';

export const worker = new Worker<Registered>(new URL('./worker.ts', import.meta.url), {
  type: 'module',
  name: 'shiki',
});

export async function highlight(code: string, lang: string, options?: HighlightOptions) {
  return worker.call('highlight', code, lang, options);
}

export type { HighlightOptions, HighlightResult } from './worker';
