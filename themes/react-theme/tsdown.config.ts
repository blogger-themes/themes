import { readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'tsdown';

const CRITICAL_ENTRY = './src/critical.ts';
const TEMPLATE_XML = './src/template.xml';

export default defineConfig({
	entry: {
		script: CRITICAL_ENTRY,
	},
	format: 'iife',
	platform: 'browser',
	target: 'es2018',
	outputOptions: { entryFileNames: '[name].js' },
	sourcemap: false,
	unbundle: false,
	deps: {
		alwaysBundle: /./,
	},
	minify: true,
	css: {
		fileName: 'style.css',
		minify: true,
	},
	write: false,
	hooks: {
		'build:done': async (ctx) => {
			let script = '';
			let style = '';

			for (const chunk of ctx.chunks) {
				if (chunk.type === 'chunk' && chunk.fileName.endsWith('.js')) {
					script += chunk.code.trim();
					continue;
				}
				if (
					chunk.type === 'asset' &&
					chunk.fileName.endsWith('.css') &&
					typeof chunk.source === 'string'
				) {
					style += chunk.source.trim();
				}
			}

			const xmlContent = await readFile(TEMPLATE_XML, 'utf8');
			const modifiedXmlContent = xmlContent
				.replace(
					/(<b:comment><!--critical-css:begin--><\/b:comment>)([\s\S]*?)(<b:comment><!--critical-css:end--><\/b:comment>)/,
					(_, start: string, _content: string, end: string) => {
						return `${start}${style ? `/*<![CDATA[*/${style}/*]]>*/` : ''}${end}`;
					},
				)
				.replace(
					/(<b:comment><!--critical-js:begin--><\/b:comment>)([\s\S]*?)(<b:comment><!--critical-js:end--><\/b:comment>)/,
					(_, start: string, _content: string, end: string) => {
						return `${start}${script ? `/*<![CDATA[*/${script}/*]]>*/` : ''}${end}`;
					},
				);
			await writeFile(TEMPLATE_XML, modifiedXmlContent, 'utf8');
		},
	},
});
