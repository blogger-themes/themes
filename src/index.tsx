import '@/styles/globals.css';
import '@/styles/typography.css';

import { createElement } from '@deox/utils/create-element';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { z } from 'zod';
import { bloggerData } from './lib/blogger-data';
import routes from './routes';
import { preferencesStore, type Theme } from './stores/preferences';

/**
 * Explicitly configure Zod error locale.
 * Vite tree-shaking strips the default locale setup,
 * which results in generic error messages instead of meaningful ones.
 *
 * @see https://github.com/colinhacks/zod/issues/4891
 * @see https://github.com/colinhacks/zod/issues/5725
 */
z.config(z.locales.en());

/**
 * Create the application router and mount the React application
 * with routing support.
 */
const router = createBrowserRouter(routes);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

/**
 * Sync the document theme with the current user preference and system
 * color scheme by updating the <html> attributes, `.dark` class,
 * and browser `color-scheme`.
 */
const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');

function updateThemeElement(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && darkMQ.matches);

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

updateThemeElement(preferencesStore.getState().theme);

preferencesStore.subscribe((state, prevState) => {
  if (state.theme !== prevState.theme) {
    updateThemeElement(state.theme);
  }
});

darkMQ.addEventListener('change', () => {
  const state = preferencesStore.getState();

  if (state.theme === 'system') {
    updateThemeElement(state.theme);
  }
});

/**
 * Dynamically generate and attach a web app manifest when manifest data
 * is available, the environment supports it, and no manifest link
 * already exists in the document.
 */
if (bloggerData.initial.manifest?.icons && (import.meta.env.DEV || location.protocol === 'https:') && !document.querySelector('link[rel=manifest]')) {
  const blob = new Blob([JSON.stringify(bloggerData.initial.manifest, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const element = createElement('link', {
    rel: 'manifest',
    href: url,
  });

  document.head.appendChild(element);
}
