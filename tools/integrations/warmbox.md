# Warmbox

Email warmup service that improves deliverability for cold email accounts by simulating natural email activity.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://api.warmbox.ai/v1 |
| MCP | - | Not available |
| CLI | ✓ | [warmbox.js](../clis/warmbox.js) |
| SDK | - | Not available |

## Authentication

- **Type**: Bearer Token
- **Header**: `Authorization: Bearer {api_key}`
- **Env**: `WARMBOX_API_KEY`
- **Get key**: Warmbox Dashboard → Settings → API Access

## Common Agent Operations

### List Inboxes

```bash
GET https://api.warmbox.ai/v1/inboxes
Authorization: Bearer {api_key}
```

### Get Inbox

```bash
GET https://api.warmbox.ai/v1/inboxes/{inboxId}
Authorization: Bearer {api_key}
```

### Get Inbox Stats

```bash
GET https://api.warmbox.ai/v1/inboxes/{inboxId}/stats
Authorization: Bearer {api_key}
```

### Pause Warmup

```bash
PATCH https://api.warmbox.ai/v1/inboxes/{inboxId}
Authorization: Bearer {api_key}
Content-Type: application/json

{"status": "paused"}
```

### Resume Warmup

```bash
PATCH https://api.warmbox.ai/v1/inboxes/{inboxId}
Authorization: Bearer {api_key}
Content-Type: application/json

{"status": "active"}
```

### Get Deliverability Score

```bash
GET https://api.warmbox.ai/v1/inboxes/{inboxId}/deliverability-score
Authorization: Bearer {api_key}
```

## Key Features

- Automated email warmup with human-like patterns
- Spam rescue (automatically moves warmed emails out of spam)
- Deliverability score tracking over time
- Multiple inbox support per account
- Gradual sending volume ramp-up
- Compatible with Gmail, Outlook, SMTP providers

## When to Use

- Before starting a cold email campaign with a new domain
- Recovering a domain that has been flagged as spam
- Maintaining warmup for active sending accounts
- Monitoring deliverability health of email accounts
- Scaling cold outreach with multiple inboxes

## Rate Limits

- API rate limits not publicly documented
- Warmup emails sent gradually per configured schedule
- Recommended: Do not pause/resume inboxes too frequently

## Relevant Skills

- cold-email
- emails
- deliverability
- outbound
