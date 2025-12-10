import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all video categories
// Note: Auth checking should be done in Next.js API route before calling this
export const list = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("videoCategories").collect();
    return categories;
  },
});

// Get single video category by ID
export const get = query({
  args: {
    id: v.id("videoCategories"),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) {
      throw new Error("Video category not found");
    }
    return category;
  },
});

// Create video category
// Note: Auth checking should be done in Next.js API route before calling this
export const create = mutation({
  args: {
    id: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const categoryId = await ctx.db.insert("videoCategories", {
      id: args.id,
      name: args.name,
    });
    return categoryId;
  },
});

// Update video category
// Note: Auth checking should be done in Next.js API route before calling this
export const update = mutation({
  args: {
    id: v.id("videoCategories"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Video category not found");
    }

    const updateData: { name?: string } = {};
    if (args.name !== undefined) {
      updateData.name = args.name;
    }

    await ctx.db.patch(args.id, updateData);
    return { success: true };
  },
});

// Delete video category
// Note: Auth checking should be done in Next.js API route before calling this
export const remove = mutation({
  args: {
    id: v.id("videoCategories"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Video category not found");
    }

    // Check if there are subcategories using this category
    const subCategories = await ctx.db
      .query("videoSubCategories")
      .withIndex("by_categoryId", (q) => q.eq("categoryId", args.id))
      .collect();

    if (subCategories.length > 0) {
      throw new Error("Cannot delete category with existing subcategories");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

