# BytesAgain MCP Server

[![bytesagain/mcp-server MCP server](https://glama.ai/mcp/servers/bytesagain/mcp-server/badges/score.svg)](https://glama.ai/mcp/servers/bytesagain/mcp-server)

Search 60,000+ AI agent skills directly from any MCP-compatible agent.

## Overview

BytesAgain is a free MCP server for discovering AI agent skills and workflow use cases across ClawHub, LobeHub, Dify, GitHub-indexed skills, and the BytesAgain curated catalog.

This repository contains a real stdio MCP server wrapper. It exposes compact tools to agents and forwards read-only requests to the public BytesAgain API at `https://bytesagain.com/api/mcp`.

## MCP Tools

| Tool | When to use | Returns |
| --- | --- | --- |
| `search_skills` | Find AI skills for a concrete task, keyword, domain, or integration request. Supports English, Chinese, Japanese, Korean, German, French, Spanish, and Portuguese. | Ranked skill summaries with slug, name, description, category, tags, downloads, owner, and relevance fields. |
| `get_skill` | Fetch full details for a specific slug returned by `search_skills` or `popular_skills`. | Detailed skill metadata, install/source links, category, tags, owner, downloads, stars, and related fields when available. |
| `popular_skills` | Browse trending or high-download skills when the user has no specific task in mind. | Top skills ranked by downloads. |
| `search_use_cases` | Search workflow/use-case pages such as “write weekly reports”, “build dashboards”, or “automate ecommerce listings”. | Use-case pages and descriptions that map real-world tasks to relevant skills. |

## Install

### Run with npx

```bash
npx -y --package github:bytesagain/mcp-server bytesagain-mcp
```

### Run from source

```bash
git clone https://github.com/bytesagain/mcp-server.git
cd mcp-server
npm install
npm start
```

### Docker

```bash
docker build -t bytesagain-mcp .
docker run --rm -i bytesagain-mcp
```

## Claude Desktop configuration

```json
{
  "mcpServers": {
    "bytesagain": {
      "command": "npx",
      "args": ["-y", "--package", "github:bytesagain/mcp-server", "bytesagain-mcp"]
    }
  }
}
```

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `BYTESAGAIN_API_BASE` | `https://bytesagain.com/api/mcp` | Optional override for the public BytesAgain API endpoint. |

No API key is required. The server is read-only and does not write to BytesAgain, GitHub, Glama, or third-party services.

## Public endpoints

- Website: <https://bytesagain.com>
- MCP documentation: <https://bytesagain.com/mcp>
- Hosted MCP endpoint: <https://bytesagain.com/api/mcp>
- REST search example: <https://bytesagain.com/api/mcp?action=search&q=video%20editor>

## Development

```bash
npm install
npm test
```

The smoke test starts the MCP server over stdio and verifies that the tool list is exposed correctly.

## License

MIT
