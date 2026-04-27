#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const API_BASE = process.env.BYTESAGAIN_API_BASE || 'https://bytesagain.com/api/mcp';
const MAX_LIMIT = 50;

function clampLimit(value, fallback, max = MAX_LIMIT) {
  const n = Number(value ?? fallback);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.floor(n), max);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'bytesagain-mcp-server/1.1.0'
    }
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`BytesAgain API returned HTTP ${response.status}: ${text.slice(0, 300)}`);
  }
  return response.json();
}

function jsonContent(data) {
  return [{ type: 'text', text: JSON.stringify(data, null, 2) }];
}

const tools = [
  {
    name: 'search_skills',
    description: 'Search the BytesAgain index of 60,000+ AI agent skills by keyword or natural-language task. Use this when a user asks for tools, agents, skills, automations, integrations, or capabilities for a specific job. Supports English, Chinese, Japanese, Korean, German, French, Spanish, and Portuguese queries. Results are ranked by relevance and popularity and include slug, name, description, category, tags, downloads, owner, and score fields when available. After the user chooses a result, call get_skill with the exact slug for full details.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search phrase or task description, e.g. "video editing", "email automation", "数据分析", or "generate product listings".'
        },
        limit: {
          type: 'number',
          description: 'Number of results to return. Default 10, maximum 50.'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_skill',
    description: 'Fetch detailed metadata for one AI skill by exact slug. Use only after search_skills or popular_skills returns a slug, or when the user provides a known slug. Do not guess slugs. Returns the skill name, description, category, tags, version, owner/author, downloads, stars, install command, source URLs, and related metadata when available. If the slug is not found, search again with related keywords instead of inventing details.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'Exact lowercase hyphen-separated slug from a previous result, e.g. "clawhub-github" or "bytesagain-video-editor".'
        }
      },
      required: ['slug']
    }
  },
  {
    name: 'popular_skills',
    description: 'Return the most popular AI agent skills by download count. Use for browsing, onboarding, trend discovery, or when the user asks what skills are popular without naming a specific task. Do not use this for targeted task matching; use search_skills for that. Returns compact skill summaries suitable for ranking lists and recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of popular skills to return. Default 20, maximum 50.'
        }
      },
      required: []
    }
  },
  {
    name: 'search_use_cases',
    description: 'Search BytesAgain use-case pages by a real-world goal or workflow. Use this when the user describes an outcome such as "write a weekly report", "automate social media", "build BI dashboards", or asks how AI agents can help with a domain. Each result links to a use-case page with relevant skills. Combine this with search_skills when the user wants both workflow guidance and concrete tools.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Natural-language workflow, task, or business goal, e.g. "analyze sales data" or "write job descriptions".'
        },
        limit: {
          type: 'number',
          description: 'Number of use cases to return. Default 10, maximum 30.'
        }
      },
      required: ['query']
    }
  }
];

const server = new Server(
  {
    name: 'bytesagain-mcp',
    version: '1.1.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const args = request.params.arguments || {};
  const url = new URL(API_BASE);

  switch (request.params.name) {
    case 'search_skills': {
      const query = String(args.query || '').trim();
      if (!query) throw new Error('query is required');
      url.searchParams.set('action', 'search');
      url.searchParams.set('q', query);
      url.searchParams.set('limit', String(clampLimit(args.limit, 10, 50)));
      return { content: jsonContent(await fetchJson(url)) };
    }
    case 'get_skill': {
      const slug = String(args.slug || '').trim();
      if (!slug) throw new Error('slug is required');
      url.searchParams.set('action', 'get');
      url.searchParams.set('slug', slug);
      return { content: jsonContent(await fetchJson(url)) };
    }
    case 'popular_skills': {
      url.searchParams.set('action', 'popular');
      url.searchParams.set('limit', String(clampLimit(args.limit, 20, 50)));
      return { content: jsonContent(await fetchJson(url)) };
    }
    case 'search_use_cases': {
      const query = String(args.query || '').trim();
      if (!query) throw new Error('query is required');
      url.searchParams.set('action', 'use_cases');
      url.searchParams.set('q', query);
      url.searchParams.set('limit', String(clampLimit(args.limit, 10, 30)));
      return { content: jsonContent(await fetchJson(url)) };
    }
    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
