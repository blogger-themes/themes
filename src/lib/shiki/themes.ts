import githubDark from '@shikijs/themes/github-dark';
import githubLight from '@shikijs/themes/github-light';
import { createCssVariablesTheme, type ThemeInput } from 'shiki/core';

const cssVariables = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

export const themes: ThemeInput[] = [cssVariables, githubLight, githubDark];
