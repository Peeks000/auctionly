import { describe, it, expect } from "vitest";
import {
  getAllListings,
  getListingBySlug,
  getListingById,
  findListing,
  getFeaturedListings,
  getBuyNowListings,
  getLiveAuctionListings,
  getListingsByDepartment,
  getRelatedListings,
  queryListings,
  getCategories,
  getCategoryBySlug,
  getTotalListingsCount,
} from "../src/lib/catalogueService";

describe("AUCTIONLY Catalogue Service Layer Unit Tests", () => {
  it("returns all listings with correct structure and total count", () => {
    const listings = getAllListings();
    expect(listings.length).toBeGreaterThan(0);
    expect(getTotalListingsCount()).toBe(listings.length);

    listings.forEach((listing) => {
      expect(listing).toHaveProperty("id");
      expect(listing).toHaveProperty("title");
      expect(listing).toHaveProperty("slug");
      expect(listing).toHaveProperty("starting_price");
      expect(typeof listing.starting_price).toBe("number");
    });
  });

  it("finds listings by slug and id deterministically", () => {
    const first = getAllListings()[0];
    expect(first).toBeDefined();

    const bySlug = getListingBySlug(first.slug);
    expect(bySlug).toBeDefined();
    expect(bySlug?.id).toBe(first.id);

    const byId = getListingById(first.id);
    expect(byId).toBeDefined();
    expect(byId?.slug).toBe(first.slug);

    const byFindListing = findListing(first.slug);
    expect(byFindListing?.id).toBe(first.id);

    const nonExistent = getListingBySlug("non-existent-lot-slug-xyz");
    expect(nonExistent).toBeUndefined();
  });

  it("retrieves featured and buy now lots correctly", () => {
    const featured = getFeaturedListings();
    expect(featured.length).toBeGreaterThan(0);
    featured.forEach((item) => {
      expect(item.is_featured).toBe(true);
    });

    const buyNow = getBuyNowListings();
    expect(buyNow.length).toBeGreaterThan(0);
    buyNow.forEach((item) => {
      expect(item.buy_now_price).not.toBeNull();
      expect(typeof item.buy_now_price).toBe("number");
    });
  });

  it("retrieves live auction lots correctly", () => {
    const liveLots = getLiveAuctionListings();
    liveLots.forEach((lot) => {
      const isLiveOrActive =
        lot.auction?.is_live ||
        lot.auction?.status === "active" ||
        lot.auction?.status === "extended";
      expect(isLiveOrActive).toBeTruthy();
    });
  });

  it("filters and sorts listings via queryListings", () => {
    // 1. Search filter
    const searchResults = queryListings({ searchQuery: "Patek" });
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults[0].title.toLowerCase()).toContain("patek");

    // 2. Sort by price ascending
    const sortedAsc = queryListings({ sortBy: "price_asc" });
    for (let i = 0; i < sortedAsc.length - 1; i++) {
      const priceA = sortedAsc[i].buy_now_price || sortedAsc[i].auction?.current_price || sortedAsc[i].starting_price;
      const priceB = sortedAsc[i + 1].buy_now_price || sortedAsc[i + 1].auction?.current_price || sortedAsc[i + 1].starting_price;
      expect(priceA).toBeLessThanOrEqual(priceB);
    }

    // 3. Sort by price descending
    const sortedDesc = queryListings({ sortBy: "price_desc" });
    for (let i = 0; i < sortedDesc.length - 1; i++) {
      const priceA = sortedDesc[i].buy_now_price || sortedDesc[i].auction?.current_price || sortedDesc[i].starting_price;
      const priceB = sortedDesc[i + 1].buy_now_price || sortedDesc[i + 1].auction?.current_price || sortedDesc[i + 1].starting_price;
      expect(priceA).toBeGreaterThanOrEqual(priceB);
    }
  });

  it("handles categories and departments correctly", () => {
    const categories = getCategories();
    expect(categories.length).toBe(7);

    const firstCat = categories[0];
    const found = getCategoryBySlug(firstCat.slug);
    expect(found?.id).toBe(firstCat.id);

    const deptLots = getListingsByDepartment(firstCat.slug);
    deptLots.forEach((lot) => {
      expect(lot.category_id).toBe(firstCat.id);
    });
  });

  it("retrieves related lots excluding the current lot", () => {
    const all = getAllListings();
    const first = all[0];
    const related = getRelatedListings(first.id, first.category_id, 3);
    related.forEach((rel) => {
      expect(rel.id).not.toBe(first.id);
      expect(rel.category_id).toBe(first.category_id);
    });
  });
});
