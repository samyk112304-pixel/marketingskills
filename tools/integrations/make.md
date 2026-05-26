# Make

Make (formerly Integromat) is a visual workflow automation platform for building complex, multi-step integrations with 1,500+ apps.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://{region}.make.com/api/v2 |
| MCP | - | Not available |
| CLI | ✓ | [make.js](../clis/make.js) |
| SDK | - | Not available |

## Authentication

- **Type**: API Key (Token)
- **Header**: `Authorization: Token {api_key}`
- **Env**: `MAKE_API_KEY`, `MAKE_TEAM_ID`, `MAKE_BASE_URL`
- **Base URLs**: `https://us1.make.com/api/v2` (US) or `https://eu1.make.com/api/v2` (EU)
- **Get key**: Make Dashboard → Profile → API access

## Common Agent Operations

### List Scenarios

```bash
GET https://us1.make.com/api/v2/scenarios?teamId={teamId}
Authorization: Token {api_key}
```

### Get Scenario

```bash
GET https://us1.make.com/api/v2/scenarios/{id}
Authorization: Token {api_key}
```

### Run Scenario

```bash
POST https://us1.make.com/api/v2/scenarios/{id}/run
Authorization: Token {api_key}
Content-Type: application/json
```

### Activate / Deactivate Scenario

```bash
PATCH https://us1.make.com/api/v2/scenarios/{id}
Authorization: Token {api_key}
Content-Type: application/json

{"isEnabled": true}
```

### List Webhooks

```bash
GET https://us1.make.com/api/v2/hooks?teamId={teamId}
Authorization: Token {api_key}
```

### List Connections

```bash
GET https://us1.make.com/api/v2/connections?teamId={teamId}
Authorization: Token {api_key}
```

### List Execution Logs

```bash
GET https://us1.make.com/api/v2/scenarios/{id}/logs?limit=20
Authorization: Token {api_key}
```

## Key Features

- Visual drag-and-drop scenario builder
- 1,500+ app integrations
- Advanced routing, filters, and iterators
- Real-time and scheduled execution
- Data stores and custom webhooks
- Error handling and retry logic

## When to Use

- Building multi-step automations between marketing tools
- Syncing data between CRM, email, and analytics platforms
- Processing webhook payloads with conditional logic
- Scheduling complex data transformations

## Rate Limits

- Free: 1,000 operations/month
- Core: 10,000 operations/month
- API requests: 60 per minute per token
- Scenario runs: depend on plan tier

## Relevant Skills

- automation
- crm
- emails
- analytics
