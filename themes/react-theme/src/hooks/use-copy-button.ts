'use client';

import { type MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';

export function useCopyButton(onCopy: () => void | Promise<void>): [checked: boolean, onClick: MouseEventHandler, error: boolean] {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);
  const callbackRef = useRef(onCopy);
  const timeoutRef = useRef<number | null>(null);

  callbackRef.current = onCopy;

  const onClick: MouseEventHandler = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    const res = Promise.resolve(callbackRef.current());

    void res
      .then(
        () => {
          setChecked(true);
        },
        () => {
          setError(true);
        },
      )
      .finally(() => {
        timeoutRef.current = window.setTimeout(() => {
          setChecked(false);
          setError(false);
        }, 1500);
      });
  }, []);

  // Avoid updates after being unmounted
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return [checked, onClick, error];
}
