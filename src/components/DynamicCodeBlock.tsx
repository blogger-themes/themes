import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { HighlightResult } from '@/web-workers/shiki';
import { CodeBlockPre, CodeBlockRoot, type CodeBlockRootProps, LangIcon, Placeholder } from './CodeBlock';

export interface DynamicCodeBlockProps extends CodeBlockRootProps {
  code: string;
  lang?: string;
}

export default function DynamicCodeBlock({ code, lang, icon, className, style, ...props }: DynamicCodeBlockProps) {
  const [result, setResult] = useState<HighlightResult>();

  useEffect(() => {
    if (lang) {
      import('@/web-workers/shiki').then(async ({ highlight }) => {
        setResult(await highlight(code, lang));
      });
    }
  }, [code, lang]);

  const node = useMemo(
    () => <code dangerouslySetInnerHTML={result ? { __html: result.content } : undefined}>{result ? undefined : <Placeholder code={code} />}</code>,
    [code, lang, result],
  );

  return (
    <CodeBlockRoot
      {...props}
      icon={icon ?? (lang && <LangIcon lang={lang} />)}
      className={cn('shiki', className, result?.props.className)}
      style={{
        ...result?.props.style,
        ...style,
      }}
    >
      <CodeBlockPre>{node}</CodeBlockPre>
    </CodeBlockRoot>
  );
}
