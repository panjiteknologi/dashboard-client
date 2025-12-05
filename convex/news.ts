import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all news
export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("Berlaku"), v.literal("Dicabut"), v.literal("Draft"))
    ),
    type: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Note: Auth checking should be done in Next.js API route before calling this
    let results;

    if (args.status) {
      results = await ctx.db
        .query("news")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 100);
    } else if (args.type) {
      results = await ctx.db
        .query("news")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .order("desc")
        .take(args.limit || 100);
    } else {
      results = await ctx.db
        .query("news")
        .order("desc")
        .take(args.limit || 100);
    }

    return results;
  },
});

// Get single news by ID
export const get = query({
  args: {
    id: v.id("news"),
  },
  handler: async (ctx, args) => {
    const news = await ctx.db.get(args.id);
    if (!news) {
      throw new Error("News not found");
    }
    return news;
  },
});

// Get news by number
export const getByNumber = query({
  args: {
    number: v.string(),
  },
  handler: async (ctx, args) => {
    const news = await ctx.db
      .query("news")
      .withIndex("by_number", (q) => q.eq("number", args.number))
      .first();
    if (!news) {
      throw new Error("News not found");
    }
    return news;
  },
});

// Create news
// Note: Auth checking should be done in Next.js API route before calling this
export const create = mutation({
  args: {
    data: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    // Note: Auth checking should be done in Next.js API route before calling this
    const newsId = await ctx.db.insert("news", args.data);
    return newsId;
  },
});

// Update news
// Note: Auth checking should be done in Next.js API route before calling this
export const update = mutation({
  args: {
    id: v.id("news"),
    data: v.object({
      title: v.optional(v.string()),
      subtitle: v.optional(v.string()),
      image: v.optional(v.string()),
      number: v.optional(v.string()),
      type: v.optional(v.string()),
      issuer: v.optional(v.string()),
      sector: v.optional(v.string()),
      jurisdiction: v.optional(v.string()),
      status: v.optional(
        v.union(v.literal("Berlaku"), v.literal("Dicabut"), v.literal("Draft"))
      ),
      publishedAt: v.optional(v.string()),
      effectiveAt: v.optional(v.string()),
      summary: v.optional(v.string()),
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
      modules: v.optional(
        v.array(
          v.object({
            duration: v.string(),
            title: v.string(),
            isFree: v.boolean(),
          })
        )
      ),
      relatedCourses: v.optional(v.array(v.string())),
      author: v.optional(v.string()),
      time: v.optional(v.string()),
      students: v.optional(v.string()),
      chapters: v.optional(v.string()),
      level: v.optional(v.string()),
      price: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("News not found");
    }

    await ctx.db.patch(args.id, args.data);
    return { success: true };
  },
});

// Delete news
// Note: Auth checking should be done in Next.js API route before calling this
export const remove = mutation({
  args: {
    id: v.id("news"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("News not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
