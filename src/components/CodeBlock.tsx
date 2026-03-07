import { SiAstro, SiCplusplus, SiCss, SiHtml5, SiJavascript, SiJson, SiReact, SiTypescript } from '@icons-pack/react-simple-icons';
import { CheckIcon, ClipboardIcon, ListIndentDecreaseIcon, ListOrderedIcon, TextAlignJustifyIcon, TextWrapIcon, XIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode, type RefObject, useMemo, useRef, useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCopyButton } from '@/hooks/use-copy-button';
import { cn } from '@/lib/utils';

export interface CodeBlockRootProps extends Omit<ComponentProps<'figure'>, 'title'> {
  title?: ReactNode;
  icon?: ReactNode;
  showLineNumbers?: boolean;
  stickyLineNumbers?: boolean;
  wrapLines?: boolean;
  allowCopy?: boolean;
  allowWrapToggle?: boolean;
  allowLineNumbersToggle?: boolean;
}

export function CodeBlockRoot({
  title,
  icon,
  wrapLines = false,
  showLineNumbers: optShowLineNumbers = true,
  stickyLineNumbers = true,
  allowCopy = true,
  allowWrapToggle = true,
  allowLineNumbersToggle = true,
  children,
  className,
  ...props
}: CodeBlockRootProps) {
  const areaRef = useRef<HTMLElement>(null);
  const [isWrapped, setIsWrapped] = useState(wrapLines);
  const [showLineNumbers, setShowLineNumbers] = useState(optShowLineNumbers);

  return (
    <figure
      dir="ltr"
      {...props}
      tabIndex={-1}
      className={cn('not-prose my-4 bg-card rounded-xl relative border shadow-sm overflow-hidden text-sm', className)}
      data-line-numbers={showLineNumbers ? '' : undefined}
      data-line-sticky={stickyLineNumbers ? '' : undefined}
      data-line-wrapped={isWrapped ? '' : undefined}
    >
      {(title || allowLineNumbersToggle || allowWrapToggle || allowCopy) && (
        <div className="flex text-muted-foreground items-center gap-2 h-9.5 border-b px-4">
          {icon && <span className="[&_svg]:size-3.5 shrink-0">{icon}</span>}
          {title && <figcaption className="flex-1 truncate">{title}</figcaption>}
          {(allowLineNumbersToggle || allowWrapToggle || allowCopy) && (
            <div className="flex gap-0.5 ms-auto -me-2.5">
              {allowLineNumbersToggle && <LineButton enabled={showLineNumbers} onClick={() => setShowLineNumbers((current) => !current)} />}
              {allowWrapToggle && <WrapButton enabled={isWrapped} onClick={() => setIsWrapped((current) => !current)} />}
              {allowCopy && <CopyButton containerRef={areaRef} />}
            </div>
          )}
        </div>
      )}
      <section
        ref={areaRef}
        className={cn(
          'text-[0.8125rem] py-3.5 max-h-[600px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
          isWrapped
            ? 'overflow-x-hidden overflow-y-auto [&_pre]:wrap-break-word [&_pre]:whitespace-pre-wrap'
            : 'overflow-auto [&_pre]:min-w-full [&_pre]:w-max',
        )}
      >
        {children}
      </section>
    </figure>
  );
}

export interface CodeBlockPreProps extends ComponentProps<'pre'> {}

export function CodeBlockPre({ className, children }: CodeBlockPreProps) {
  return <pre className={cn('*:flex *:flex-col', className)}>{children}</pre>;
}

interface ActionButtonProps extends ComponentProps<'button'> {
  tooltip: ReactNode;
}

function ActionButton({ tooltip, className, children, ...props }: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            buttonVariants({
              variant: 'ghost',
              size: 'icon-sm',
              className: 'text-muted-foreground hover:text-accent-foreground',
            }),
            className,
          )}
          {...props}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

interface CopyButtonProps extends ComponentProps<'button'> {
  containerRef: RefObject<HTMLElement | null>;
}

