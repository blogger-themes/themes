import { getDeviceType } from '@/utils/device-type';
import { parseBloggerData } from './parse';
import type { BloggerData } from './types';

export interface FetchBloggerOptions {
  mobile?: 'force' | 'drop' | 'ignore';
  content?: boolean;
}

export interface FetchBloggerResult {
  asResponse: () => Promise<Response>;
  asData: () => Promise<BloggerData>;
}

export function fetchBlogger(url: string | URL, { mobile = 'ignore', content = true }: FetchBloggerOptions = {}): FetchBloggerResult {
  const cache: {
    response?: Response;
    data?: BloggerData;
  } = {};

  const asResponse: FetchBloggerResult['asResponse'] = async () => {
    if (cache.response) {
      return cache.response;
    }

    const requestUrl = new URL(url);
    requestUrl.searchParams.set('view', `-Json${content ? '' : '-NoPostContent'}`);
    if (mobile === 'force') {
      requestUrl.searchParams.set('m', '1');
    } else if (mobile === 'drop') {
      requestUrl.searchParams.set('m', '0');
    } else if (getDeviceType(navigator.userAgent) !== 'desktop') {
      requestUrl.searchParams.set('m', '1');
    }

    const response = await fetch(requestUrl);

    if (response.status < 200 || response.status > 404) {
      throw new Error(`Response code ${response.status} (${response.statusText || 'Unknown'})`, { cause: response });
    }

    cache.response = response;

    return cache.response;
  };

  const asData: FetchBloggerResult['asData'] = async () => {
    if (cache.data) {
      return cache.data;
    }

    const response = await asResponse();

    if (!response.headers.get('Content-Type')?.startsWith('text/html')) {
      throw new Error('Response is not html', { cause: response });
    }

    const html = await response.text();

    cache.data = parseBloggerData(html);

    return cache.data;
  };

  return { asResponse, asData };
}
