// stackbit.config.ts
import { 
  defineStackbitConfig, 
  SiteMapEntry, 
  DocumentStringLikeFieldNonLocalized 
} from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.7.0",
  ssgName: "astro",
  nodeVersion: "18",

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],

      models: [
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
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

  siteMap: ({ documents, models }): SiteMapEntry[] => {
    // Only include your Page model
    const pageModelNames = models
      .filter((m) => m.type === "page")
      .map((m) => m.name);

    return documents
      .filter((doc) => pageModelNames.includes(doc.modelName))
      .map((doc) => {
        // Cast to the proper field type so .value exists:
        const slugField = doc.fields
          .slug as DocumentStringLikeFieldNonLocalized;

        const slug = slugField.value;
        return {
          stableId: doc.id,
          urlPath: slug === "index" ? "/" : `/${slug}/`,
          document: doc,
          isHomePage: slug === "index",
        };
      });
  },
});
