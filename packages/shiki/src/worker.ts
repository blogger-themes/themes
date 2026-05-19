import { Worker } from '@deox/worker-rpc';
import type { HighlightOptions, HighlightResult } from './lib/types';
import type { Registered } from './lib/worker';

let worker: Worker<Registered> | undefined;
export function getWorker(): Worker<Registered> {
  if (!worker) {
    worker = new Worker<Registered>(new URL('./lib/worker', import.meta.url), {
      type: 'module',
      name: 'shiki',
    });
  }
  return worker;
}

export async function highlight(code: string, lang: string, options?: HighlightOptions): Promise<HighlightResult> {
  return getWorker().call('highlight', code, lang, options);
}
