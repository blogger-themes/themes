// TODO: improve this component

import { CheckIcon, ClipboardIcon, ListIndentDecreaseIcon, ListOrderedIcon, TextAlignJustifyIcon, TextWrapIcon } from 'lucide-react';
import { type ComponentProps, type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useCopyButton } from '@/hooks/use-copy-button';
import { cn } from '@/lib/utils';
import type { HighlightResult } from '@/web-workers/shiki-worker';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
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

function CopyButton({ containerRef, ...props }: ComponentProps<typeof Button> & { containerRef: RefObject<HTMLElement | null> }) {
  const [checked, onClick] = useCopyButton(() => {
    if (!containerRef.current) return;

    const clone = containerRef.current.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.nd-copy-ignore').forEach((node) => {
      node.replaceWith('\n');
    });

    void navigator.clipboard.writeText(clone.textContent ?? '');
  });

  return (
    <Button {...props} onClick={onClick}>
      <span className="sr-only">{checked ? 'Copied text' : 'Copy text'}</span>
      {checked ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}

export interface CodeBlockProps extends ComponentProps<'figure'> {
  code: string;
  lang?: string;
  title?: string;
  wrap?: boolean;
  lineNumbers?: boolean;
  actionCopy?: boolean;
  actionWrap?: boolean;
  actionLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  lang,
  title,
  wrap = false,
  lineNumbers = true,
  actionCopy = true,
  actionWrap = true,
  actionLineNumbers = true,
  className,
  ...props
}: CodeBlockProps) {
  const [highlightedResult, setHighlightedResult] = useState<HighlightResult | null>(null);
  const [isWrapped, setIsWrapped] = useState(wrap);
  const [showLineNumbers, setShowLineNumbers] = useState(lineNumbers);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (lang) {
      import('@/web-workers/shiki-worker').then(async ({ highlight }) => {
        const result = await highlight(code, lang);
        setHighlightedResult(result);
      });
    }
  }, [code, lang]);

  const Icon = useMemo(() => {
    if (lang) {
      return langIcons.find((e) => e.langs.includes(lang.toLowerCase()))?.icon;
    }
  }, [lang]);

  const node = useMemo(() => {
    return (
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
    );
  }, [code, lang, highlightedResult]);

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
              {actionLineNumbers && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setShowLineNumbers((current) => !current);
                      }}
                    >
                      <span className="sr-only">{showLineNumbers ? 'Hide line numbers' : 'Show line numbers'}</span>
                      {showLineNumbers ? <ListIndentDecreaseIcon /> : <ListOrderedIcon />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showLineNumbers ? 'Hide line numbers' : 'Show line numbers'}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {actionWrap && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setIsWrapped((current) => !current);
                      }}
                    >
                      <span className="sr-only">{isWrapped ? 'No wrap' : 'Wrap'}</span>
                      {isWrapped ? <TextAlignJustifyIcon /> : <TextWrapIcon />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isWrapped ? 'No wrap' : 'Wrap'}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {actionCopy && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CopyButton containerRef={preRef} type="button" variant="ghost" size="icon-sm" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
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
        <pre ref={preRef} className={isWrapped ? 'wrap-break-word whitespace-pre-wrap' : 'min-w-full w-max'}>
          {node}
        </pre>
      </section>
    </figure>
  );
}
