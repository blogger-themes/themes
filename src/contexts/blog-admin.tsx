import { loadStylesheet } from '@deox/utils/create-element';
import { lazy } from '@deox/utils/lazy';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';
import { bloggerData } from '@/lib/blogger-data';
import { subscribeStorage } from '@/lib/helpers';

const BLOG_ADMIN_LS_KEY = 'is-blog-admin';
const BLOG_ADMIN_LS_VALUE = '1';
const BLOG_ADMIN_CLASSNAME = 'is-blog-admin';

function getFromLS(): boolean {
  try {
    return localStorage.getItem(BLOG_ADMIN_LS_KEY) === BLOG_ADMIN_LS_VALUE;
  } catch (_) {
    return false;
  }
}

function setToLS(isBlogAdmin: boolean): void {
  try {
    if (isBlogAdmin) {
      localStorage.setItem(BLOG_ADMIN_LS_KEY, BLOG_ADMIN_LS_VALUE);
    } else {
      localStorage.removeItem(BLOG_ADMIN_LS_KEY);
    }
  } catch (_) {}
}

function authorizationCssUrl(blogId: string) {
  return `https://www.blogger.com/dyn-css/authorization.css?targetBlogID=${blogId}`;
}

function updateDOM(isBlogAdmin: boolean) {
  if (isBlogAdmin) {
    document.documentElement.classList.add(BLOG_ADMIN_CLASSNAME);
  } else {
    document.documentElement.classList.remove(BLOG_ADMIN_CLASSNAME);
  }
}

const BlogAdminContext = createContext<boolean | undefined>(undefined);

export function useBlogAdmin() {
  const context = useContext(BlogAdminContext);

  if (typeof context === 'undefined') {
    throw new Error('useBlogAdmin must be used within a BlogAdminProvider');
  }

  return context;
}

export interface BlogAdminProviderProps extends PropsWithChildren {}

let authCssPromise: Promise<void>;

export function BlogAdminProvider({ children }: BlogAdminProviderProps) {
  const [isBlogAdmin, setIsBlogAdmin] = useState(getFromLS());

  const data = bloggerData.initial;

  useEffect(() => {
    updateDOM(isBlogAdmin);
  }, [isBlogAdmin]);

  useEffect(() => {
    if (!authCssPromise && import.meta.env.PROD) {
      authCssPromise = lazy.then(async () => {
        await loadStylesheet(authorizationCssUrl(data.blog.blogId));

        const container = document.createElement('div');
        container.className = 'hidden blog-admin';
        document.body.appendChild(container);
        const styles = getComputedStyle(container);

        if (styles.display === 'block') {
          setIsBlogAdmin(true);
          setToLS(true);
        } else {
          setIsBlogAdmin(false);
          setToLS(false);
        }

        container.remove();
      });
    }
  }, []);

  useEffect(() => {
    return subscribeStorage(BLOG_ADMIN_LS_KEY, (event) => {
      if (event.newValue === BLOG_ADMIN_LS_VALUE) {
        setIsBlogAdmin(true);
      } else {
        setIsBlogAdmin(false);
      }
    });
  }, []);

  return <BlogAdminContext.Provider value={isBlogAdmin}>{children}</BlogAdminContext.Provider>;
}
