// stackbit.config.ts
import { defineStackbitConfig, SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  // ← Add the required Stackbit version here:
  stackbitVersion: "~0.7.0",

  // Your existing SSG / Node settings (optional, but recommended):
  ssgName: "astro",     // or "nextjs" if you’re on Next.js
  nodeVersion: "18",

  // 1) Wire up Git as your content source
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],         // ← your top-level content folder

      models: [
        {
          name: "Page",
          type: "page",                   // marks this as a page model
          urlPath: "/{slug}",             // builds URLs like /about, /contact
          filePath: "content/{slug}.mdx", // adjust to .md if needed
          fields: [
            { name: "slug",  type: "string",   required: true },
            { name: "title", type: "string",   required: true },
            { name: "body",  type: "markdown", required: true },
            { name: "image", type: "image",    required: false },
          ],
        },
      ],
    }),
  ],

  // 2) (Optional) Custom sitemap logic—your URL mapping is already handled by urlPath above
  siteMap: ({ documents, models }): SiteMapEntry[] => {
    const pageModelNames = models
      .filter((m) => m.type === "page")
      .map((m) => m.name);

    return documents
      .filter((doc) => pageModelNames.includes(doc.modelName))
      .map((doc) => {
        const slug = String(doc.fields.slug.value);
        return {
          stableId: doc.id,
          urlPath: slug === "index" ? "/" : `/${slug}/`,
          document: doc,
          isHomePage: slug === "index",
        };
      });
  },
});
