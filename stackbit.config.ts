// stackbit.config.ts
import { defineStackbitConfig, SiteMapEntry } from "@stackbit/types";
import { GitContentSource }        from "@stackbit/cms-git";

export default defineStackbitConfig({
  // …any other top-level settings you have…

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,

      // 1) point at your actual content folder
      contentDirs: ["content"],

      models: [
        {
          name: "Page",
          type: "page",                  // mark it as a page model
          urlPath: "/{slug}",            // will generate /about, /contact, etc.
          // match whatever file extension you have (mdx or md)
          filePath: "content/{slug}.mdx",
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

  // 3) optional: custom sitemap logic
  siteMap: ({ documents, models }): SiteMapEntry[] => {
    const pageNames = models
      .filter((m) => m.type === "page")
      .map((m) => m.name);

    return documents
      .filter((doc) => pageNames.includes(doc.modelName))
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
