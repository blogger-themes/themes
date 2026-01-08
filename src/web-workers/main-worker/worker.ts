import { register } from '@deox/worker-rpc/register';

const registered = register(() => {
  return {
    hello() {
      return 'Hello World!';
    },
  };
});

export type Registered = typeof registered;
