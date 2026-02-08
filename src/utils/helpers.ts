export function subscribeStorage(key: string, callback: (event: StorageEvent) => void, storage?: 'local' | 'session') {
  const handler = (event: StorageEvent) => {
    if (event.key !== key) {
      return;
    }
    if (storage === 'local' && (typeof localStorage === 'undefined' || event.storageArea !== localStorage)) {
      return;
    }
    if (storage === 'session' && (typeof sessionStorage === 'undefined' || event.storageArea !== sessionStorage)) {
      return;
    }

    callback(event);
  };

  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('storage', handler);
  };
}

export function subscribeBackForward(callback: (event: PageTransitionEvent) => void) {
  const handler = (event: PageTransitionEvent) => {
    const isBFCache =
      event.persisted ||
      (typeof performance !== 'undefined' &&
        (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'back_forward');

    if (isBFCache) {
      callback(event);
    }
  };

  window.addEventListener('pageshow', handler);
  return () => {
    window.removeEventListener('pageshow', handler);
  };
}
