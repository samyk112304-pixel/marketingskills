# Common Room

Community-led growth platform that aggregates signals from GitHub, Slack, Discord, LinkedIn, and other channels to identify and act on buyer intent.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://api.commonroom.io/community/v1 |
| MCP | - | Not available |
| CLI | ✓ | [common-room.js](../clis/common-room.js) |
| SDK | - | Not available |

## Authentication

- **Type**: Bearer Token
- **Header**: `Authorization: Bearer {api_key}`
- **Env**: `COMMON_ROOM_API_KEY`
- **Get key**: Common Room Dashboard → Settings → API Keys

## Common Agent Operations

### List Members

```bash
GET https://api.commonroom.io/community/v1/members?limit=50
Authorization: Bearer {api_key}
```

### Get Member

```bash
GET https://api.commonroom.io/community/v1/members/{memberId}
Authorization: Bearer {api_key}
```

### Search Members

```bash
GET https://api.commonroom.io/community/v1/members?search=jane+doe&limit=25
Authorization: Bearer {api_key}
```

### Get Member Activities

```bash
GET https://api.commonroom.io/community/v1/members/{memberId}/activities
Authorization: Bearer {api_key}
```

### List Segments

```bash
GET https://api.commonroom.io/community/v1/segments
Authorization: Bearer {api_key}
```

### List Activities

```bash
GET https://api.commonroom.io/community/v1/activities?limit=100&source=github
Authorization: Bearer {api_key}
```

### List Tags

```bash
GET https://api.commonroom.io/community/v1/tags
Authorization: Bearer {api_key}
```

## Key Features

- Multi-channel signal aggregation (GitHub stars, Slack messages, Discord posts, LinkedIn mentions)
- Buyer intent scoring from community activity
- CRM-like member profiles with activity history
- Segment builder for community cohorts
- Automated workflows triggered by signals
- Integrations with Salesforce, HubSpot, Slack

## When to Use

- Product-led growth (PLG) signal detection
- Identifying community members showing buying intent
- Developer relations community management
- Enriching CRM with community engagement data
- Tracking which companies are active in your community

## Rate Limits

- 60 requests/minute
- Cursor-based pagination for large datasets
- Activities data retained per plan

## Relevant Skills

- community
- plg
- lead-generation
- analytics
