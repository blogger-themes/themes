import astro from '@shikijs/langs/astro';
import c from '@shikijs/langs/c';
import cpp from '@shikijs/langs/cpp';
import csharp from '@shikijs/langs/csharp';
import css from '@shikijs/langs/css';
import go from '@shikijs/langs/go';
import html from '@shikijs/langs/html';
import java from '@shikijs/langs/java';
import javascript from '@shikijs/langs/javascript';
import json from '@shikijs/langs/json';
import jsx from '@shikijs/langs/jsx';
import markdown from '@shikijs/langs/markdown';
import mdx from '@shikijs/langs/mdx';
import php from '@shikijs/langs/php';
import python from '@shikijs/langs/python';
import rust from '@shikijs/langs/rust';
import shellscript from '@shikijs/langs/shellscript';
import sql from '@shikijs/langs/sql';
import svelte from '@shikijs/langs/svelte';
import toml from '@shikijs/langs/toml';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import vue from '@shikijs/langs/vue';
import yaml from '@shikijs/langs/yaml';
import type { LanguageInput } from 'shiki/core';

export const languages: LanguageInput[] = [
	// Systems
	c,
	cpp,
	csharp,
	go,
	rust,
	java,

	// Scripting
	python,
	php,
	shellscript,

	// Web
	html,
	css,
	javascript,
	typescript,
	jsx,
	tsx,
	json,
	astro,
	vue,
	svelte,

	// Data / Config
	yaml,
	toml,
	sql,

	// Markup / Docs
	markdown,
	mdx,
];
