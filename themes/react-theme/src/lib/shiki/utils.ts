import styleToJs from 'style-to-js';

export interface ShikiPreProps {
  className?: string;
  style?: Record<string, string | number>;
  tabIndex?: number;
}

export interface ShikiHtmlResult {
  content: string;
  props: ShikiPreProps;
}

export function processShikiHtml(html: string): ShikiHtmlResult {
  const matches = html.match(/^<pre([^>]*)><code[^>]*>([\s\S]*?)<\/code><\/pre>$/);

  return {
    content: matches?.[2] ?? html,
    props: matches?.[1] ? processAttributes(matches[1]) : {},
  };
}

function processAttributes(htmlAttrs: string): ShikiPreProps {
  const props: ShikiPreProps = {};
  const regex = /\b(class|style|tabindex)\s*=\s*"([^"]*)"/gi;

  let match = regex.exec(htmlAttrs);

  while (match !== null) {
    const name = match[1].toLowerCase();
    const value = match[2];

    if (name === 'class') {
      props.className = value;
    } else if (name === 'style') {
      props.style = styleToJs(value, { reactCompat: true });
    } else if (name === 'tabindex' && /^-?\d+$/.test(value.trim())) {
      props.tabIndex = Number(value);
    }

    match = regex.exec(htmlAttrs);
  }

  return props;
}
