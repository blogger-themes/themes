import { cn } from '@themes/ui/lib/utils';
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
import type { HTMLAttributes, ReactNode } from 'react';

const calloutConfig = {
	note: {
		name: 'Note',
		style: 'before:bg-blue-400/60',
		textColor: 'text-blue-700 dark:text-blue-300',
		Icon: InfoIcon,
	},
	tip: {
		name: 'Tip',
		style: 'before:bg-green-400/60',
		textColor: 'text-green-700 dark:text-green-300',
		Icon: LightbulbIcon,
	},
	warning: {
		name: 'Warning',
		style: 'before:bg-amber-400/60',
		textColor: 'text-amber-700 dark:text-amber-300',
		Icon: AlertTriangleIcon,
	},
	danger: {
		name: 'Danger',
		style: 'before:bg-red-400/60',
		textColor: 'text-red-700 dark:text-red-300',
		Icon: ShieldAlertIcon,
	},
	important: {
		name: 'Important',
		style: 'before:bg-purple-400/60',
		textColor: 'text-purple-700 dark:text-purple-300',
		Icon: MessageSquareWarningIcon,
	},
	definition: {
		name: 'Definition',
		style: 'before:bg-purple-400/60',
		textColor: 'text-purple-700 dark:text-purple-300',
		Icon: BookOpenIcon,
	},
	theorem: {
		name: 'Theorem',
		style: 'before:bg-teal-400/60',
		textColor: 'text-teal-700 dark:text-teal-300',
		Icon: CheckCircleIcon,
	},
	lemma: {
		name: 'Lemma',
		style: 'before:bg-sky-400/60',
		textColor: 'text-sky-700 dark:text-sky-300',
		Icon: PuzzleIcon,
	},
	proof: {
		name: 'Proof',
		style: 'before:bg-gray-400/60',
		textColor: 'text-gray-700 dark:text-gray-300',
		Icon: CheckSquareIcon,
	},
	corollary: {
		name: 'Corollary',
		style: 'before:bg-cyan-400/60',
		textColor: 'text-cyan-700 dark:text-cyan-300',
		Icon: GitBranchIcon,
	},
	proposition: {
		name: 'Proposition',
		style: 'before:bg-slate-400/60',
		textColor: 'text-slate-700 dark:text-slate-300',
		Icon: FileTextIcon,
	},
	axiom: {
		name: 'Axiom',
		style: 'before:bg-violet-400/60',
		textColor: 'text-violet-700 dark:text-violet-300',
		Icon: AnchorIcon,
	},
	conjecture: {
		name: 'Conjecture',
		style: 'before:bg-pink-400/60',
		textColor: 'text-pink-700 dark:text-pink-300',
		Icon: HelpCircleIcon,
	},
	notation: {
		name: 'Notation',
		style: 'before:bg-slate-400/60',
		textColor: 'text-slate-700 dark:text-slate-300',
		Icon: PenToolIcon,
	},
	remark: {
		name: 'Remark',
		style: 'before:bg-gray-400/60',
		textColor: 'text-gray-700 dark:text-gray-300',
		Icon: MessageCircleIcon,
	},
	intuition: {
		name: 'Intuition',
		style: 'before:bg-yellow-400/60',
		textColor: 'text-yellow-700 dark:text-yellow-300',
		Icon: LightbulbIcon,
	},
	recall: {
		name: 'Recall',
		style: 'before:bg-blue-400/60',
		textColor: 'text-blue-600 dark:text-blue-300',
		Icon: RotateCcwIcon,
	},
	explanation: {
		name: 'Explanation',
		style: 'before:bg-lime-400/60',
		textColor: 'text-lime-700 dark:text-lime-300',
		Icon: HelpCircleIcon,
	},
	example: {
		name: 'Example',
		style: 'before:bg-emerald-400/60',
		textColor: 'text-emerald-700 dark:text-emerald-300',
		Icon: CodeIcon,
	},
	exercise: {
		name: 'Exercise',
		style: 'before:bg-indigo-400/60',
		textColor: 'text-indigo-700 dark:text-indigo-300',
		Icon: DumbbellIcon,
	},
	problem: {
		name: 'Problem',
		style: 'before:bg-orange-400/60',
		textColor: 'text-orange-700 dark:text-orange-300',
		Icon: AlertCircleIcon,
	},
	answer: {
		name: 'Answer',
		style: 'before:bg-teal-400/60',
		textColor: 'text-teal-700 dark:text-teal-300',
		Icon: CheckIcon,
	},
	solution: {
		name: 'Solution',
		style: 'before:bg-emerald-400/60',
		textColor: 'text-emerald-700 dark:text-emerald-300',
		Icon: CheckCircle2Icon,
	},
	summary: {
		name: 'Summary',
		style: 'before:bg-sky-400/60',
		textColor: 'text-sky-700 dark:text-sky-300',
		Icon: ListIcon,
	},
} as const;

const calloutVariants = cva(
	'relative my-4 p-3 ps-3.75 bg-card border rounded-xl shadow-sm text-sm before:absolute before:w-0.5 before:top-3 before:bottom-3 before:inset-s-1 before:rounded-sm',
	{
		variants: {
			variant: Object.fromEntries(
				Object.entries(calloutConfig).map(([key, config]) => [
					key,
					config.style,
				]),
			),
		},
		defaultVariants: {
			variant: 'note',
		},
	},
);

export const validCalloutVariants = Object.keys(calloutConfig);

export type CalloutVariant = keyof typeof calloutConfig;

export interface CalloutProps
	extends VariantProps<typeof calloutVariants>,
		Omit<HTMLAttributes<HTMLElement>, 'title'> {
	title?: ReactNode;
	variant?: CalloutVariant;
	collapsible?: boolean;
	open?: boolean;
}

export default function Callout({
	children,
	title,
	collapsible = true,
	variant = 'note',
	open = true,
	className,
	...props
}: CalloutProps) {
	if (!calloutConfig[variant]) {
		throw new TypeError(
			`'${variant}' is not a valid variant for Callout component.`,
		);
	}

	const { Icon, textColor, name } = calloutConfig[variant];

	const Details = collapsible ? 'details' : 'div';
	const Summary = collapsible ? 'summary' : 'div';

	return (
		<Details
			className={cn(
				calloutVariants({ variant }),
				collapsible &&
					'[&[open]>summary_svg:last-child]:rotate-180 [&[open]>summary]:mb-3',
				className,
			)}
			{...(collapsible ? { open } : {})}
			{...props}
		>
			<Summary
				className={cn(
					'flex gap-2 items-center font-medium',
					collapsible
						? 'cursor-pointer [&::-webkit-details-marker]:hidden'
						: 'mb-3',
				)}
			>
				<Icon className={cn('size-4 shrink-0', textColor)} />
				<span className={cn('font-medium', textColor)}>
					{name}
					{title && <span className="font-normal opacity-70"> ({title})</span>}
				</span>
				{collapsible && (
					<ChevronDownIcon
						className={cn(
							'ml-auto size-4 shrink-0 transition-transform duration-200',
							textColor,
						)}
					/>
				)}
			</Summary>
			<div>{children}</div>
		</Details>
	);
}
