import { z } from "zod";

// ─── Shared Schema Fragments ────────────────────────────────────────────────

const paginationFields = {
  page: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Page number (starts at 1). Omit for the first page."),
  per_page: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("Results per page (1-100). Defaults to 20."),
};

// ─── Tool Definitions ───────────────────────────────────────────────────────

export const TOOLS = {
  // ── Stores ──────────────────────────────────────────────────────────────

  search_stores: {
    description:
      "Search the Cart database of e-commerce stores. Filter by keyword, platform (e.g. shopify, woocommerce), language, minimum traffic, and more. Returns a paginated list of store summaries with traffic metrics, product counts, and platform info.",
    schema: z.object({
      keyword: z
        .string()
        .optional()
        .describe(
          "Search term to match against store name, domain, or description (e.g. 'pet supplies', 'fitness').",
        ),
      platform: z
        .string()
        .optional()
        .describe(
          "E-commerce platform filter (e.g. 'shopify', 'woocommerce', 'bigcommerce', 'magento').",
        ),
      language: z
        .string()
        .optional()
        .describe("Two-letter language code to filter stores (e.g. 'en', 'fr', 'de')."),
      min_traffic: z
        .number()
        .int()
        .nonnegative()
        .optional()
        .describe("Minimum monthly visitors. Use this to filter out low-traffic stores."),
      sort: z
        .string()
        .optional()
        .describe(
          "Sort field (e.g. 'monthly_visitors', 'products_count', 'created_at'). Prefix with '-' for descending.",
        ),
      ...paginationFields,
    }),
  },

  get_store: {
    description:
      "Get the full profile for a single e-commerce store by its domain. Returns detailed info including traffic stats, product count, platform, social links, business model flags (dropshipping, print-on-demand), and more.",
    schema: z.object({
      domain: z
        .string()
        .describe(
          "The store domain to look up (e.g. 'gymshark.com', 'allbirds.com'). Do not include https:// or paths.",
        ),
    }),
  },

  get_store_products: {
    description:
      "List products sold by a specific e-commerce store. Returns a paginated list of product titles, prices, images, and vendors.",
    schema: z.object({
      domain: z
        .string()
        .describe("The store domain (e.g. 'gymshark.com')."),
      sort: z
        .string()
        .optional()
        .describe("Sort field for products (e.g. 'price', '-price', 'added_at')."),
      ...paginationFields,
    }),
  },

  get_store_traffic: {
    description:
      "Get detailed traffic analytics for a store, including monthly visitors, trend percentage, bounce rate, average visit length, pages per visit, geographic breakdown, and traffic sources (direct, search, social, mail, display, referrals).",
    schema: z.object({
      domain: z
        .string()
        .describe("The store domain (e.g. 'gymshark.com')."),
    }),
  },

  get_store_tech: {
    description:
      "Get the technology stack used by a store. Returns a list of technologies with their categories (e.g. analytics, payments, marketing, hosting).",
    schema: z.object({
      domain: z
        .string()
        .describe("The store domain (e.g. 'gymshark.com')."),
    }),
  },

  get_store_ads: {
    description:
      "Get advertisements detected for a specific store. Returns ad creatives with platform, image URL, landing URL, and date range when the ad was active.",
    schema: z.object({
      domain: z
        .string()
        .describe("The store domain (e.g. 'gymshark.com')."),
    }),
  },

  compare_stores: {
    description:
      "Compare 2 to 10 e-commerce stores side by side. Returns full store profiles for each domain so you can compare traffic, products, platforms, and more.",
    schema: z.object({
      domains: z
        .array(z.string())
        .min(2)
        .max(10)
        .describe(
          "Array of 2-10 store domains to compare (e.g. ['gymshark.com', 'allbirds.com']).",
        ),
    }),
  },

  // ── Products ────────────────────────────────────────────────────────────

  search_products: {
    description:
      "Search the Cart product database across all tracked stores. Filter by keyword, price range, and currency. Returns product titles, prices, images, store domain, and vendor.",
    schema: z.object({
      keyword: z
        .string()
        .optional()
        .describe("Search term to match against product titles (e.g. 'yoga mat', 'phone case')."),
      min_price: z
        .number()
        .nonnegative()
        .optional()
        .describe("Minimum product price filter."),
      max_price: z
        .number()
        .nonnegative()
        .optional()
        .describe("Maximum product price filter."),
      currency: z
        .string()
        .optional()
        .describe("Three-letter currency code for price filters (e.g. 'USD', 'EUR', 'GBP')."),
      sort: z
        .string()
        .optional()
        .describe("Sort field (e.g. 'price', '-price', 'added_at')."),
      ...paginationFields,
    }),
  },

  get_product: {
    description:
      "Get full details for a single product by its Cart product ID. Returns the product title, price, image, vendor, store domain, and timestamps.",
    schema: z.object({
      id: z.string().describe("The Cart product ID."),
    }),
  },

  get_trending: {
    description:
      "Get trending products and rapidly growing stores. Useful for identifying hot products, emerging niches, and fast-rising stores.",
    schema: z.object({
      page: paginationFields.page,
      per_page: paginationFields.per_page,
      category: z
        .string()
        .optional()
        .describe("Optional category filter for trending results."),
    }),
  },

  // ── Ads ─────────────────────────────────────────────────────────────────

  search_ads: {
    description:
      "Search for e-commerce advertisements across platforms. Filter by keyword or store domain. Returns ad creatives with platform, images, landing URLs, and active date ranges.",
    schema: z.object({
      keyword: z
        .string()
        .optional()
        .describe("Search term to match against ad content."),
      platform: z
        .string()
        .optional()
        .describe("Ad platform filter (e.g. 'facebook', 'google')."),
      store_domain: z
        .string()
        .optional()
        .describe("Filter ads by a specific store domain."),
      sort: z
        .string()
        .optional()
        .describe("Sort field for ad results."),
      ...paginationFields,
    }),
  },

  get_ad: {
    description:
      "Get full details for a single advertisement by its Cart ad ID.",
    schema: z.object({
      id: z.string().describe("The Cart ad ID."),
    }),
  },

  // ── Suppliers ───────────────────────────────────────────────────────────

  search_suppliers: {
    description:
      "Search for product suppliers and vendors. Filter by keyword, location, or type. Useful for finding sourcing and manufacturing partners.",
    schema: z.object({
      keyword: z
        .string()
        .optional()
        .describe("Search term for supplier name or product types."),
      location: z
        .string()
        .optional()
        .describe("Filter by supplier location (e.g. 'China', 'USA', 'India')."),
      type: z
        .string()
        .optional()
        .describe("Supplier type filter (e.g. 'manufacturer', 'wholesaler', 'dropshipper')."),
      sort: z
        .string()
        .optional()
        .describe("Sort field for supplier results."),
      ...paginationFields,
    }),
  },

  // ── Niches ──────────────────────────────────────────────────────────────

  get_niche_overview: {
    description:
      "Get a market overview for a niche keyword. Returns the total number of stores and products in the niche, average price, top stores, and trending products. Great for market research and competitive analysis.",
    schema: z.object({
      keyword: z
        .string()
        .describe(
          "The niche keyword to analyze (e.g. 'pet supplies', 'yoga', 'home office').",
        ),
    }),
  },

  // ── Account ─────────────────────────────────────────────────────────────

  get_account: {
    description:
      "Get information about the authenticated Cart API account, including the current plan, email, daily request count, and request limit. Use this to check remaining API quota.",
    schema: z.object({}),
  },
} as const;

export type ToolName = keyof typeof TOOLS;
