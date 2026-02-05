import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  AnchorIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  CheckIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  CodeIcon,
  DumbbellIcon,
  FileTextIcon,
  GitBranchIcon,
  HelpCircleIcon,
  InfoIcon,
  LightbulbIcon,
  ListIcon,
  MessageCircleIcon,
  MessageSquareWarningIcon,
  PenToolIcon,
  PuzzleIcon,
  RotateCcwIcon,
  ShieldAlertIcon,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const calloutConfig = {
  note: {
    style: 'border-blue-500 dark:bg-blue-950/5',
    textColor: 'text-blue-700 dark:text-blue-300',
    Icon: InfoIcon,
  },
  tip: {
    style: 'border-green-500 dark:bg-green-950/5',
    textColor: 'text-green-700 dark:text-green-300',
    Icon: LightbulbIcon,
  },
  warning: {
    style: 'border-amber-500 dark:bg-amber-950/5',
    textColor: 'text-amber-700 dark:text-amber-300',
    Icon: AlertTriangleIcon,
  },
  danger: {
    style: 'border-red-500 dark:bg-red-950/5',
    textColor: 'text-red-700 dark:text-red-300',
    Icon: ShieldAlertIcon,
  },
  important: {
    style: 'border-purple-500 dark:bg-purple-950/5',
    textColor: 'text-purple-700 dark:text-purple-300',
    Icon: MessageSquareWarningIcon,
  },
  definition: {
    style: 'border-purple-500 dark:bg-purple-950/5',
    textColor: 'text-purple-700 dark:text-purple-300',
    Icon: BookOpenIcon,
  },
  theorem: {
    style: 'border-teal-500 dark:bg-teal-950/5',
    textColor: 'text-teal-700 dark:text-teal-300',
    Icon: CheckCircleIcon,
  },
  lemma: {
    style: 'border-sky-400 dark:bg-sky-950/5',
    textColor: 'text-sky-700 dark:text-sky-300',
    Icon: PuzzleIcon,
  },
  proof: {
    style: 'border-gray-500 dark:bg-gray-950/5',
    textColor: 'text-gray-700 dark:text-gray-300',
    Icon: CheckSquareIcon,
  },
  corollary: {
    style: 'border-cyan-500 dark:bg-cyan-950/5',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    Icon: GitBranchIcon,
  },
  proposition: {
    style: 'border-slate-500 dark:bg-slate-950/5',
    textColor: 'text-slate-700 dark:text-slate-300',
    Icon: FileTextIcon,
  },
  axiom: {
    style: 'border-violet-600 dark:bg-violet-950/5',
    textColor: 'text-violet-700 dark:text-violet-300',
    Icon: AnchorIcon,
  },
  conjecture: {
    style: 'border-pink-500 dark:bg-pink-950/5',
    textColor: 'text-pink-700 dark:text-pink-300',
    Icon: HelpCircleIcon,
  },
  notation: {
    style: 'border-slate-400 dark:bg-slate-950/5',
    textColor: 'text-slate-700 dark:text-slate-300',
    Icon: PenToolIcon,
  },
  remark: {
    style: 'border-gray-400 dark:bg-gray-950/5',
    textColor: 'text-gray-700 dark:text-gray-300',
    Icon: MessageCircleIcon,
  },
  intuition: {
    style: 'border-yellow-500 dark:bg-yellow-950/5',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    Icon: LightbulbIcon,
  },
  recall: {
    style: 'border-blue-300 dark:bg-blue-950/5',
    textColor: 'text-blue-600 dark:text-blue-300',
    Icon: RotateCcwIcon,
  },
  explanation: {
    style: 'border-lime-500 dark:bg-lime-950/5',
    textColor: 'text-lime-700 dark:text-lime-300',
    Icon: HelpCircleIcon,
  },
  example: {
    style: 'border-emerald-500 dark:bg-emerald-950/5',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    Icon: CodeIcon,
  },
  exercise: {
    style: 'border-indigo-500 dark:bg-indigo-950/5',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    Icon: DumbbellIcon,
  },
  problem: {
    style: 'border-orange-600 dark:bg-orange-950/5',
    textColor: 'text-orange-700 dark:text-orange-300',
    Icon: AlertCircleIcon,
  },
  answer: {
    style: 'border-teal-500 dark:bg-teal-950/5',
    textColor: 'text-teal-700 dark:text-teal-300',
    Icon: CheckIcon,
  },
  solution: {
    style: 'border-emerald-600 dark:bg-emerald-950/5',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    Icon: CheckCircle2Icon,
  },
  summary: {
    style: 'border-sky-500 dark:bg-sky-950/5',
    textColor: 'text-sky-700 dark:text-sky-300',
    Icon: ListIcon,
  },
} as const;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const calloutVariants = cva('relative px-4 py-3 my-6 border-l-4 text-sm', {
  variants: {
    variant: Object.fromEntries(Object.entries(calloutConfig).map(([key, config]) => [key, config.style])),
  },
  defaultVariants: {
    variant: 'note',
  },
});

export const validCalloutVariants = Object.keys(calloutConfig);

export type CalloutVariant = keyof typeof calloutConfig;

export interface CalloutProps extends VariantProps<typeof calloutVariants>, Omit<ComponentProps<'details'>, 'title'> {
  title?: ReactNode;
  variant?: CalloutVariant;
}

export default function Callout({ children, title, variant = 'note', open = true, className, ...rest }: CalloutProps) {
  const { Icon, textColor } = calloutConfig[variant];

  return (
    <details
      className={cn(calloutVariants({ variant }), className, '[&[open]>summary_svg:last-child]:rotate-180 [&[open]>summary]:mb-3')}
      open={open}
      {...rest}
    >
      <summary className="flex cursor-pointer items-center font-medium [&::-webkit-details-marker]:hidden">
        <Icon className={cn('mr-2 size-4 shrink-0', textColor)} />
        <span className={cn('font-medium mr-2', textColor)}>
          {capitalize(variant)}
          {title && <span className="font-normal opacity-70"> ({title})</span>}
        </span>
        <ChevronDownIcon className={cn('ml-auto h-4 w-4 shrink-0 transition-transform duration-200', textColor)} />
      </summary>
      <div>{children}</div>
    </details>
  );
}
