# @usecart/mcp-server

MCP (Model Context Protocol) server for the [Cart](https://usecart.com) e-commerce intelligence API. This server exposes Cart's full API as tools that AI agents can call directly.

## Available Tools

| Tool | Description |
|------|-------------|
| `search_stores` | Search for e-commerce stores by keyword, platform, language, traffic |
| `get_store` | Get full store details by domain |
| `get_store_products` | List products for a store |
| `get_store_traffic` | Get traffic analytics for a store |
| `get_store_tech` | Get the technology stack for a store |
| `get_store_ads` | Get ads detected for a store |
| `compare_stores` | Compare 2-10 stores side by side |
| `search_products` | Search for products across all tracked stores |
| `get_product` | Get a single product by ID |
| `get_trending` | Get trending products and growing stores |
| `search_ads` | Search for e-commerce advertisements |
| `get_ad` | Get a single ad by ID |
| `search_suppliers` | Search for product suppliers and vendors |
| `get_niche_overview` | Get a market overview for a niche keyword |
| `get_account` | Get API key info and usage stats |

## Prerequisites

- Node.js 18 or later
- A Cart API key (get one at [usecart.com](https://usecart.com))

## Setup

### Claude Desktop

Add this to your Claude Desktop configuration file:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cart": {
      "command": "npx",
      "args": ["@usecart/mcp-server"],
      "env": {
        "CART_API_KEY": "cart_sk_..."
      }
    }
  }
}
```

### VS Code

Add this to your VS Code MCP settings (`.vscode/mcp.json` or user settings):

```json
{
  "mcpServers": {
    "cart": {
      "command": "npx",
      "args": ["@usecart/mcp-server"],
      "env": {
        "CART_API_KEY": "cart_sk_..."
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add cart -- npx @usecart/mcp-server
```

Set the environment variable before running:

```bash
export CART_API_KEY=cart_sk_...
```

### Other MCP Clients

Any MCP-compatible client can use this server. The configuration is always:

- **Command:** `npx`
- **Args:** `["@usecart/mcp-server"]`
- **Environment:** `CART_API_KEY` must be set

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CART_API_KEY` | Yes | Your Cart API key (starts with `cart_sk_`) |
| `CART_API_BASE_URL` | No | Override the API base URL (defaults to `https://api.usecart.com/v1`) |

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
CART_API_KEY=cart_sk_... node dist/index.js
```

## License

MIT
