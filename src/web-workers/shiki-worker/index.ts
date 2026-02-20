import { Worker } from '@deox/worker-rpc';
import type { HighlightOptions, Registered } from './worker';

export const worker = new Worker<Registered>(new URL('./worker.ts', import.meta.url), {
  name: 'shiki-worker',
  type: 'module',
});

export async function highlight(code: string, lang: string, options: HighlightOptions = {}) {
  return await worker.call('highlight', code, lang, options);
}

export type { HighlightOptions, HighlightProps, HighlightResult } from './worker';
