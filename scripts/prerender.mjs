import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { createServer, loadEnv } from "vite";

const root = process.cwd();
const env = loadEnv("production", root, "");

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
const siteUrl = (env.VITE_SITE_URL || "http://localhost:5173").replace(/\/$/, "");

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const defaultShareImageUrl = `${siteUrl}/images/logo.png`;

const buildHead = ({ title, description, canonicalPath, imageUrl = defaultShareImageUrl }) => {
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (imageUrl) {
    tags.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}" />`);
  }
  return tags.join("\n    ");
};

const injectIntoTemplate = (template, { head, bodyHtml, dehydratedState }) => {
  let output = template.replace(/<title>[\s\S]*?<\/title>\s*/, "");
  output = output.replace(/<meta[^>]*name="description"[^>]*>\s*/s, "");
  output = output.replace("</head>", `    ${head}\n  </head>`);
  if (bodyHtml !== undefined) {
    output = output.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  }
  if (dehydratedState !== undefined) {
    const serialized = JSON.stringify(dehydratedState).replace(/</g, "\\u003c");
    const stateScript = `<script>window.__REACT_QUERY_STATE__ = ${serialized};</script>\n  `;
    output = output.replace("</body>", `${stateScript}</body>`);
  }
  return output;
};

const writeFile = (filePath, contents) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
};

const main = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY for prerendering.");
  }

  const distDir = path.join(root, "dist");
  const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

  // Generic client-only shell for private routes (login, account, admin) that
  // aren't prerendered — see public/_redirects.
  fs.writeFileSync(path.join(distDir, "app-shell.html"), template);

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name, description, price, sold_out, images")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const vite = await createServer({ root, server: { middlewareMode: true }, appType: "custom" });

  const { renderPage } = await vite.ssrLoadModule("/src/entry-server.tsx");
  const { homeMeta, productsMeta, getProductMeta } = await vite.ssrLoadModule("/src/seo/seo.ts");

  const routes = [
    {
      urlPath: "/",
      outputFile: path.join(distDir, "index.html"),
      ...homeMeta,
    },
    {
      urlPath: "/products",
      outputFile: path.join(distDir, "products", "index.html"),
      ...productsMeta,
    },
    ...products.map((product) => {
      const meta = getProductMeta(product);
      return {
        urlPath: `/products/${product.slug}`,
        outputFile: path.join(distDir, "products", product.slug, "index.html"),
        title: meta.title,
        description: meta.description,
        imageUrl: product.images?.[0],
      };
    }),
  ];

  for (const route of routes) {
    const { html: bodyHtml, dehydratedState } = await renderPage(route.urlPath);
    const head = buildHead({
      title: route.title,
      description: route.description,
      canonicalPath: route.urlPath,
      imageUrl: route.imageUrl,
    });
    const html = injectIntoTemplate(template, { head, bodyHtml, dehydratedState });
    writeFile(route.outputFile, html);
    console.log(`Prerendered ${route.urlPath} -> ${path.relative(distDir, route.outputFile)}`);
  }

  await vite.close();

  const sitemapUrls = routes.map((route) => `${siteUrl}${route.urlPath}`);
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapUrls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`),
    "</urlset>",
    "",
  ].join("\n");
  writeFile(path.join(distDir, "sitemap.xml"), sitemap);

  const robots = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /addproduct",
    "Disallow: /account",
    "Disallow: /login",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
  writeFile(path.join(distDir, "robots.txt"), robots);

  console.log(`Wrote sitemap.xml and robots.txt (site URL: ${siteUrl}).`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