function CopyButton({ className, containerRef, ...props }: CopyButtonProps) {
  const [checked, onClick, error] = useCopyButton(async () => {
    const pre = containerRef.current?.getElementsByTagName('pre').item(0);
    if (!pre) {
      return;
    }

    const clone = pre.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.nd-copy-ignore').forEach((node) => {
      node.replaceWith('\n');
    });

    await navigator.clipboard.writeText(clone.textContent ?? '');
  });

  const message = error ? 'Failed to copy' : checked ? 'Copied Text' : 'Copy Text';
  const icon = error ? <XIcon /> : checked ? <CheckIcon /> : <ClipboardIcon />;

  return (
    <ActionButton
      type="button"
      {...props}
      className={cn('data-checked:text-accent-foreground', className)}
      onClick={onClick}
      data-checked={checked ? '' : undefined}
      data-error={error ? '' : undefined}
      tooltip={<p>{message}</p>}
    >
      <span className="sr-only">{message}</span>
      {icon}
    </ActionButton>
  );
}

interface WrapButtonProps extends ComponentProps<'button'> {
  enabled: boolean;
}

function WrapButton({ enabled, ...props }: WrapButtonProps) {
  const message = enabled ? 'Disable line wrapping' : 'Enable line wrapping';
  const icon = enabled ? <TextAlignJustifyIcon /> : <TextWrapIcon />;

  return (
    <ActionButton type="button" {...props} data-checked={enabled ? '' : undefined} tooltip={<p>{message}</p>}>
      <span className="sr-only">{message}</span>
      {icon}
    </ActionButton>
  );
}

interface LineButtonProps extends ComponentProps<'button'> {
  enabled: boolean;
}

function LineButton({ enabled, ...props }: LineButtonProps) {
  const message = enabled ? 'Hide line numbers' : 'Show line numbers';
  const icon = enabled ? <ListIndentDecreaseIcon /> : <ListOrderedIcon />;

  return (
    <ActionButton type="button" {...props} data-checked={enabled ? '' : undefined} tooltip={<p>{message}</p>}>
      <span className="sr-only">{message}</span>
      {icon}
    </ActionButton>
  );
}

interface PlaceholderProps {
  code: string;
}

export function Placeholder({ code }: PlaceholderProps) {
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

export const langIcons: {
  langs: string[];
  icon: (props: ComponentProps<'svg'>) => ReactNode;
}[] = [
  {
    langs: ['js', 'javascript'],
    icon: SiJavascript,
  },
  {
    langs: ['ts', 'typescript'],
    icon: SiTypescript,
  },
  {
    langs: ['jsx', 'tsx'],
    icon: SiReact,
  },
  {
    langs: ['html'],
    icon: SiHtml5,
  },
  {
    langs: ['css'],
    icon: SiCss,
  },
  {
    langs: ['json', 'jsonc'],
    icon: SiJson,
  },
  {
    langs: ['c'],
    icon(props) {
      return (
        /**
         * Modified icon of simple-icons:cplusplus
         * Icon by Simple Icons Collaborators
         *
         * @license https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md
         */
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24" {...props}>
          <title>C</title>
          <path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11z" />
        </svg>
      );
    },
  },
  {
    langs: ['cpp', 'c++'],
    icon: SiCplusplus,
  },
  {
    langs: ['astro'],
    icon: SiAstro,
  },
];

export interface LangIconProps extends ComponentProps<'svg'> {
  fallback?: (props: ComponentProps<'svg'>) => ReactNode;
  lang: string;
}

export function LangIcon({ lang, fallback: Fallback, ...props }: LangIconProps) {
  const Icon = useMemo(() => langIcons.find((e) => e.langs.includes(lang.toLowerCase()))?.icon, [lang]);

  if (Icon) {
    return <Icon {...props} />;
  }
  if (Fallback) {
    return <Fallback {...props} />;
  }
}
