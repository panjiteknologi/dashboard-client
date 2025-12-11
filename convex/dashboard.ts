import { query } from "./_generated/server";

// Dashboard statistics query
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    // Get total counts
    const totalNews = await ctx.db.query("news").collect();
    const totalVideos = await ctx.db.query("libraryVideos").collect();
    const totalRegulations = await ctx.db.query("regulations").collect();

    // Get news by status
    const newsByStatus = {
      Berlaku: totalNews.filter((n) => n.status === "Berlaku").length,
      Dicabut: totalNews.filter((n) => n.status === "Dicabut").length,
      Draft: totalNews.filter((n) => n.status === "Draft").length,
    };

    // Get regulations by status
    const regulationsByStatus = {
      Berlaku: totalRegulations.filter((r) => r.status === "Berlaku").length,
      Dicabut: totalRegulations.filter((r) => r.status === "Dicabut").length,
      Draft: totalRegulations.filter((r) => r.status === "Draft").length,
    };

    // Get video categories count
    const videoCategories = await ctx.db.query("videoCategories").collect();
    const regulationCategories = await ctx.db.query("regulationCategories").collect();

    return {
      totals: {
        news: totalNews.length,
        videos: totalVideos.length,
        regulations: totalRegulations.length,
      },
      newsByStatus,
      regulationsByStatus,
      categories: {
        videoCategories: videoCategories.length,
        regulationCategories: regulationCategories.length,
      },
    };
  },
});

