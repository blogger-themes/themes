import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  code: string;
  lang?: string;
}

export default function CodeBlock({ code, lang }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>();

  useEffect(() => {
    if (lang) {
      import('@/web-workers/shiki-worker').then(async ({ worker }) => {
        const html = await worker.call('codeToHtml', code, {
          lang,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
          defaultColor: false,
        });
        setHighlightedCode(html.replace(/^<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>$/, '$1'));
      });
    }
  }, [code, lang]);

  return (
    <pre>
      {highlightedCode ? (
        <code className={cn('shiki', `language-${lang}`)} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <code>{code}</code>
      )}
    </pre>
  );
}
