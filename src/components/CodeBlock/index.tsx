// TODO: improve this component, add missing copy functionality

import { ClipboardIcon, TextAlignJustifyIcon, TextWrapIcon } from 'lucide-react';
import { type ComponentProps, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { HighlightResult } from '@/web-workers/shiki-worker';
import { Button } from '../ui/button';
import { langIcons } from './icons';

function Placeholder({ code }: { code: string }) {
  return (
    <>
      {code.split('\n').map((line, i) => (
        <span key={`${i}:${line}`} className="line">
          {line}
        </span>
      ))}
    </>
  );
}

export interface CodeBlockProps extends ComponentProps<'figure'> {
  code: string;
  lang?: string;
  title?: string;
  showLineNumbers?: boolean;
  wrap?: boolean;
  actionCopy?: boolean;
  actionWrap?: boolean;
}

export default function CodeBlock({
  code,
  lang,
  title,
  showLineNumbers = true,
  wrap = false,
  actionCopy = true,
  actionWrap = true,
  className,
  ...props
}: CodeBlockProps) {
  const [highlightedResult, setHighlightedResult] = useState<HighlightResult | null>(null);
  const [isWrapped, setIsWrapped] = useState(wrap);

  useEffect(() => {
    if (lang) {
      import('@/web-workers/shiki-worker').then(async ({ highlight }) => {
        const result = await highlight(code, lang);
        setHighlightedResult(result);
      });
    }
  }, [code, lang]);

  const Icon = useMemo(() => (lang ? langIcons.find((e) => e.langs.includes(lang.toLowerCase()))?.icon : undefined), [lang]);

  return (
    <figure
      dir="ltr"
      className={cn(
        'shiki my-4 bg-card border rounded-xl relative shadow-sm not-prose overflow-hidden text-sm',
        className,
        highlightedResult?.props.className,
      )}
      style={highlightedResult?.props.style}
      {...(showLineNumbers ? { 'data-line-numbers': '' } : {})}
      {...(isWrapped ? { 'data-wrapped': '' } : {})}
      {...props}
    >
      {(title || actionCopy || actionWrap) && (
        <div className="flex text-muted-foreground items-center gap-2 h-9.5 border-b px-4">
          {Icon && <Icon className="size-3.5 shrink-0" />}
          {title && <figcaption className="flex-1 truncate">{title}</figcaption>}
          {(actionCopy || actionWrap) && (
            <div className="flex gap-0.5 ms-auto -me-2.5">
              {actionWrap && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setIsWrapped((current) => !current);
                  }}
                >
                  <span className="sr-only">Wrap</span>
                  {isWrapped ? <TextAlignJustifyIcon /> : <TextWrapIcon />}
                </Button>
              )}
              {actionCopy && (
                <Button type="button" variant="ghost" size="icon-sm">
                  <span className="sr-only">Copy</span>
                  <ClipboardIcon />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      <section
        className={cn(
          'text-[0.8125rem] py-3.5 max-h-[600px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
          isWrapped ? 'overflow-x-hidden overflow-y-auto' : 'overflow-auto',
        )}
      >
        <pre className={isWrapped ? 'wrap-break-word whitespace-pre-wrap' : 'min-w-full w-max'}>
          <code
            className="bg-transparent p-0 flex flex-col"
            {...(highlightedResult
              ? {
                  dangerouslySetInnerHTML: { __html: highlightedResult.content },
                }
              : {
                  children: <Placeholder code={code} />,
                })}
          />
        </pre>
      </section>
    </figure>
  );
}
