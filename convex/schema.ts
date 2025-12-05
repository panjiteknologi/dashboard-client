import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // News table based on NewsType
  news: defineTable({
    // Basic fields
    id: v.number(),
    title: v.string(),
    subtitle: v.string(),
    image: v.string(),
    number: v.string(),
    type: v.string(),
    issuer: v.string(),
    sector: v.string(),
    jurisdiction: v.string(),
    status: v.union(
      v.literal("Berlaku"),
      v.literal("Dicabut"),
      v.literal("Draft")
    ),
    publishedAt: v.string(),
    effectiveAt: v.string(),
    summary: v.string(),

    // Optional fields
    keywords: v.optional(v.array(v.string())),
    sourceUrl: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          filename: v.string(),
          url: v.string(),
        })
      )
    ),
    sections: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
        })
      )
    ),
    relatedRegulations: v.optional(
      v.array(
        v.object({
          id: v.number(),
          title: v.string(),
        })
      )
    ),

    // Additional fields
    modules: v.array(
      v.object({
        duration: v.string(),
        title: v.string(),
        isFree: v.boolean(),
      })
    ),
    relatedCourses: v.array(v.string()),
    author: v.string(),
    time: v.string(),
    students: v.string(),
    chapters: v.string(),
    level: v.string(),
    price: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_publishedAt", ["publishedAt"])
    .index("by_number", ["number"]),

  // Video Categories table
  videoCategories: defineTable({
    id: v.string(),
    name: v.string(),
  }),

  // Video SubCategories table
  videoSubCategories: defineTable({
    id: v.string(),
    name: v.string(),
    categoryId: v.id("videoCategories"),
  }).index("by_categoryId", ["categoryId"]),

  // Library Videos table
  libraryVideos: defineTable({
    id: v.number(),
    title: v.string(),
    description: v.string(),
    url: v.string(),
    subCategoryId: v.id("videoSubCategories"),
  }).index("by_subCategoryId", ["subCategoryId"]),
});
