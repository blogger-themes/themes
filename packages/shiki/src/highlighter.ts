import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import { languages } from './languages';
import { themes } from './themes';

let highlighterPromise: Promise<HighlighterCore> | undefined;

export function getHighlighter(): Promise<HighlighterCore> {
	if (!highlighterPromise) {
		const engine = createOnigurumaEngine(
			fetch(new URL('shiki/onig.wasm', import.meta.url)),
		);

		highlighterPromise = createHighlighterCore({
			themes,
			langs: languages,
			engine,
		});
	}

	return highlighterPromise;
}
