#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CartClient } from "@usecart/sdk";
import { TOOLS } from "./tools.js";

// ─── Client Initialization ──────────────────────────────────────────────────

const apiKey = process.env.CART_API_KEY;
if (!apiKey) {
  console.error(
    "Error: CART_API_KEY environment variable is required.\n" +
      "Set it in your MCP client configuration or export it in your shell.",
  );
  process.exit(1);
}

const baseUrl = process.env.CART_API_BASE_URL || "https://api.usecart.com/v1";
const client = new CartClient(apiKey, { baseUrl });

// ─── MCP Server Setup ───────────────────────────────────────────────────────

const server = new McpServer({
  name: "Cart",
  version: "0.1.0",
});

// ─── Helper ─────────────────────────────────────────────────────────────────

/**
 * Wrap an SDK call and return a properly formatted MCP tool result.
 * Serializes the API response data as JSON text content.
 */
async function handleToolCall<T>(fn: () => Promise<T>): Promise<{
  content: Array<{ type: "text"; text: string }>;
}> {
  try {
    const result = await fn();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      content: [{ type: "text" as const, text: JSON.stringify({ error: message }, null, 2) }],
    };
  }
}

// ─── Tool Registration ──────────────────────────────────────────────────────

// 1. search_stores
server.tool(
  "search_stores",
  TOOLS.search_stores.description,
  TOOLS.search_stores.schema.shape,
  async (params) => {
    return handleToolCall(() =>
      client.stores.search({
        keyword: params.keyword,
        platform: params.platform,
        language: params.language,
        min_traffic: params.min_traffic,
        sort: params.sort,
        page: params.page,
        per_page: params.per_page,
      }),
    );
  },
);

// 2. get_store
server.tool(
  "get_store",
  TOOLS.get_store.description,
  TOOLS.get_store.schema.shape,
  async (params) => {
    return handleToolCall(() => client.stores.get(params.domain));
  },
);

// 3. get_store_products
server.tool(
  "get_store_products",
  TOOLS.get_store_products.description,
  TOOLS.get_store_products.schema.shape,
  async (params) => {
    return handleToolCall(() =>
      client.stores.getProducts(params.domain, {
        page: params.page,
        per_page: params.per_page,
        sort: params.sort,
      }),
    );
  },
);

// 4. get_store_traffic
server.tool(
  "get_store_traffic",
  TOOLS.get_store_traffic.description,
  TOOLS.get_store_traffic.schema.shape,
  async (params) => {
    return handleToolCall(() => client.stores.getTraffic(params.domain));
  },
);

// 5. get_store_tech
server.tool(
  "get_store_tech",
  TOOLS.get_store_tech.description,
  TOOLS.get_store_tech.schema.shape,
  async (params) => {
    return handleToolCall(() => client.stores.getTech(params.domain));
  },
);

// 6. get_store_ads
server.tool(
  "get_store_ads",
  TOOLS.get_store_ads.description,
  TOOLS.get_store_ads.schema.shape,
  async (params) => {
    return handleToolCall(() => client.stores.getAds(params.domain));
  },
);

// 7. compare_stores
server.tool(
  "compare_stores",
  TOOLS.compare_stores.description,
  TOOLS.compare_stores.schema.shape,
  async (params) => {
    return handleToolCall(() => client.stores.compare(params.domains));
  },
);

// 8. search_products
server.tool(
  "search_products",
  TOOLS.search_products.description,
  TOOLS.search_products.schema.shape,
  async (params) => {
    return handleToolCall(() =>
      client.products.search({
        keyword: params.keyword,
        min_price: params.min_price,
        max_price: params.max_price,
        currency: params.currency,
        sort: params.sort,
        page: params.page,
        per_page: params.per_page,
      }),
    );
  },
);

// 9. get_product
server.tool(
  "get_product",
  TOOLS.get_product.description,
  TOOLS.get_product.schema.shape,
  async (params) => {
    return handleToolCall(() => client.products.get(params.id));
  },
);

// 10. get_trending
server.tool(
  "get_trending",
  TOOLS.get_trending.description,
  TOOLS.get_trending.schema.shape,
  async (params) => {
    return handleToolCall(() =>
      client.trending({
        page: params.page,
        per_page: params.per_page,
        category: params.category,
      }),
    );
  },
);

// 11. search_ads
server.tool(
  "search_ads",
  TOOLS.search_ads.description,
  TOOLS.search_ads.schema.shape,
  async (params) => {
    return handleToolCall(() =>
      client.ads.search({
        keyword: params.keyword,
        platform: params.platform,
        store_domain: params.store_domain,
        sort: params.sort,
        page: params.page,
        per_page: params.per_page,
      }),
    );
  },
);

// 12. get_ad
server.tool(
  "get_ad",
  TOOLS.get_ad.description,
  TOOLS.get_ad.schema.shape,
  async (params) => {
    return handleToolCall(() => client.ads.get(params.id));
  },
);

// 13. search_suppliers
server.tool(
  "search_suppliers",
  TOOLS.search_suppliers.description,
  TOOLS.search_suppliers.schema.shape,
  async (params) => {
    return handleToolCall(() =>
      client.suppliers.search({
        keyword: params.keyword,
        location: params.location,
        type: params.type,
        sort: params.sort,
        page: params.page,
        per_page: params.per_page,
      }),
    );
  },
);

// 14. get_niche_overview
server.tool(
  "get_niche_overview",
  TOOLS.get_niche_overview.description,
  TOOLS.get_niche_overview.schema.shape,
  async (params) => {
    return handleToolCall(() => client.niches.get(params.keyword));
  },
);

// 15. get_account
server.tool(
  "get_account",
  TOOLS.get_account.description,
  TOOLS.get_account.schema.shape,
  async () => {
    return handleToolCall(() => client.account());
  },
);

// ─── Start ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error starting Cart MCP server:", error);
  process.exit(1);
});
