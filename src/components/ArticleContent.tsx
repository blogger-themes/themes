import { convertFromHTML } from '@deox/dom-to-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ArticleContentProps {
  html: string;
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [highlightedCode, setHighlightedCode] = useState<string>();

  useEffect(() => {
    if (language) {
      import('@/web-workers/shiki-worker').then(async ({ worker }) => {
        const html = await worker.call('codeToHtml', code, {
          lang: language,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
          defaultColor: false,
        });
        setHighlightedCode(html.replace(/^<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>$/, '$1'));
      });
    }
  }, [code, language]);

  return (
    <pre>
      {highlightedCode ? (
        <code className={cn('shiki', `language-${language}`)} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <code>{code}</code>
      )}
    </pre>
  );
}

export default function ArticleContent({ html }: ArticleContentProps) {
  return convertFromHTML(html, {
    filter(node) {
      return node.nodeName !== 'SCRIPT';
    },
    transform(node) {
      if (node.nodeName === 'PRE') {
        const child = (node as Element).children[0];
        if (!child || !child.textContent) {
          return null;
        }
        const language = child.className.match(/\blanguage-([\w-]+)\b/i)?.[1];
        return <CodeBlock code={child.textContent} language={language} />;
      }
    },
  });
}
