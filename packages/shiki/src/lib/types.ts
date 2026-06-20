import type {
	DistributiveOmit,
	DistributiveOptional,
} from '@themes/utils/types';
import type { CodeToHastOptions } from 'shiki/core';
import type { ShikiHtmlResult } from './utils';

export type HighlightOptions = DistributiveOptional<
	DistributiveOmit<CodeToHastOptions, 'transformers' | 'lang'>,
	'theme' | 'themes'
>;

export type HighlightResult = ShikiHtmlResult;
