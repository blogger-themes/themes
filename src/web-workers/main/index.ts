import { Worker } from '@deox/worker-rpc';
import type { Registered } from './worker';

export const worker = new Worker<Registered>(new URL('./worker', import.meta.url), {
  type: 'module',
  name: 'main',
});
