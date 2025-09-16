import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, PreviewServer, ResolvedConfig, ViteDevServer } from 'vite';
import z from 'zod';

const ReactBloggerPluginOptionsSchema = z
  .object({
    entry: z.string().optional(),
    template: z.string().optional(),
    devBlog: z.url(),
  })
  .strict();

export type ReactBloggerPluginOptions = z.infer<typeof ReactBloggerPluginOptionsSchema>;

export interface PluginContext {
  viteConfig: ResolvedConfig;
  entry: string;
  template: string;
  options: ReactBloggerPluginOptions;
}

function createPluginContext(userOptions: ReactBloggerPluginOptions): PluginContext {
  return {
    viteConfig: undefined as unknown as ResolvedConfig,
    entry: undefined as unknown as string,
    template: undefined as unknown as string,
    options: ReactBloggerPluginOptionsSchema.parse(userOptions),
  };
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceViteHead(input: string, replacement: string, bcomment = false) {
  if (bcomment) {
    return input.replace(
      /<b:comment><!--vite:head:begin--><\/b:comment>[\s\S]*?<b:comment><!--vite:head:end--><\/b:comment>/,
      `<b:comment><!--vite:head:begin--></b:comment>${replacement}<b:comment><!--vite:head:end--></b:comment>`,
    );
  }
  return input.replace(/<!--vite:head:begin-->[\s\S]*?<!--vite:head:end-->/, `<!--vite:head:begin-->${replacement}<!--vite:head:end-->`);
}

function getViteHead(input: string, bcomment = false) {
  if (bcomment) {
    return input.match(/<b:comment><!--vite:head:begin--><\/b:comment>([\s\S]*?)<b:comment><!--vite:head:end--><\/b:comment>/)?.[1] ?? null;
  }
  return input.match(/<!--vite:head:begin-->([\s\S]*?)<!--vite:head:end-->/)?.[1] ?? null;
}

function replaceHost(input: string, oldHost: string, newHost: string, newProto?: string) {
  return input.replace(
    new RegExp(`(https?:)?(\\/\\/|\\\\/\\\\/)${escapeRegex(oldHost)}`, 'g'),
    (_, proto, slash) => `${proto ? (newProto ?? proto) : ''}${slash ?? ''}${newHost}`,
  );
}

function useServerMiddleware(server: ViteDevServer | PreviewServer, ctx: PluginContext, isPreview = !('transformIndexHtml' in server)) {
  server.middlewares.use(async (req, res, next) => {
    if (!req.url || !req.originalUrl) {
      next();
      return;
    }

    const devBlogUrl = new URL(req.originalUrl, ctx.options.devBlog);
    const viewParam = devBlogUrl.searchParams.get('view');

    devBlogUrl.searchParams.set('view', `-Vite${isPreview ? 'Preview' : 'Development'}${viewParam?.startsWith('-') ? viewParam : ''}`);

    const devBlogResponse = await fetch(devBlogUrl);

    res.statusCode = devBlogResponse.status;

    devBlogResponse.headers.forEach((value, key) => {
      if (['content-type', 'x-robots-tag', 'date'].includes(key)) {
        res.setHeader(key, value);
      }
    });

    const host = (req.headers['x-forwarded-host'] as string) || req.headers.host;
    const proto =
      (req.headers['x-forwarded-proto'] as string) || (req.socket && 'encrypted' in req.socket && req.socket.encrypted ? 'https' : 'http');
    const contentType = devBlogResponse.headers.get('content-type');

    if (contentType?.startsWith('text/html')) {
      let templateContent = await devBlogResponse.text();

      if (host && proto) {
        templateContent = replaceHost(templateContent, devBlogUrl.hostname, host, `${proto}:`);
      }

      if (!isPreview && 'transformIndexHtml' in server) {
        const htmlTags: string[] = [];

        htmlTags.push(`<script src='/${path.relative(ctx.viteConfig.root, ctx.entry)}' type='module'></script>`);

        const template = await server.transformIndexHtml(req.originalUrl, replaceViteHead(templateContent, htmlTags.join('')));

        res.end(template);
      } else {
        const htmlTagsStr = getViteHead(fs.readFileSync(path.resolve(ctx.viteConfig.build.outDir, 'template.xml'), 'utf8'), true);

        const template = replaceViteHead(templateContent, htmlTagsStr ?? '');

        res.end(template);
      }
    } else if (host && proto && contentType && /^(text\/)|(application\/(.*\+)?(xml|json))/.test(contentType)) {
      const content = await devBlogResponse.text();

      res.end(replaceHost(content, devBlogUrl.hostname, host, `${proto}:`));
    } else {
      res.end(new Uint8Array(await devBlogResponse.arrayBuffer()));
    }
  });
}

export default function reactBloggerPlugin(userOptions: ReactBloggerPluginOptions) {
  const ctx = createPluginContext(userOptions);

  return {
    name: 'react-blogger-plugin',
    config(config) {
      const root = config.root || process.cwd();
      let entry: string | undefined;
      let template: string | undefined;

      if (ctx.options.entry) {
        const providedPath = path.resolve(root, ctx.options.entry);
        if (fs.existsSync(providedPath)) {
          entry = providedPath;
        } else {
          this.error(`Provided entry file does not exist: ${providedPath}`);
        }
      } else {
        const candidates = ['index.tsx', 'index.ts', 'index.jsx', 'index.js'];

        for (const file of candidates) {
          const fullPath = path.resolve(root, 'src', file);
          if (fs.existsSync(fullPath)) {
            entry = fullPath;
            break;
          }
        }

        if (!entry) {
          this.error(
            `No entry file found in "src".\n` +
              `Tried: ${candidates.map((c) => path.join('src', c)).join(', ')}\n` +
              '👉 Tip: You can pass a custom entry like:\n\n' +
              `   reactBloggerPlugin({ entry: "src/main.tsx" })`,
          );
        }
      }

      if (ctx.options.template) {
        const providedPath = path.resolve(root, ctx.options.template);
        if (fs.existsSync(providedPath)) {
          template = providedPath;
        } else {
          this.error(`Provided template file does not exist: ${providedPath}`);
        }
      } else {
        const candidates = ['template.xml', 'theme.xml'];

        for (const file of candidates) {
          const fullPath = path.resolve(root, 'src', file);
          if (fs.existsSync(fullPath)) {
            template = fullPath;
            break;
          }
        }

        if (!entry) {
          this.error(
            `No template file found in "src".\n` +
              `Tried: ${candidates.map((c) => path.join('src', c)).join(', ')}\n` +
              '👉 Tip: You can pass a custom template like:\n\n' +
              `   reactBloggerPlugin({ template: "src/my-template.xml" })`,
          );
        }
      }

      ctx.entry = entry as string;
      ctx.template = template as string;

      config.build ??= {};
      config.build.rollupOptions ??= {};
      config.build.rollupOptions.input = entry;

      fs.writeFileSync(ctx.template, replaceViteHead(replaceViteHead(fs.readFileSync(ctx.template, 'utf8'), ''), '', true), { encoding: 'utf8' });
    },
    configResolved(config) {
      ctx.viteConfig = config;
    },
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk' || !output.isEntry) {
          continue;
        }

        const templateContent = fs.readFileSync(ctx.template, 'utf8');

        const htmlTags: string[] = [];
        output.viteMetadata?.importedCss.forEach((value) => {
          htmlTags.push(`<link crossorigin='anonymous' href='${ctx.viteConfig.base + value}' rel='stylesheet'/>`);
        });
        htmlTags.push(`<script crossorigin='anonymous' src='${ctx.viteConfig.base + output.fileName}' type='module'></script>`);

        const template = replaceViteHead(templateContent, htmlTags.join(''), true);

        this.emitFile({
          type: 'asset',
          fileName: 'template.xml',
          source: template,
        });

        break;
      }
    },
    configureServer(server) {
      return () => {
        useServerMiddleware(server, ctx, false);
      };
    },
    configurePreviewServer(server) {
      return () => {
        useServerMiddleware(server, ctx, true);
      };
    },
  } satisfies Plugin;
}
