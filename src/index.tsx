import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { z } from 'zod';
import routes from './routes';

import '@/styles/globals.css';
import '@/styles/typography.css';

/**
 * Explicitly configure Zod error locale.
 * Vite tree-shaking strips the default locale setup,
 * which results in generic error messages instead of meaningful ones.
 *
 * @see https://github.com/colinhacks/zod/issues/4891
 * @see https://github.com/colinhacks/zod/issues/5725
 */
z.config(z.locales.en());

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
