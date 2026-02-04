import { unescapeHtml } from '../utils';
import type {
  BlogAuthor,
  BloggerData,
  Comments,
  Contact,
  Favicon,
  Featured,
  Header,
  Meta,
  MetaImage,
  OpenGraph,
  Popular,
  Post,
  PostMinimal,
  TwitterCard,
  WebManifest,
} from './types';

function createParser(source: string | Document) {
  const scripts = new Map<string, string>();

  if (typeof source === 'string') {
    const matches = source.matchAll(
      /<script\b(?=[^>]*\bid=(["'])json:([^"']+)\1)(?=[^>]*\btype=(["'])application\/json\3)[^>]*>([\s\S]*?)<\/script>/g,
    );

    for (const match of matches) {
      const id = match[2];
      const content = match[4];
      if (id && typeof content === 'string') {
        scripts.set(id, content);
      }
    }
  }

  return {
    json(id: string) {
      let content: string | undefined;
      if (typeof source === 'string') {
        content = scripts.get(id);
      } else {
        const element = source.getElementById(`json:${id}`) as HTMLScriptElement | null;
        if (element) {
          if (element.tagName !== 'SCRIPT') {
            throw new Error(`Element with id 'json:${id}' is not a HTMLScriptElement`);
          }
          if (element.type !== 'application/json') {
            throw new Error(`Element with id 'json:${id}' has not type attribute set to 'application/json'`);
          }
          content = element.textContent;
        }
      }
      if (typeof content === 'string') {
        let parsed: unknown;
        try {
          parsed = JSON.parse(content);
        } catch (e) {
          throw new Error(`Failed to parse JSON for element with id 'json:${id}'`, {
            cause: e,
          });
        }
        return parsed;
      }
    },
    title() {
      if (typeof source === 'string') {
        const match = source.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
        if (match?.[1]) {
          return unescapeHtml(match[1]);
        }
        return '';
      }
      return source.title;
    },
  };
}

export function parseBloggerData(source: string | Document): BloggerData {
  const parser = createParser(source);

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
    manifest,
  ] = [
    { id: 'data' },
    { id: 'labels', fallback: {} },
    { id: 'authors', fallback: [] },
    { id: 'posts', fallback: {} },
    { id: 'comments', fallback: null },
    { id: 'header', fallback: null },
    { id: 'contact' },
    { id: 'stats' },
    { id: 'featured', fallback: null },
    { id: 'popular', fallback: null },
    { id: 'meta:favicon' },
    { id: 'meta:keywords', fallback: null },
    { id: 'meta:image', fallback: null },
    { id: 'meta:opengraph', fallback: null },
    { id: 'meta:twittercard', fallback: null },
    { id: 'webmanifest', fallback: null },
  ].map((descriptor) => {
    const { id, fallback } = descriptor;
    const hasFallback = 'fallback' in descriptor;

    const parsed = parser.json(id);

    if (typeof parsed !== 'undefined') {
      return parsed;
    }

    if (!hasFallback) {
      throw new Error(`Missing element with id 'json:${id}'`);
    }

    return fallback;
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
    WebManifest | null,
  ];

  data.blog.title = unescapeHtml(data.blog.title);

  const search = data.view.search;
  if (search) {
    if (search.type === 'query') {
      search.query = unescapeHtml(search.query);
    } else {
      search.label = unescapeHtml(search.label);
    }
  }

  if (header) {
    header.title = unescapeHtml(header.title);
    if (header.description) {
      header.description = unescapeHtml(header.description);
    }

    data.header = header;
    data.blog.description = header.description;
  } else {
    data.header = {
      title: data.blog.title,
      description: null,
      image: null,
    };
  }

  const meta: Meta = {
    title: parser.title(),
    favicon: metaFavicon,
  };
  if (metaKeywords) {
    meta.keywords = metaKeywords;
  }
  if (metaImage) {
    meta.image = metaImage;
  }
  if (metaOpenGraph) {
    metaOpenGraph.siteName = unescapeHtml(metaOpenGraph.siteName);
    metaOpenGraph.title = unescapeHtml(metaOpenGraph.title);
    metaOpenGraph.description = unescapeHtml(metaOpenGraph.description);

    meta.openGraph = metaOpenGraph;
  }
  if (metaTwitterCard) {
    metaTwitterCard.title = unescapeHtml(metaTwitterCard.title);
    metaTwitterCard.description = unescapeHtml(metaTwitterCard.description);

    meta.twitterCard = metaTwitterCard;
  }
  data.meta = meta;

  data.labels = {};
  for (const label in labels) {
    data.labels[unescapeHtml(label)] = labels[label];
  }

  for (let i = 0; i < authors.length; i++) {
    authors[i].id = `author-${i + 1}`;
  }
  data.authors = authors;

  for (const id in posts) {
    const post = posts[id];
    post.title = unescapeHtml(post.title);

    for (let i = 0; i < post.labels.length; i++) {
      post.labels[i] = unescapeHtml(post.labels[i]);
    }
  }
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

  data.contact = contact;

  const statsEndpoint = new URL(stats.endpoint, data.blog.canonicalHomepageUrl);
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

  if (manifest) {
    manifest.name = unescapeHtml(manifest.name);
    if (manifest.short_name) {
      manifest.short_name = unescapeHtml(manifest.short_name);
    }

    if (!manifest.description && header?.description) {
      manifest.description = header.description;
    }

    if (!manifest.icons && metaFavicon.sizes) {
      manifest.icons = [];
      const sizes = [16, 24, 32, 36, 48, 64, 72, 96, 144, 192, 512] as const;
      for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        manifest.icons.push({
          src: metaFavicon.sizes[size],
          sizes: `${size}x${size}`,
          type: 'image/png',
          purpose: i === 9 ? 'maskable' : 'any',
        });
      }
    }

    if (manifest.shortcuts) {
      const icon = manifest.icons?.find((icon) => icon.sizes === '96x96') ?? manifest.icons?.[0];

      for (const shortcut of manifest.shortcuts) {
        shortcut.name = unescapeHtml(shortcut.name);
        if (shortcut.short_name) {
          shortcut.short_name = unescapeHtml(shortcut.short_name);
        }

        if (!shortcut.icons && icon) {
          shortcut.icons = [
            {
              src: icon.src,
              sizes: icon.sizes,
              type: icon.type,
            },
          ];
        }
      }
    }

    data.manifest = manifest;
  }

  return data;
}
