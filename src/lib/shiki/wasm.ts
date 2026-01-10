import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import { languages } from './languages';
import { themes } from './themes';

export const highlighterPromise = createHighlighterCore({
  themes,
  langs: languages,
  engine: createOnigurumaEngine(fetch(new URL('shiki/onig.wasm', import.meta.url))),
});
