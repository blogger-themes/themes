import { createContext, type PropsWithChildren, useContext } from 'react';
import type { BloggerData } from '@/lib/blogger';

export interface UseBloggerProps {
  data: BloggerData;
}

const BloggerContext = createContext<UseBloggerProps | undefined>(undefined);

export function useBlogger() {
  const context = useContext(BloggerContext);

  if (typeof context === 'undefined') {
    throw new Error('useBlogger must be used within a BloggerProvider');
  }

  return context;
}

export interface BloggerProviderProps extends PropsWithChildren {
  data: BloggerData;
}

export function BloggerProvider({ children, data }: BloggerProviderProps) {
  return <BloggerContext.Provider value={{ data }}>{children}</BloggerContext.Provider>;
}
