# BytesAgain MCP Server

> Search 60,000+ AI agent skills directly from your agent via MCP.

## Overview

BytesAgain is a free MCP-compatible skill search server that aggregates AI agent skills from ClawHub, LobeHub, Dify, GitHub, and more — all searchable via a single MCP endpoint.

## Endpoints

### MCP SSE (Model Context Protocol)
```
https://bytesagain.com/api/mcp/sse
```

### REST API
```
GET https://bytesagain.com/api/mcp?action=search&q=<query>
```

## Features

- 🔍 **60,000+ skills** indexed from major platforms
- 🌐 **7 languages**: English, Chinese, Japanese, Korean, German, French, Portuguese/Spanish
- ⚡ **MCP SSE** compatible with Claude, Cursor, and any MCP-enabled agent
- 🆓 **Free**, no API key, no auth required
- 📊 Includes downloads, stars, ratings, and source metadata

## Usage

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bytesagain": {
      "url": "https://bytesagain.com/api/mcp/sse",
      "type": "sse"
    }
  }
}
```

### With Cursor

Add to MCP settings:
```
https://bytesagain.com/api/mcp/sse
```

### REST API Example

```bash
curl "https://bytesagain.com/api/mcp?action=search&q=video+editor"
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `search_skills` | Search skills by keyword or natural language query |
| `get_skill` | Get detailed info about a specific skill |
| `list_categories` | List all available skill categories |

## Links

- 🌐 Website: [bytesagain.com](https://bytesagain.com)
- 🔌 MCP Endpoint: [bytesagain.com/mcp](https://bytesagain.com/mcp)
- 📦 Skill Search: [bytesagain.com/skills](https://bytesagain.com/skills)

## License

MIT
