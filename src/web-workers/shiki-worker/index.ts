import { Worker } from '@deox/worker-rpc';
import type { Registered } from './worker';

export const worker = new Worker<Registered>(new URL('./worker.ts', import.meta.url), {
  name: 'shiki-worker',
  type: 'module',
});
