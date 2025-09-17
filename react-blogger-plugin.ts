import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import type { MinimalPluginContextWithoutEnvironment, Plugin, PreviewServer, ResolvedConfig, ViteDevServer } from 'vite';
import z from 'zod';

const ReactBloggerPluginOptionsSchema = z
  .object({
    entry: z.string().optional(),
    template: z.string().optional(),
    proxyBlog: z.url(),
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

function escapeHtml(input: string) {
  if (input === '') return '';
  return input.replace(/[&<>"'`]/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      case '`':
        return '&#96;';
      default:
        return ch;
    }
  });
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

function useServerMiddleware(
  server: ViteDevServer | PreviewServer,
  ctx: PluginContext,
  _this: MinimalPluginContextWithoutEnvironment,
  isPreview = !('transformIndexHtml' in server),
) {
  return () => {
    server.httpServer?.once('listening', () => {
      setTimeout(() => {
        _this.info(`Unhandled requests will be proxied to ${ctx.options.proxyBlog}`);
      }, 0);
    });

    server.middlewares.use(async (req, res, next) => {
      if (!req.url || !req.originalUrl) {
        next();
        return;
      }

      const start = Date.now();

      const proxyUrl = new URL(req.originalUrl, ctx.options.proxyBlog);
      const viewParam = proxyUrl.searchParams.get('view');

      proxyUrl.searchParams.set('view', `-Vite${isPreview ? 'Preview' : 'Development'}${viewParam?.startsWith('-') ? viewParam : ''}`);

      const proxyHeaders = new Headers();
      for (const [name, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
          for (const v of value) {
            proxyHeaders.append(name, v);
          }
        } else {
          proxyHeaders.set(name, value ?? '');
        }
      }

      const proxyResponse = await fetch(proxyUrl, {
        method: req.method,
        headers: proxyHeaders,
        body: ['GET', 'HEAD'].includes(req.method ?? '') ? undefined : Readable.toWeb(req),
        redirect: 'manual',
      }).catch((e) => {
        if (e instanceof Error) {
          _this.warn({
            message: `${e.name}: ${e.message}`,
            cause: e.cause,
            stack: e.stack,
          });
        } else {
          _this.warn('Fetch failed');
        }
        return null;
      });

      if (proxyResponse) {
        const host = (req.headers['x-forwarded-host'] as string) || req.headers.host;
        const proto =
          (req.headers['x-forwarded-proto'] as string) || (req.socket && 'encrypted' in req.socket && req.socket.encrypted ? 'https' : 'http');

        res.statusCode = proxyResponse.status;
        res.statusMessage = proxyResponse.statusText;

        proxyResponse.headers.forEach((value, key) => {
          if (key === 'location') {
            const redirectUrl = new URL(value, host ? host + req.originalUrl : proxyUrl.href);
            if ((host && redirectUrl.host === host) || redirectUrl.host === proxyUrl.host) {
              if (host && proto) {
                redirectUrl.host = host;
                redirectUrl.protocol = `${proto}:`;
              }
              const viewParam = redirectUrl.searchParams.get('view')?.replaceAll('-ViteDevelopment', '').replaceAll('-VitePreview', '');
              if (viewParam) {
                redirectUrl.searchParams.set('view', viewParam);
              } else {
                redirectUrl.searchParams.delete('view');
              }
              res.setHeader(key, redirectUrl.pathname + redirectUrl.search + redirectUrl.hash);
            } else {
              res.setHeader(key, redirectUrl.href);
            }
          } else if (['content-type', 'x-robots-tag', 'date', 'location'].includes(key)) {
            res.setHeader(key, value);
          }
        });

        const contentType = proxyResponse.headers.get('content-type');

        if (contentType?.startsWith('text/html')) {
          let templateContent = await proxyResponse.text();

          if (host && proto) {
            templateContent = replaceHost(templateContent, proxyUrl.host, host, `${proto}:`);
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
          const content = await proxyResponse.text();

          res.end(replaceHost(content, proxyUrl.host, host, `${proto}:`));
        } else {
          res.end(new Uint8Array(await proxyResponse.arrayBuffer()));
        }
      } else {
        res.statusCode = 500;
        res.statusMessage = 'Internal Server Error';

        res.setHeader('Content-Type', 'text/html');

        res.end(`<!DOCTYPE html>
<html>

<head>
  <meta charset='UTF-8'/>
  <meta content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes' name='viewport'/>
  <title>500 Internal Server Error</title>
  <link rel='icon' href='data:,' />
  <style>
    *, ::before, ::after {
      box-sizing: border-box;
    }
    body {
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
    }
    .card {
      padding: 24px;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      max-width: 448px;
      border-radius: 14px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .card-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .card-title {
      font-weight: 600;
    }
    .card-description {
      font-size: 14px;
      opacity: 0.85;
    }
    .card-footer {
      display: flex;
      align-items: center;
    }
    .button {
      display: inline-flex;
      white-space: nowrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 16px;
      font-weight: 500;
      background-color: #171717;
      outline: none;
      border: none;
      color: #ffffff;
      border-radius: 8px;
      min-height: 36px;
    }
    .button:hover {
      opacity: 0.9;
    }
    .button svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    .card-footer .button {
      flex-grow: 1;
    }
  </style>
</head>

<body>
  <div class='card'>
    <div class='card-content'>
      <div class='card-title'>500 Internal Server Error</div>
      <div class='card-description'>Failed to fetch: ${escapeHtml(proxyUrl.href)}</div>
    </div>
    <div class='card-footer'>
      <button class='button' type='button'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-ccw" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
        Reload
      </button>
    </div>
  </div>
  <script>
    const button = document.getElementsByTagName('button')[0];
    button.addEventListener('click', () => {
      window.location.reload();
    });
  </script>
</body>

</html>`);
      }

      const duration = Date.now() - start;

      _this.info(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${res.statusMessage} (${duration}ms)`);
    });
  };
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
      return useServerMiddleware(server, ctx, this, false);
    },
    configurePreviewServer(server) {
      return useServerMiddleware(server, ctx, this, true);
    },
  } satisfies Plugin;
}
