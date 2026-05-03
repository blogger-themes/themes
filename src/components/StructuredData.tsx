import { createElement } from '@deox/utils/create-element';
import { useEffect, useMemo, useRef } from 'react';
import type { JsonLdObject, WithContext } from 'schema-dts';

export interface StructuredDataProps<T extends JsonLdObject> {
  data: WithContext<T>;
}

export default function StructuredData<T extends JsonLdObject>({ data }: StructuredDataProps<T>) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const json = useMemo(() => JSON.stringify(data), [data]);

  useEffect(() => {
    if (!scriptRef.current) {
      scriptRef.current = createElement('script', {
        type: 'application/ld+json',
        textContent: json,
      });
      document.head.appendChild(scriptRef.current);
    } else if (scriptRef.current.textContent !== json) {
      scriptRef.current.textContent = json;
    }
  }, [json]);

  useEffect(() => {
    return () => {
      scriptRef.current?.remove();
      scriptRef.current = null;
    };
  }, []);

  return null;
}
