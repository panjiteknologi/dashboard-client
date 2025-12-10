import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all regulation subcategories
// Note: Auth checking should be done in Next.js API route before calling this
export const list = query({
  args: {
    categoryId: v.optional(v.id("regulationCategories")),
  },
  handler: async (ctx, args) => {
    if (args.categoryId) {
      const categoryId = args.categoryId;
      const subCategories = await ctx.db
        .query("regulationSubCategories")
        .withIndex("by_categoryId", (q) => q.eq("categoryId", categoryId))
        .collect();
      return subCategories;
    }
    const subCategories = await ctx.db.query("regulationSubCategories").collect();
    return subCategories;
  },
});

// Get single regulation subcategory by ID
export const get = query({
  args: {
    id: v.id("regulationSubCategories"),
  },
  handler: async (ctx, args) => {
    const subCategory = await ctx.db.get(args.id);
    if (!subCategory) {
      throw new Error("Regulation subcategory not found");
    }
    return subCategory;
  },
});

// Create regulation subcategory
// Note: Auth checking should be done in Next.js API route before calling this
export const create = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    categoryId: v.id("regulationCategories"),
  },
  handler: async (ctx, args) => {
    // Verify category exists
    const category = await ctx.db.get(args.categoryId);
    if (!category) {
      throw new Error("Regulation category not found");
    }

    const subCategoryId = await ctx.db.insert("regulationSubCategories", {
      id: args.id,
      name: args.name,
      categoryId: args.categoryId,
    });
    return subCategoryId;
  },
});

// Update regulation subcategory
// Note: Auth checking should be done in Next.js API route before calling this
export const update = mutation({
  args: {
    id: v.id("regulationSubCategories"),
    name: v.optional(v.string()),
    categoryId: v.optional(v.id("regulationCategories")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Regulation subcategory not found");
    }

    // If categoryId is being updated, verify it exists
    if (args.categoryId !== undefined) {
      const category = await ctx.db.get(args.categoryId);
      if (!category) {
        throw new Error("Regulation category not found");
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

// Delete regulation subcategory
// Note: Auth checking should be done in Next.js API route before calling this
export const remove = mutation({
  args: {
    id: v.id("regulationSubCategories"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Regulation subcategory not found");
    }

    // Check if there are regulations using this subcategory
    const regulations = await ctx.db
      .query("regulations")
      .withIndex("by_subCategoryId", (q) => q.eq("subCategoryId", args.id))
      .collect();

    if (regulations.length > 0) {
      throw new Error("Cannot delete subcategory with existing regulations");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

