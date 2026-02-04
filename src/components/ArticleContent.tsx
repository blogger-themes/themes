import { convertFromHTML } from '@deox/dom-to-react';
import GithubSlugger from 'github-slugger';
import { type ReactNode, useMemo } from 'react';
import Callout, { type CalloutVariant } from './Callout';
import CodeBlock from './CodeBlock';

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

      const headingIndex = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].indexOf(element.tagName);
      if (headingIndex !== -1) {
        const Comp = element.tagName.toLowerCase() as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        const children = ctx.children();
        const level = (headingIndex + 1) as 1 | 2 | 3 | 4 | 5 | 6;
        const value = element.textContent;
        const id = slugger.slug(value);

        headings.push({
          level,
          value,
          id,
        });

        return (
          <Comp key={ctx.key} id={id}>
            <a href={`#${id}`}>{children}</a>
          </Comp>
        );
      }

      if (element.tagName === 'PRE') {
        const child = (node as Element).children[0];
        if (!child || !child.textContent || child.nodeName !== 'CODE') {
          return null;
        }
        const language = child.className.match(/\blanguage-([\w-]+)\b/i)?.[1];
        return <CodeBlock key={ctx.key} code={child.textContent} lang={language} />;
      }

      const component = element.getAttribute('data-component');

      if (component === 'callout') {
        const attrTitle = element.getAttribute('data-title');
        const attrVariant = element.getAttribute('data-variant');

        const validVariants = [
          'note',
          'tip',
          'warning',
          'danger',
          'important',
          'definition',
          'theorem',
          'lemma',
          'proof',
          'corollary',
          'proposition',
          'axiom',
          'conjecture',
          'notation',
          'remark',
          'intuition',
          'recall',
          'explanation',
          'example',
          'exercise',
          'problem',
          'answer',
          'solution',
          'summary',
        ];

        const title = attrTitle || undefined;
        const variant = (attrVariant && validVariants.includes(attrVariant) ? attrVariant : validVariants[0]) as CalloutVariant;
        const children = ctx.children();

        return (
          <Callout key={ctx.key} title={title} variant={variant}>
            {children}
          </Callout>
        );
      }
    },
  });

  return { headings, node };
}

export interface ArticleContentProps {
  html: string;
}

export default function ArticleContent({ html }: ArticleContentProps) {
  const { node } = useMemo(() => parseContent(html), [html]);

  return node;
}
