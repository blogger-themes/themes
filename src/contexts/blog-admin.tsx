import { loadStylesheet } from '@deox/utils/create-element';
import { lazy } from '@deox/utils/lazy';
import { createContext, type PropsWithChildren, useContext, useEffect } from 'react';
import { useStore } from 'zustand/react';
import { bloggerData } from '@/lib/blogger-data';
import { preferencesStore } from '@/stores/preferences';

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

const BlogAdminContext = createContext<boolean | undefined>(undefined);

export function useBlogAdmin() {
  const context = useContext(BlogAdminContext);

  if (typeof context === 'undefined') {
    throw new Error('useBlogAdmin must be used within a BlogAdminProvider');
  }

  return context;
}

let blogAdminDetectionPromise: Promise<boolean> | undefined;

export interface BlogAdminProviderProps extends PropsWithChildren {}

export function BlogAdminProvider({ children }: BlogAdminProviderProps) {
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

    blogAdminDetectionPromise.then(setBlogAdmin);
  }, [setBlogAdmin]);

  return <BlogAdminContext.Provider value={blogAdmin}>{children}</BlogAdminContext.Provider>;
}
