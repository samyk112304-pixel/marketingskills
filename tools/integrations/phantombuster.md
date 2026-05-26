# PhantomBuster

Lead generation automation platform that runs "phantoms" (automations) to extract and enrich data from LinkedIn, Twitter, GitHub, and other platforms.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://api.phantombuster.com/api/v2 |
| MCP | - | Not available |
| CLI | ✓ | [phantombuster.js](../clis/phantombuster.js) |
| SDK | - | Not available |

## Authentication

- **Type**: API Key
- **Header**: `X-Phantombuster-Key: {api_key}`
- **Env**: `PHANTOMBUSTER_API_KEY`
- **Get key**: PhantomBuster Dashboard → Settings → API Keys

## Common Agent Operations

### List All Agents (Phantoms)

```bash
GET https://api.phantombuster.com/api/v2/agents/fetch-all
X-Phantombuster-Key: {api_key}
```

### Get Agent

```bash
GET https://api.phantombuster.com/api/v2/agents/fetch?id={agentId}
X-Phantombuster-Key: {api_key}
```

### Launch Agent

```bash
POST https://api.phantombuster.com/api/v2/agents/launch
X-Phantombuster-Key: {api_key}
Content-Type: application/json

{
  "id": "agent_id",
  "arguments": {
    "sessionCookie": "AQEDARxxxxxxx",
    "spreadsheetUrl": "https://docs.google.com/..."
  }
}
```

### Get Agent Output

```bash
GET https://api.phantombuster.com/api/v2/agents/output?id={agentId}
X-Phantombuster-Key: {api_key}
```

### Abort Agent

```bash
POST https://api.phantombuster.com/api/v2/agents/abort
X-Phantombuster-Key: {api_key}
Content-Type: application/json

{"id": "agent_id"}
```

### List Containers

```bash
GET https://api.phantombuster.com/api/v2/containers/fetch-all
X-Phantombuster-Key: {api_key}
```

## Key Features

- LinkedIn scraping (profile visits, connection exports, message sending)
- Twitter/X follower export and engagement automation
- GitHub repository and user data extraction
- Google Maps and search result scraping
- Email finding from LinkedIn profiles
- Scheduled and triggered execution

## When to Use

- Building lead lists from LinkedIn searches
- Exporting LinkedIn connections for CRM import
- Auto-visiting profiles to trigger profile view notifications
- Scraping public data for prospect research
- Finding business emails from LinkedIn profiles

## Rate Limits

- Execution time limits per phantom vary by plan
- Concurrent executions depend on plan tier
- LinkedIn-related phantoms must respect session limits to avoid bans

## Relevant Skills

- lead-generation
- outbound
- linkedin
- prospecting
