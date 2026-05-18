import { loadStylesheet } from '@deox/utils/create-element';
import { lazy } from '@deox/utils/lazy';
import { useEffect } from 'react';
import { useStore } from 'zustand/react';
import { bloggerData } from '@/lib/blogger-data';
import { preferencesStore, type Theme } from '.';

const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');

function updateThemeElement(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && darkMQ.matches);

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

/**
 * Sync the document theme with the current user preference and system
 * color scheme by updating the <html> attributes, `.dark` class,
 * and browser `color-scheme`.
 *
 * Mount once at app root.
 */
export function PreferencesThemeAction() {
  const theme = useStore(preferencesStore, (s) => s.theme);

  useEffect(() => {
    updateThemeElement(theme);
  }, [theme]);

  useEffect(() => {
    const listener = () => {
      if (preferencesStore.getState().theme === 'system') {
        updateThemeElement('system');
      }
    };

    darkMQ.addEventListener('change', listener);

    return () => {
      darkMQ.removeEventListener('change', listener);
    };
  }, []);

  return null;
}

const BLOG_ADMIN_CLASS = 'is-blog-admin';

function getAuthorizationCssUrl(blogId: string): string {
  return `https://www.blogger.com/dyn-css/authorization.css?targetBlogID=${blogId}`;
}

async function detectBlogAdmin(blogId: string): Promise<boolean> {
  await loadStylesheet(getAuthorizationCssUrl(blogId));

  const probeElement = document.createElement('div');
  probeElement.className = 'hidden blog-admin';
  document.body.appendChild(probeElement);

  const isBlogAdmin = getComputedStyle(probeElement).display === 'block';

  probeElement.remove();

  return isBlogAdmin;
}

function updateBlogAdminElement(blogAdmin: boolean) {
  document.documentElement.classList[blogAdmin ? 'add' : 'remove'](BLOG_ADMIN_CLASS);
}

let blogAdminDetectionPromise: Promise<boolean> | undefined;

/**
 * Sync the current blog admin state with the document by detecting
 * Blogger admin authorization and updating the root {@link BLOG_ADMIN_CLASS}
 * class on the <html> element.
 *
 * Mount once at app root.
 */
export function PreferencesBlogAdminAction() {
  const blogAdmin = useStore(preferencesStore, (state) => state.blogAdmin);
  const setBlogAdmin = useStore(preferencesStore, (state) => state.setBlogAdmin);

  const data = bloggerData.initial;

  useEffect(() => {
    updateBlogAdminElement(blogAdmin);
  }, [blogAdmin]);

  useEffect(() => {
    if (!import.meta.env.PROD) {
      return;
    }

    blogAdminDetectionPromise ||= lazy.then(() => detectBlogAdmin(data.blog.blogId));

    let cancelled = false;

    blogAdminDetectionPromise.then(() => {
      if (!cancelled) {
        setBlogAdmin(cancelled);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [setBlogAdmin]);

  return null;
}
