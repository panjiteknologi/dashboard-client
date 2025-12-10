import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all regulations
export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("Berlaku"), v.literal("Dicabut"), v.literal("Draft"))
    ),
    subCategoryId: v.optional(v.id("regulationSubCategories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Note: Auth checking should be done in Next.js API route before calling this
    let results;

    if (args.status && args.subCategoryId) {
      results = await ctx.db
        .query("regulations")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .filter((q) => q.eq(q.field("subCategoryId"), args.subCategoryId!))
        .order("desc")
        .take(args.limit || 100);
    } else if (args.status) {
      results = await ctx.db
        .query("regulations")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 100);
    } else if (args.subCategoryId) {
      results = await ctx.db
        .query("regulations")
        .withIndex("by_subCategoryId", (q) =>
          q.eq("subCategoryId", args.subCategoryId!)
        )
        .order("desc")
        .take(args.limit || 100);
    } else {
      results = await ctx.db
        .query("regulations")
        .order("desc")
        .take(args.limit || 100);
    }

    return results;
  },
});

// Get single regulation by ID
export const get = query({
  args: {
    id: v.id("regulations"),
  },
  handler: async (ctx, args) => {
    const regulation = await ctx.db.get(args.id);
    if (!regulation) {
      throw new Error("Regulation not found");
    }
    return regulation;
  },
});

// Get image URL from storage
export const getImageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Generate upload URL for image
export const generateImageUploadUrl = mutation({
  handler: async (ctx) => {
    // Note: Auth checking should be done in Next.js API route before calling this
    return await ctx.storage.generateUploadUrl();
  },
});

// Get regulation by number
export const getByNumber = query({
  args: {
    number: v.string(),
  },
  handler: async (ctx, args) => {
    const regulation = await ctx.db
      .query("regulations")
      .filter((q) => q.eq(q.field("number"), args.number))
      .first();
    if (!regulation) {
      throw new Error("Regulation not found");
    }
    return regulation;
  },
});

// Get regulation by numeric ID (for client-side compatibility)
export const getById = query({
  args: {
    id: v.number(),
  },
  handler: async (ctx, args) => {
    const regulation = await ctx.db
      .query("regulations")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    if (!regulation) {
      throw new Error("Regulation not found");
    }
    return regulation;
  },
});

// Create regulation
// Note: Auth checking should be done in Next.js API route before calling this
export const create = mutation({
  args: {
    data: v.object({
      id: v.number(),
      title: v.string(),
      subtitle: v.string(),
      image: v.string(), // URL string for backward compatibility
      imageStorageId: v.optional(v.id("_storage")), // Convex storage ID
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
      subCategoryId: v.id("regulationSubCategories"),
    }),
  },
  handler: async (ctx, args) => {
    // Verify subcategory exists
    const subCategory = await ctx.db.get(args.data.subCategoryId);
    if (!subCategory) {
      throw new Error("Regulation subcategory not found");
    }

    const regulationId = await ctx.db.insert("regulations", args.data);
    return regulationId;
  },
});

// Update regulation
// Note: Auth checking should be done in Next.js API route before calling this
export const update = mutation({
  args: {
    id: v.id("regulations"),
    data: v.object({
      title: v.optional(v.string()),
      subtitle: v.optional(v.string()),
      image: v.optional(v.string()), // URL string for backward compatibility
      imageStorageId: v.optional(v.id("_storage")), // Convex storage ID
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
      subCategoryId: v.optional(v.id("regulationSubCategories")),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Regulation not found");
    }

    // If subCategoryId is being updated, verify it exists
    if (args.data.subCategoryId !== undefined) {
      const subCategory = await ctx.db.get(args.data.subCategoryId);
      if (!subCategory) {
        throw new Error("Regulation subcategory not found");
      }
    }

    await ctx.db.patch(args.id, args.data);
    return { success: true };
  },
});

// Delete regulation
// Note: Auth checking should be done in Next.js API route before calling this
export const remove = mutation({
  args: {
    id: v.id("regulations"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Regulation not found");
    }

    // Delete image from storage if exists
    if (existing.imageStorageId) {
      await ctx.storage.delete(existing.imageStorageId);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Delete image from storage (helper function)
export const deleteImage = mutation({
  args: {
    storageId: v.id("_storage"),
    regulationId: v.id("regulations"),
  },
  handler: async (ctx, args) => {
    // Note: Auth checking should be done in Next.js API route before calling this
    const regulation = await ctx.db.get(args.regulationId);
    if (!regulation) {
      throw new Error("Regulation not found");
    }

    // Only delete if the storageId matches
    if (regulation.imageStorageId === args.storageId) {
      await ctx.storage.delete(args.storageId);
      // Remove storageId from regulation record
      await ctx.db.patch(args.regulationId, { imageStorageId: undefined });
    }

    return { success: true };
  },
});

