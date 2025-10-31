export interface Locale {
  value: string;
  language: string;
  country: string | null;
  underscore: string;
  underscoreDelimited: string;
}

export type LanguageDirection = 'ltr' | 'rtl';

export interface Blog {
  title: string;
  description: string | null;
  blogId: string;
  url: string;
  homepageUrl: string;
  canonicalUrl: string;
  canonicalHomepageUrl: string;
  view: string | null;
  encoding: string;
  languageDirection: LanguageDirection;
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

export interface BaseSearch {
  message: string;
  messageHtml: string;
}

export interface QuerySearch extends BaseSearch {
  type: 'query';
  query: string;
}

export interface LabelSearch extends BaseSearch {
  type: 'label';
  label: string;
}

export type Search = QuerySearch | LabelSearch;

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
  isBlog: boolean;
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
  keywords?: string[];
  image?: MetaImage;
  openGraph?: OpenGraph;
  twitterCard?: TwitterCard;
}

export interface BlogAuthor {
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
  id: string;
  title: string;
  summary: string;
  snippet: string;
  thumbnail: string | null;
  url: string;
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

export interface CommentAuthor {
  name: string;
  url: string | null;
  image: string | null;
  isAnonymous: boolean;
  isPostAuthor: boolean;
}

export interface CommentBase {
  id: string;
  author: CommentAuthor;
  body: string;
  timestamp: string;
  timestampMs: number;
  isDeleted: boolean;
  deleteUrl: string;
  adminClass: string;
}

export interface Reply extends CommentBase {
  inReplyTo: string;
}

export interface Comment extends CommentBase {
  replies: Reply[];
}

export type CommentsSetting = 'disabled' | 'hidden' | 'readonly' | 'allowed';

export type CommentsLocationType = 'embedded' | 'popup' | 'page';

export interface CommentsLocation {
  type: CommentsLocationType;
  url: string;
}

export interface Comments {
  total: number;
  title: string;
  setting: CommentsSetting;
  location: CommentsLocation | null;
  items: Comment[];
}

export type HeaderImagePlacement = 'BEHIND' | 'REPLACE' | 'BEFORE_DESCRIPTION';

export interface HeaderImage {
  src: string;
  width: number | null;
  height: number | null;
  placement: HeaderImagePlacement;
}

export interface Header {
  title: string;
  description: string | null;
  image: HeaderImage | null;
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
  posts: Record<string, PostMinimal | Post>;
  post: PostMinimal | Post;
}

export interface Popular {
  showTitle: boolean;
  showDate: boolean;
  showAuthor: boolean;
  showSnippet: boolean;
  showThumbnail: boolean;
  posts: Record<string, PostMinimal | Post>;
}

export interface BloggerData {
  blog: Blog;
  view: View;
  meta: Meta;
  labels: Record<string, number>;
  authors: BlogAuthor[];
  posts: Record<string, PostMinimal | Post>;
  post?: Post;
  page?: Post;
  comments?: Comments;
  header: Header;
  contact: Contact;
  stats: Stats;
  analytics?: Analytics;
  adsense?: Adsense;
  featured?: Featured;
  popular?: Popular;
}

export function parseBloggerData(doc: Document): BloggerData {
  const [
    data,
    labels,
    authors,
    posts,
    comments,
    header,
    contact,
    stats,
    featured,
    popular,
    metaFavicon,
    metaKeywords,
    metaImage,
    metaOpenGraph,
    metaTwitterCard,
  ] = (
    [
      ['data'],
      ['labels', {}],
      ['authors', []],
      ['posts', {}],
      ['comments', null],
      ['header', null],
      ['contact'],
      ['stats'],
      ['featured', null],
      ['popular', null],
      ['meta:favicon'],
      ['meta:keywords', null],
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
        throw new Error(`Failed to parse JSON for element with id '${elementId}'`, {
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
    BlogAuthor[],
    Record<string, PostMinimal | Post>,
    Comments,
    Header | null,
    Contact,
    { endpoint: string },
    Featured | null,
    Popular | null,
    Favicon,
    string[] | null,
    MetaImage | null,
    OpenGraph | null,
    TwitterCard | null,
  ];

  const meta: Meta = {
    title: doc.title,
    favicon: metaFavicon,
  };
  if (metaKeywords) {
    meta.keywords = metaKeywords;
  }
  if (metaImage) {
    meta.image = metaImage;
  }
  if (metaOpenGraph) {
    meta.openGraph = metaOpenGraph;
  }
  if (metaTwitterCard) {
    meta.twitterCard = metaTwitterCard;
  }
  data.meta = meta;

  data.labels = labels;

  for (let i = 0; i < authors.length; i++) {
    authors[i].id = `author-${i + 1}`;
  }
  data.authors = authors;

  data.posts = posts;

  if (data.blog.postId) {
    data.post = posts[data.blog.postId] as Post;
  }

  if (data.blog.pageId) {
    data.page = posts[data.blog.pageId] as Post;
  }

  if (comments) {
    data.comments = comments;
  }

  if (header) {
    data.header = header;
    data.blog.description = header.description;
  } else {
    data.header = {
      title: data.blog.title,
      description: null,
      image: null,
    };
  }

  data.contact = contact;

  const statsEndpoint = new URL(stats.endpoint, doc.baseURI);
  data.stats = {
    endpoint: statsEndpoint.origin + statsEndpoint.pathname,
    token: statsEndpoint.searchParams.get('token') as string,
  };

  if (featured) {
    for (const id in featured.posts) {
      if (featured.posts[id] === null) {
        featured.posts[id] = data.posts[id];
      }
      if (!featured.post) {
        featured.post = featured.posts[id];
      }
    }
    data.featured = featured;
  }

  if (popular) {
    for (const id in popular.posts) {
      if (popular.posts[id] === null) {
        popular.posts[id] = data.posts[id];
      }
    }
    data.popular = popular;
  }

  return data;
}

export interface FetchBloggerDataOptions {
  mobile?: 'force' | 'drop' | 'ignore';
  content?: boolean;
}

export async function fetchBloggerData(url: string | URL, { mobile = 'ignore', content = true }: FetchBloggerDataOptions = {}) {
  const requestUrl = new URL(url);
  requestUrl.searchParams.set('view', `-Json${content ? '' : '-NoPostContent'}`);
  if (mobile === 'force') {
    requestUrl.searchParams.set('m', '1');
  } else if (mobile === 'drop') {
    requestUrl.searchParams.set('m', '0');
  }

  const response = await fetch(requestUrl);
  if (!response.headers.get('Content-Type')?.startsWith('text/html')) {
    throw new Error('Response is not html', { cause: response });
  }

  if (response.status < 200 || response.status > 404) {
    throw new Error(`Response code ${response.status} (${response.statusText || 'Unknown'})`, { cause: response });
  }

  const doc = new DOMParser().parseFromString(await response.text(), 'text/html');

  return parseBloggerData(doc);
}
