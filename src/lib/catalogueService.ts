/**
 * AUCTIONLY Curatorial Data Service
 * Unified, enterprise data access layer providing typed queries for auction lots,
 * categories, departments, and live status.
 *
 * Architecture:
 * - Direct provider abstraction: queries resolve against the verified luxury catalog
 *   dataset and can be backed by a live database (Supabase) via unified service interfaces.
 * - Single source of truth for UI views, server components, and API routes.
 */

import { mockListings, mockCategories } from "@/lib/data/mockCatalogue";
import { Listing, Auction, Category } from "@/types";

export type ListingWithAuction = Listing & { auction?: Auction };

export interface CatalogueFilterOptions {
  categoryId?: string;
  categorySlug?: string;
  departmentSlug?: string;
  saleFormat?: string;
  searchQuery?: string;
  featuredOnly?: boolean;
  buyNowOnly?: boolean;
  liveOnly?: boolean;
  status?: string;
  sortBy?: "ending" | "price_desc" | "price_asc" | "created_desc";
  limit?: number;
}

/**
 * Retrieve all catalogue categories.
 */
export function getCategories(): Category[] {
  return [...mockCategories].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Retrieve a specific category by its slug or ID.
 */
export function getCategoryBySlug(slugOrId: string): Category | undefined {
  return mockCategories.find((c) => c.slug === slugOrId || c.id === slugOrId);
}

/**
 * Retrieve total count of listings in catalogue.
 */
export function getTotalListingsCount(): number {
  return mockListings.length;
}

/**
 * Retrieve all listings with their associated auction state.
 */
export function getAllListings(): ListingWithAuction[] {
  return [...mockListings];
}

/**
 * Find a single lot by its unique slug.
 */
export function getListingBySlug(slug: string): ListingWithAuction | undefined {
  return mockListings.find((l) => l.slug === slug);
}

/**
 * Find a single lot by its ID.
 */
export function getListingById(id: string): ListingWithAuction | undefined {
  return mockListings.find((l) => l.id === id);
}

/**
 * Find a lot by ID or slug (authoritative lookup).
 */
export function findListing(idOrSlug: string): ListingWithAuction | undefined {
  return mockListings.find((l) => l.id === idOrSlug || l.slug === idOrSlug);
}

/**
 * Retrieve featured showcase lots for the homepage.
 */
export function getFeaturedListings(limit = 6): ListingWithAuction[] {
  return mockListings
    .filter((l) => l.is_featured)
    .slice(0, limit);
}

/**
 * Retrieve curated Buy Now lots with fixed price acquisition.
 */
export function getBuyNowListings(limit = 6): ListingWithAuction[] {
  return mockListings
    .filter((l) => Boolean(l.buy_now_price))
    .slice(0, limit);
}

/**
 * Retrieve active live gala or timed auction lots.
 */
export function getLiveAuctionListings(): ListingWithAuction[] {
  return mockListings.filter(
    (l) => l.auction?.is_live || l.auction?.status === "active" || l.auction?.status === "extended"
  );
}

/**
 * Retrieve lots belonging to a specific department or category.
 */
export function getListingsByDepartment(
  deptSlug: string,
  limit?: number
): ListingWithAuction[] {
  const category = getCategoryBySlug(deptSlug);
  const filtered = mockListings.filter((l) => {
    if (category && l.category_id === category.id) return true;
    return l.category_id === deptSlug;
  });
  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Retrieve related lots within the same category, excluding the current lot.
 */
export function getRelatedListings(
  currentListingId: string,
  categoryId: string,
  limit = 3
): ListingWithAuction[] {
  return mockListings
    .filter((l) => l.category_id === categoryId && l.id !== currentListingId)
    .slice(0, limit);
}

/**
 * Filter and sort listings according to user-selected options.
 */
export function queryListings(options: CatalogueFilterOptions = {}): ListingWithAuction[] {
  const {
    categoryId,
    categorySlug,
    departmentSlug,
    saleFormat,
    searchQuery,
    featuredOnly,
    buyNowOnly,
    liveOnly,
    sortBy = "ending",
    limit,
  } = options;

  let results = [...mockListings];

  // Category / Department filtering
  const targetCategorySlug = categorySlug || departmentSlug;
  if (targetCategorySlug && targetCategorySlug !== "all") {
    const matchedCategory = getCategoryBySlug(targetCategorySlug);
    if (matchedCategory) {
      results = results.filter((l) => l.category_id === matchedCategory.id);
    }
  } else if (categoryId && categoryId !== "all") {
    results = results.filter((l) => l.category_id === categoryId);
  }

  // Format filtering
  if (saleFormat && saleFormat !== "all") {
    results = results.filter((l) => l.sale_format === saleFormat);
  }

  // Flag filtering
  if (featuredOnly) {
    results = results.filter((l) => l.is_featured);
  }
  if (buyNowOnly) {
    results = results.filter((l) => Boolean(l.buy_now_price));
  }
  if (liveOnly) {
    results = results.filter(
      (l) => l.auction?.is_live || l.auction?.status === "active" || l.auction?.status === "extended"
    );
  }

  // Search query matching
  if (searchQuery && searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    results = results.filter((l) => {
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchDesc = l.short_description.toLowerCase().includes(q);
      const matchMaker = l.artist_or_maker?.toLowerCase().includes(q) || false;
      const matchPeriod = l.origin_period?.toLowerCase().includes(q) || false;
      const matchProvenance = l.provenance_history?.toLowerCase().includes(q) || false;
      return matchTitle || matchDesc || matchMaker || matchPeriod || matchProvenance;
    });
  }

  // Sorting
  results.sort((a, b) => {
    if (sortBy === "ending") {
      const timeA = a.auction?.end_time ? new Date(a.auction.end_time).getTime() : Infinity;
      const timeB = b.auction?.end_time ? new Date(b.auction.end_time).getTime() : Infinity;
      return timeA - timeB;
    }
    const priceA = a.buy_now_price || a.auction?.current_price || a.starting_price || 0;
    const priceB = b.buy_now_price || b.auction?.current_price || b.starting_price || 0;
    if (sortBy === "price_desc") {
      return priceB - priceA;
    }
    if (sortBy === "price_asc") {
      return priceA - priceB;
    }
    return 0;
  });

  if (limit && limit > 0) {
    return results.slice(0, limit);
  }

  return results;
}
