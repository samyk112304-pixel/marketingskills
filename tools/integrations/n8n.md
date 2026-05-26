# n8n

Self-hosted workflow automation platform with a visual editor for building integrations and automations.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at {base_url}/api/v1 |
| MCP | - | Not available |
| CLI | ✓ | [n8n.js](../clis/n8n.js) |
| SDK | - | Not available |

## Authentication

- **Type**: API Key
- **Header**: `X-N8N-API-KEY: {api_key}`
- **Env**: `N8N_API_KEY`, `N8N_BASE_URL` (default: `http://localhost:5678`)
- **Enable API**: n8n Settings → API → Enable API

## Common Agent Operations

### List Workflows

```bash
GET {base_url}/api/v1/workflows
X-N8N-API-KEY: {api_key}
```

Optional query params: `active=true|false`, `limit=10`

### Get Workflow

```bash
GET {base_url}/api/v1/workflows/{id}
X-N8N-API-KEY: {api_key}
```

### Create Workflow

```bash
POST {base_url}/api/v1/workflows
X-N8N-API-KEY: {api_key}
Content-Type: application/json

{
  "name": "My Workflow",
  "nodes": [],
  "connections": {},
  "settings": {}
}
```

### Activate / Deactivate Workflow

```bash
PATCH {base_url}/api/v1/workflows/{id}
X-N8N-API-KEY: {api_key}
Content-Type: application/json

{"active": true}
```

### Delete Workflow

```bash
DELETE {base_url}/api/v1/workflows/{id}
X-N8N-API-KEY: {api_key}
```

### List Executions

```bash
GET {base_url}/api/v1/executions?workflowId={id}&status=success&limit=20
X-N8N-API-KEY: {api_key}
```

### Get Execution

```bash
GET {base_url}/api/v1/executions/{id}
X-N8N-API-KEY: {api_key}
```

### Trigger Webhook

```bash
POST {base_url}/webhook/{path}
Content-Type: application/json

{"key": "value"}
```

No auth header needed — webhook URL is the secret.

## Key Features

- Visual workflow editor with 400+ integrations
- Trigger workflows via webhooks, schedule, or API
- Execution history with input/output data per node
- Self-hostable (Docker, npm, cloud)
- Workflow versioning and sharing

## When to Use

- Automating marketing data pipelines (CRM sync, lead routing)
- Connecting tools without native integrations
- Scheduling recurring reports or data exports
- Triggering workflows from external events (form submissions, webhooks)

## Rate Limits

- No hard rate limits on self-hosted instances
- Cloud plan limits vary by tier
- Execution concurrency depends on instance resources

## Relevant Skills

- automation
- analytics
- emails
- crm
