import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all regulation categories
// Note: Auth checking should be done in Next.js API route before calling this
export const list = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("regulationCategories").collect();
    return categories;
  },
});

// Get single regulation category by ID
export const get = query({
  args: {
    id: v.id("regulationCategories"),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) {
      throw new Error("Regulation category not found");
    }
    return category;
  },
});

// Create regulation category
// Note: Auth checking should be done in Next.js API route before calling this
export const create = mutation({
  args: {
    id: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const categoryId = await ctx.db.insert("regulationCategories", {
      id: args.id,
      name: args.name,
    });
    return categoryId;
  },
});

// Update regulation category
// Note: Auth checking should be done in Next.js API route before calling this
export const update = mutation({
  args: {
    id: v.id("regulationCategories"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Regulation category not found");
    }

    const updateData: { name?: string } = {};
    if (args.name !== undefined) {
      updateData.name = args.name;
    }

    await ctx.db.patch(args.id, updateData);
    return { success: true };
  },
});

// Delete regulation category
// Note: Auth checking should be done in Next.js API route before calling this
export const remove = mutation({
  args: {
    id: v.id("regulationCategories"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Regulation category not found");
    }

    // Check if there are subcategories using this category
    const subCategories = await ctx.db
      .query("regulationSubCategories")
      .withIndex("by_categoryId", (q) => q.eq("categoryId", args.id))
      .collect();

    if (subCategories.length > 0) {
      throw new Error("Cannot delete category with existing subcategories");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

