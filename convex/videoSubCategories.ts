import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all video subcategories
// Note: Auth checking should be done in Next.js API route before calling this
export const list = query({
  args: {
    categoryId: v.optional(v.id("videoCategories")),
  },
  handler: async (ctx, args) => {
    if (args.categoryId) {
      const categoryId = args.categoryId;
      const subCategories = await ctx.db
        .query("videoSubCategories")
        .withIndex("by_categoryId", (q) => q.eq("categoryId", categoryId))
        .collect();
      return subCategories;
    }
    const subCategories = await ctx.db.query("videoSubCategories").collect();
    return subCategories;
  },
});

// Get single video subcategory by ID
export const get = query({
  args: {
    id: v.id("videoSubCategories"),
  },
  handler: async (ctx, args) => {
    const subCategory = await ctx.db.get(args.id);
    if (!subCategory) {
      throw new Error("Video subcategory not found");
    }
    return subCategory;
  },
});

// Create video subcategory
// Note: Auth checking should be done in Next.js API route before calling this
export const create = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    categoryId: v.id("videoCategories"),
  },
  handler: async (ctx, args) => {
    // Verify category exists
    const category = await ctx.db.get(args.categoryId);
    if (!category) {
      throw new Error("Video category not found");
    }

    const subCategoryId = await ctx.db.insert("videoSubCategories", {
      id: args.id,
      name: args.name,
      categoryId: args.categoryId,
    });
    return subCategoryId;
  },
});

// Update video subcategory
// Note: Auth checking should be done in Next.js API route before calling this
export const update = mutation({
  args: {
    id: v.id("videoSubCategories"),
    name: v.optional(v.string()),
    categoryId: v.optional(v.id("videoCategories")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Video subcategory not found");
    }

    // If categoryId is being updated, verify it exists
    if (args.categoryId !== undefined) {
      const category = await ctx.db.get(args.categoryId);
      if (!category) {
        throw new Error("Video category not found");
      }
    }

    const updateData: { name?: string; categoryId?: typeof args.categoryId } =
      {};
    if (args.name !== undefined) {
      updateData.name = args.name;
    }
    if (args.categoryId !== undefined) {
      updateData.categoryId = args.categoryId;
    }

    await ctx.db.patch(args.id, updateData);
    return { success: true };
  },
});

// Delete video subcategory
// Note: Auth checking should be done in Next.js API route before calling this
export const remove = mutation({
  args: {
    id: v.id("videoSubCategories"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Video subcategory not found");
    }

    // Check if there are videos using this subcategory
    const videos = await ctx.db
      .query("libraryVideos")
      .withIndex("by_subCategoryId", (q) => q.eq("subCategoryId", args.id))
      .collect();

    if (videos.length > 0) {
      throw new Error("Cannot delete subcategory with existing videos");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
