import { parseBloggerData } from './parse';
import type { BloggerData } from './types';

export interface FetchBloggerDataOptions {
  mobile?: 'force' | 'drop' | 'ignore';
  content?: boolean;
}

const MOBILE_REGEX =
  /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera mini|avantgo|mobilesafari|docomo|KAIOS)/i;
const TABLET_REGEX = /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?! .+? mobile))/i;

export function fetchBlogger(url: string | URL, { mobile = 'ignore', content = true }: FetchBloggerDataOptions = {}) {
  const result = {} as {
    response?: Response;
    data?: BloggerData;
  };

  const asResponse = async () => {
    if (result.response) {
      return result.response;
    }

    const requestUrl = new URL(url);
    requestUrl.searchParams.set('view', `-Json${content ? '' : '-NoPostContent'}`);
    if (mobile === 'force') {
      requestUrl.searchParams.set('m', '1');
    } else if (mobile === 'drop') {
      requestUrl.searchParams.set('m', '0');
    } else if (MOBILE_REGEX.test(navigator.userAgent) || TABLET_REGEX.test(navigator.userAgent)) {
      requestUrl.searchParams.set('m', '1');
    }

    const response = await fetch(requestUrl);

    if (response.status < 200 || response.status > 404) {
      throw new Error(`Response code ${response.status} (${response.statusText || 'Unknown'})`, { cause: response });
    }

    result.response = response;

    return result.response;
  };

  const asData = async () => {
    if (result.data) {
      return result.data;
    }

    const response = await asResponse();

    if (!response.headers.get('Content-Type')?.startsWith('text/html')) {
      throw new Error('Response is not html', { cause: response });
    }

    const html = await response.text();

    result.data = parseBloggerData(html);

    return result.data;
  };

  return { asResponse, asData };
}
