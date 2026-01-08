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
  sizes: Record<16 | 24 | 32 | 36 | 48 | 64 | 72 | 96 | 144 | 192 | 512, string> | null;
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

export type ManifestDirection = 'auto' | 'ltr' | 'rtl';

export type ManifestOrientation =
  | 'any'
  | 'natural'
  | 'portrait'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape'
  | 'landscape-primary'
  | 'landscape-secondary';

export type ManifestDisplay = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';

export interface ManifestImage {
  src: string;
  sizes?: string;
  type?: string;
}

export type ManifestIconPurpose = 'any' | 'maskable' | 'monochrome';

export interface ManifestIcon extends ManifestImage {
  purpose?: ManifestIconPurpose;
}

export type ManifestScreenshotFormFactor = 'narrow' | 'wide';

export interface ManifestScreenshot extends ManifestImage {
  label?: string;
  form_factor?: ManifestScreenshotFormFactor;
}

export interface ManifestShortcut {
  name: string;
  short_name?: string;
  description?: string;
  url: string;
  icons?: ManifestIcon[];
}

export interface WebManifest {
  id?: string;
  start_url?: string;
  name: string;
  short_name?: string;
  description?: string;
  lang?: string;
  dir?: ManifestDirection;
  orientation?: ManifestOrientation;
  display?: ManifestDisplay;
  theme_color?: string;
  background_color?: string;
  prefer_related_applications?: boolean;
  icons?: ManifestIcon[];
  screenshots?: ManifestScreenshot[];
  shortcuts?: ManifestShortcut[];
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
  manifest?: WebManifest;
}
