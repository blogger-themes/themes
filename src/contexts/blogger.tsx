import { createContext, type PropsWithChildren, useContext } from 'react';
import type { BloggerData } from '@/utils/blogger-data';

export interface UseBloggerProps {
  data: BloggerData;
}

const BloggerContext = createContext<UseBloggerProps | undefined>(undefined);

export function useBlogger() {
  const context = useContext(BloggerContext);

  if (!context) {
    throw new Error('useBloggerData must be used within a BloggerDataProvider');
  }

  return context;
}

export interface BloggerProviderProps extends PropsWithChildren {
  data: BloggerData;
}

export function BloggerProvider({ children, data }: BloggerProviderProps) {
  return <BloggerContext.Provider value={{ data }}>{children}</BloggerContext.Provider>;
}
