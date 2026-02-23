import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveNotationEscape,
} from '@shikijs/transformers';
import type { ShikiTransformer } from 'shiki/core';

export const transformers: ShikiTransformer[] = [
  transformerNotationDiff(),
  transformerNotationHighlight(),
  transformerNotationWordHighlight(),
  transformerNotationFocus(),
  transformerNotationErrorLevel(),
  transformerRemoveNotationEscape(),
];
