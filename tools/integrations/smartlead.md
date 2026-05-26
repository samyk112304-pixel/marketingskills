# Smartlead

Cold email outreach platform with unlimited email warmup, multi-inbox support, and centralized lead management.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://server.smartlead.ai/api/v1 |
| MCP | - | Not available |
| CLI | ✓ | [smartlead.js](../clis/smartlead.js) |
| SDK | - | Not available |

## Authentication

- **Type**: Query parameter
- **Param**: `?api_key={api_key}`
- **Env**: `SMARTLEAD_API_KEY`
- **Get key**: Smartlead Dashboard → Settings → API

## Common Agent Operations

### List Campaigns

```bash
GET https://server.smartlead.ai/api/v1/campaigns?api_key={api_key}&limit=10&offset=0
```

### Get Campaign

```bash
GET https://server.smartlead.ai/api/v1/campaigns/{id}?api_key={api_key}
```

### Create Campaign

```bash
POST https://server.smartlead.ai/api/v1/campaigns/create?api_key={api_key}
Content-Type: application/json

{
  "name": "Campaign Name",
  "client_id": null
}
```

### Get Campaign Analytics

```bash
GET https://server.smartlead.ai/api/v1/campaigns/{id}/analytics?api_key={api_key}
```

### Start / Pause Campaign

```bash
POST https://server.smartlead.ai/api/v1/campaigns/{id}/status?api_key={api_key}
Content-Type: application/json

{"status": "START"}
```

Use `"PAUSE"` to pause.

### Add Leads to Campaign

```bash
POST https://server.smartlead.ai/api/v1/campaigns/{id}/leads?api_key={api_key}
Content-Type: application/json

{
  "lead_list": [
    {
      "email": "prospect@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "company_name": "Acme"
    }
  ]
}
```

### List Campaign Leads

```bash
GET https://server.smartlead.ai/api/v1/campaigns/{id}/leads-export?api_key={api_key}&limit=100&offset=0
```

### List Email Accounts

```bash
GET https://server.smartlead.ai/api/v1/email-accounts?api_key={api_key}
```

### Email Account Stats

```bash
GET https://server.smartlead.ai/api/v1/email-accounts/fetch-all?api_key={api_key}
```

## Key Features

- Unlimited email warmup across inboxes
- Multi-sender campaign rotation
- AI-powered email personalization
- Centralized inbox for reply management
- Deliverability analytics and spam score tracking

## When to Use

- Running cold email outreach campaigns at scale
- Managing warmup for new email accounts
- Multi-inbox sending to improve deliverability
- Tracking open, click, and reply rates for outbound sequences

## Rate Limits

- API rate limits vary by plan
- Recommended: max 100 leads per API call when adding to campaigns
- Use offset/limit for paginating large lead lists

## Relevant Skills

- cold-email
- outbound
- lead-generation
- emails
