import type { StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand';
import type {} from 'zustand/middleware/persist';
import { subscribeBackForward, subscribeStorage } from '@/utils/helpers';

export interface SyncPersistOptions {
  backForward?: boolean;
  storageUpdate?: boolean;
  storage?: 'local' | 'session';
}

export function syncPersist<T, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = [], U = T>(
  config: StateCreator<T, Mps, [['zustand/persist', U], ...Mcs]>,
  { backForward = true, storageUpdate = true, storage }: SyncPersistOptions = {},
): StateCreator<T, Mps, [['zustand/persist', U], ...Mcs]> {
  return (set, get, store) => {
    const result = config(set, get, store);

    if (typeof window !== 'undefined' && 'persist' in store) {
      const key = store.persist.getOptions().name;

      if (backForward) {
        // Rehydrate when coming from BFCache
        subscribeBackForward(() => {
          store.persist.rehydrate();
        });
      }

      // Rehydrate when storage changes (multi-tab sync)
      if (key && storageUpdate) {
        subscribeStorage(
          key,
          () => {
            store.persist.rehydrate();
          },
          storage,
        );
      }
    }

    return result;
  };
}

export type ZState = NonNullable<object>;
export interface ZStore<T extends ZState> {
  state: T;
  version: number;
}

export function getZState<T extends ZState = ZState>(key: string, version = 0): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    const parsed: Partial<ZStore<T>> = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null && parsed.version === version) {
      return parsed.state || ({} as T);
    }
  } catch (_) {}

  return null;
}

export function setZState<T extends ZState = ZState>(key: string, state: Partial<T> | ((prevState: T | null) => Partial<T>), version = 0): void {
  if (typeof window === 'undefined') {
    return;
  }

  const currentState = getZState<T>(key, version);
  const nextStore = {
    state: {
      ...(currentState || {}),
      ...(typeof state === 'function' ? state(currentState) : state),
    },
    version,
  };
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(key, JSON.stringify(nextStore));
  } catch (_) {}
}

export type SetStateFunctionAction<T> = T | ((prev: T) => T);
export type SetStateFunction<T> = (action: SetStateFunctionAction<T>) => void;

export function createStateSetterFunction<State, Key extends keyof State>(set: StoreApi<State>['setState'], key: Key): SetStateFunction<State[Key]> {
  return (action) => {
    set((prevState) => {
      const current = prevState[key];
      const next = typeof action === 'function' ? (action as (prev: State[Key]) => State[Key])(current) : action;
      return {
        ...prevState,
        [key]: next,
      };
    });
  };
}
