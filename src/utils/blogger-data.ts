export interface Locale {
  value: string;
  language: string;
  country: string | null;
  underscore: string;
  underscoreDelimited: string;
}

export interface Blog {
  title: string;
  blogId: string;
  url: string;
  homepageUrl: string;
  canonicalUrl: string;
  canonicalHomepageUrl: string;
  view: string | null;
  encoding: string;
  languageDirection: 'ltr' | 'rtl';
  metaDescription: string | null;
  isPrivate: boolean;
  isPrivateBlog: boolean;
  isMobile: boolean;
  isMobileRequest: boolean;
  faviconUrl: boolean;
  bloggerUrl: boolean;
  hasCustomDomain: boolean;
  httpsEnabled: boolean;
  adultContent: boolean;
  pageName: string;
  pageTitle: string;
  pageType: string;
  searchUrl: string;
  locale: Locale;
  searchLabel?: string;
  singleItemId?: string;
  postId?: string;
  postThumbnail?: string;
  postImage?: string;
  pageId?: string;
  pageImage?: string;
}

export type Search = {
  message: string;
  messageHtml: string;
} & (
  | {
      type: 'query';
      query: string;
    }
  | {
      type: 'label';
      label: string;
    }
);

export interface View {
  type: string;
  title: string;
  description: string | null;
  url: string;
  isHomepage: boolean;
  isSingleItem: boolean;
  isPost: boolean;
  isPage: boolean;
  isPreview: boolean;
  isArchive: boolean;
  isError: boolean;
  isSearch: boolean;
  isLabelSearch: boolean;
  isMultipleItems: boolean;
  isMobile: boolean;
  postId?: string;
  pageId?: string;
  search?: Search;
}

export interface MetaImage {
  src: string;
  width: number | null;
  height: number | null;
}

export interface Favicon extends MetaImage {
  isCustom: boolean;
}

export interface OpenGraphImage extends MetaImage {
  alt: string;
}

export interface OpenGraph {
  locale: string;
  siteName: string;
  title: string;
  url: string;
  type: string;
  description: string;
  image: OpenGraphImage;
}

export interface TwitterCardImage extends OpenGraphImage {}

export interface TwitterCard {
  title: string;
  url: string;
  description: string;
  card: string;
  image: TwitterCardImage;
}

export interface Meta {
  title: string;
  favicon: Favicon;
  image?: MetaImage;
  opengraph?: OpenGraph;
  twittercard?: TwitterCard;
}

export interface Author {
  id: string;
  name: string;
  about: string | null;
  location: string | null;
  image: string | null;
  url: string | null;
}

export interface PostAuthorMinimal {
  name: string;
  url: string | null;
  image: string | null;
}

export interface PostAuthor extends PostAuthorMinimal {
  about: string | null;
}

export interface PostCommentsMinimal {
  count: string;
  title: string;
}

export interface PostLocation {
  name: string;
  url: string;
}

export interface PostMinimal {
  title: string;
  summary: string;
  snippet: string;
  thumbnail: string | null;
  url: string;
  id: string;
  published: string;
  publishedTimestamp: string;
  updated: string;
  updatedTimestamp: string;
  labels: string[];
  author: PostAuthorMinimal;
  comments: PostCommentsMinimal;
  location: PostLocation | null;
}

export interface Post extends PostMinimal {
  author: PostAuthor;
  content: string;
}

export interface Contact {
  token: string;
  endpoint: string;
}

export interface Stats {
  token: string;
  endpoint: string;
}

export interface Analytics {
  id: string;
}

export interface Adsense {
  clientId: string;
  hostId: string | null;
  autoAds: boolean;
  hasAds: boolean;
}

export interface Featured {
  showTitle: boolean;
  showDate: boolean;
  showAuthor: boolean;
  showSnippet: boolean;
  showThumbnail: boolean;
  post: PostMinimal;
}

export interface BloggerData {
  blog: Blog;
  view: View;
  meta: Meta;
  labels: Record<string, number>;
  authors: Author[];
  posts: Record<string, PostMinimal>;
  post?: Post;
  page?: Post;
  contact: Contact;
  stats: Stats;
  analytics?: Analytics;
  adsense?: Adsense;
  featured?: Featured;
}

export function parseBloggerData(doc: Document): BloggerData {
  const [data, labels, authors, posts, contact, stats, featured, metaFavicon, metaImage, metaOpenGraph, metaTwitterCard] = (
    [
      ['data'],
      ['labels', {}],
      ['authors', []],
      ['posts', {}],
      ['contact'],
      ['stats'],
      ['featured', null],
      ['meta:favicon'],
      ['meta:image', null],
      ['meta:opengraph', null],
      ['meta:twittercard', null],
    ] as const
  ).map((descriptor) => {
    const name = descriptor[0];
    const defaultValue = descriptor[1];
    const hasDefaultValue = 1 in descriptor;

    const elementId = `json:${name}`;
    const element = doc.getElementById(elementId) as HTMLScriptElement;

    if (element) {
      if (element.tagName !== 'SCRIPT') {
        throw new Error(`Element with id '${elementId}' is not a HTMLScriptElement`);
      }
      if (element.type !== 'application/json') {
        throw new Error(`Element with id '${elementId}' has not type set to 'application/json'`);
      }
      if (!element.textContent) {
        throw new Error(`Missing json content in element with id '${elementId}'`);
      }
      let json: unknown;
      try {
        json = JSON.parse(element.textContent);
      } catch (e) {
        throw new Error(`Error parsing json for element with id '${elementId}'`, {
          cause: e,
        });
      }
      return json;
    }
    if (!hasDefaultValue) {
      throw new Error(`Missing element with id '${elementId}'`);
    }
    return defaultValue;
  }) as [
    BloggerData,
    Record<string, number>,
    Author[],
    Record<string, PostMinimal>,
    Contact,
    { endpoint: string },
    Featured | null,
    Favicon,
    MetaImage | null,
    OpenGraph | null,
    TwitterCard | null,
  ];

  const meta: Meta = {
    title: doc.title,
    favicon: metaFavicon,
  };
  if (metaImage) {
    meta.image = metaImage;
  }
  if (metaOpenGraph) {
    meta.opengraph = metaOpenGraph;
  }
  if (metaTwitterCard) {
    meta.twittercard = metaTwitterCard;
  }
  data.meta = meta;

  data.labels = labels;

  for (let i = 0; i < authors.length; i++) {
    authors[i].id = `blog_author_${i + 1}`;
  }
  data.authors = authors;

  data.posts = posts;

  if (data.blog.postId) {
    data.post = posts[data.blog.postId] as Post;
  }

  if (data.blog.pageId) {
    data.page = posts[data.blog.pageId] as Post;
  }

  data.contact = contact;

  const statsEndpoint = new URL(stats.endpoint, doc.baseURI);
  data.stats = {
    endpoint: statsEndpoint.origin + statsEndpoint.pathname,
    token: statsEndpoint.searchParams.get('token') as string,
  };

  if (featured) {
    data.featured = featured;
  }

  return data;
}

export interface FetchBloggerDataOptions {
  content?: boolean;
}

export async function fetchBloggerData(url: string | URL, { content = true }: FetchBloggerDataOptions = {}) {
  const requestUrl = new URL(url);
  requestUrl.searchParams.set('view', `-Json${content ? '' : '-NoPostContent'}`);

  const response = await fetch(requestUrl);
  if (!response.headers.get('Content-Type')?.startsWith('text/html')) {
    throw new Error('Response is not html', { cause: response });
  }

  const doc = new DOMParser().parseFromString(await response.text(), 'text/html');

  return parseBloggerData(doc);
}
