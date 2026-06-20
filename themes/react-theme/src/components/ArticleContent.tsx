import { convertFromHTML } from '@deox/dom-to-react';
import { cn } from '@themes/ui/lib/utils';
import GithubSlugger from 'github-slugger';
import { TriangleAlertIcon } from 'lucide-react';
import {
	type ComponentProps,
	type PropsWithChildren,
	type ReactNode,
	useMemo,
} from 'react';
import Callout, { type CalloutVariant, validCalloutVariants } from './Callout';
import DynamicCodeBlock from './DynamicCodeBlock';

export interface Heading {
	level: 1 | 2 | 3 | 4 | 5 | 6;
	value: string;
	id: string;
}

export interface ParsedContent {
	headings: Heading[];
	node: ReactNode;
}

export function parseContent(html: string): ParsedContent {
	const slugger = new GithubSlugger();

	const headings: Heading[] = [];

	const node = convertFromHTML(html, {
		filter(node) {
			return node.nodeName !== 'SCRIPT';
		},
		transform(node, ctx) {
			if (node.nodeType !== Node.ELEMENT_NODE) {
				return;
			}

			const element = node as Element;

			// handle custom components
			const component = element.getAttribute('data-component');

			if (component === 'callout') {
				if (element.tagName !== 'DETAILS') {
					return (
						<ComponentError>
							Component 'callout' must be a details element.
						</ComponentError>
					);
				}

				const summaries: Element[] = [];
				const contents: Node[] = [];

				for (let i = 0; i < element.childNodes.length; i++) {
					const child = element.childNodes[i];
					if (
						child.nodeType === Node.ELEMENT_NODE &&
						(child as Element).tagName === 'SUMMARY'
					) {
						summaries.push(child as Element);
					} else {
						contents.push(child);
					}
				}

				if (summaries.length === 0) {
					return (
						<ComponentError>
							Component 'callout' must have a summary element.
						</ComponentError>
					);
				}

				const dataVariant = element.getAttribute('data-variant');

				const open = element.hasAttribute('open');
				const variant = (
					dataVariant && validCalloutVariants.includes(dataVariant)
						? dataVariant
						: 'note'
				) as CalloutVariant;

				const title = this.parseNodes(summaries[0].childNodes, {
					level: ctx.level + 1,
				});
				const children = this.parseNodes(contents, { level: ctx.level + 2 });

				return (
					<Callout key={ctx.key} title={title} variant={variant} open={open}>
						{children}
					</Callout>
				);
			}

			if (component !== null) {
				return (
					<ComponentError>
						Component '{component}' is not supported.
					</ComponentError>
				);
			}

			// handle headings
			const headingIndex = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].indexOf(
				element.tagName,
			);
			if (headingIndex !== -1) {
				const Comp = element.tagName.toLowerCase() as
					| 'h1'
					| 'h2'
					| 'h3'
					| 'h4'
					| 'h5'
					| 'h6';
				const props = ctx.props();
				const children = ctx.children();
				const level = (headingIndex + 1) as 1 | 2 | 3 | 4 | 5 | 6;
				const value = element.textContent;
				const id = element.getAttribute('id') ?? slugger.slug(value);

				headings.push({
					level,
					value,
					id,
				});

				return (
					<Comp id={id} {...props} key={ctx.key}>
						<a href={`#${id}`}>{children}</a>
					</Comp>
				);
			}

			// handle codeblocks
			if (element.tagName === 'PRE') {
				const child = element.children.item(0);
				if (!child?.textContent || child.nodeName !== 'CODE') {
					// TODO: maybe we can show helpful message
					return null;
				}
				const language = child.className.match(/\blanguage-([\w-]+)\b/i)?.[1];
				const title = element.getAttribute('data-title') || undefined;
				return (
					<DynamicCodeBlock
						key={ctx.key}
						code={child.textContent}
						lang={language}
						title={title}
					/>
				);
			}
		},
	});

	return { headings, node };
}

interface ComponentErrorProps
	extends PropsWithChildren,
		ComponentProps<'div'> {}

function ComponentError({
	className,
	children,
	...props
}: ComponentErrorProps) {
	return (
		<div
			className={cn(
				'p-4 space-y-1 border border-destructive border-dashed rounded-md',
				className,
			)}
			{...props}
		>
			<div className="flex items-center gap-2">
				<TriangleAlertIcon className="size-4.5" />
				Component error
			</div>
			<div className="text-sm">{children}</div>
		</div>
	);
}

export interface ArticleContentProps {
	html: string;
}

export default function ArticleContent({ html }: ArticleContentProps) {
	const { node } = useMemo(() => parseContent(html), [html]);

	return node;
}
