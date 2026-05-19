import type { HighlightResult } from '@themes/shiki';
import { highlight } from '@themes/shiki/worker';
import { cn } from '@themes/ui/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { CodeBlockPre, CodeBlockRoot, type CodeBlockRootProps, LangIcon, Placeholder } from './CodeBlock';

export interface DynamicCodeBlockProps extends CodeBlockRootProps {
  code: string;
  lang?: string;
}

export default function DynamicCodeBlock({ code, lang, icon, className, style, ...props }: DynamicCodeBlockProps) {
  const [result, setResult] = useState<HighlightResult | null>();

  useEffect(() => {
    let cancelled = false;
    if (lang) {
      highlight(code, lang).then((res) => {
        if (!cancelled) {
          setResult(res);
        }
      });
    } else {
      setResult(null);
    }
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const node = useMemo(() => {
    if (result) {
      return <code dangerouslySetInnerHTML={{ __html: result.html }} />;
    }
    return <code>{<Placeholder code={code} />}</code>;
  }, [code, result]);

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
