import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all library videos
// Note: Auth checking should be done in Next.js API route before calling this
export const list = query({
  args: {
    subCategoryId: v.optional(v.id("videoSubCategories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.subCategoryId) {
      const subCategoryId = args.subCategoryId;
      const videos = await ctx.db
        .query("libraryVideos")
        .withIndex("by_subCategoryId", (q) =>
          q.eq("subCategoryId", subCategoryId)
        )
        .take(args.limit || 100);
      return videos;
    }
    const videos = await ctx.db.query("libraryVideos").take(args.limit || 100);
    return videos;
  },
});

// Get single library video by ID
export const get = query({
  args: {
    id: v.id("libraryVideos"),
  },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (!video) {
      throw new Error("Library video not found");
    }
    return video;
  },
});

// Create library video
// Note: Auth checking should be done in Next.js API route before calling this
export const create = mutation({
  args: {
    id: v.number(),
    title: v.string(),
    description: v.string(),
    url: v.string(),
    subCategoryId: v.id("videoSubCategories"),
  },
  handler: async (ctx, args) => {
    // Verify subcategory exists
    const subCategory = await ctx.db.get(args.subCategoryId);
    if (!subCategory) {
      throw new Error("Video subcategory not found");
    }

    const videoId = await ctx.db.insert("libraryVideos", {
      id: args.id,
      title: args.title,
      description: args.description,
      url: args.url,
      subCategoryId: args.subCategoryId,
    });
    return videoId;
  },
});

// Update library video
// Note: Auth checking should be done in Next.js API route before calling this
export const update = mutation({
  args: {
    id: v.id("libraryVideos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    subCategoryId: v.optional(v.id("videoSubCategories")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Library video not found");
    }

    // If subCategoryId is being updated, verify it exists
    if (args.subCategoryId !== undefined) {
      const subCategory = await ctx.db.get(args.subCategoryId);
      if (!subCategory) {
        throw new Error("Video subcategory not found");
      }
    }

    const updateData: {
      title?: string;
      description?: string;
      url?: string;
      subCategoryId?: typeof args.subCategoryId;
    } = {};
    if (args.title !== undefined) {
      updateData.title = args.title;
    }
    if (args.description !== undefined) {
      updateData.description = args.description;
    }
    if (args.url !== undefined) {
      updateData.url = args.url;
    }
    if (args.subCategoryId !== undefined) {
      updateData.subCategoryId = args.subCategoryId;
    }

    await ctx.db.patch(args.id, updateData);
    return { success: true };
  },
});

// Delete library video
// Note: Auth checking should be done in Next.js API route before calling this
export const remove = mutation({
  args: {
    id: v.id("libraryVideos"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Library video not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
