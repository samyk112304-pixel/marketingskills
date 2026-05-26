# FullStory

Digital experience intelligence platform with session replay, heatmaps, and funnel analysis.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://api.fullstory.com/v2 |
| MCP | - | Not available |
| CLI | ✓ | [fullstory.js](../clis/fullstory.js) |
| SDK | ✓ | JavaScript, iOS, Android, Python, React Native |

## Authentication

- **Type**: API Key (Basic auth)
- **Header**: `Authorization: Basic {base64(api_key:)}`
- **Env**: `FULLSTORY_API_KEY`
- **Note**: Encode as `base64(apiKey + ':')` — colon after key, empty password
- **Get key**: FullStory Settings → Integrations → API Keys

## Common Agent Operations

### List Users

```bash
GET https://api.fullstory.com/v2/users?limit=50
Authorization: Basic {base64(api_key:)}
```

### Get User

```bash
GET https://api.fullstory.com/v2/users/{userId}
Authorization: Basic {base64(api_key:)}
```

### List Sessions for User

```bash
GET https://api.fullstory.com/v2/sessions?uid={userId}&limit=10
Authorization: Basic {base64(api_key:)}
```

### Get Session

```bash
GET https://api.fullstory.com/v2/sessions/{sessionId}
Authorization: Basic {base64(api_key:)}
```

### Search Events

```bash
POST https://api.fullstory.com/v2/events/search
Authorization: Basic {base64(api_key:)}
Content-Type: application/json

{
  "query": {
    "filters": [
      {
        "field": "uid",
        "operator": "equals",
        "value": "user_123"
      }
    ]
  },
  "limit": 100
}
```

### List Segments

```bash
GET https://api.fullstory.com/v2/segments
Authorization: Basic {base64(api_key:)}
```

### Create Data Export

```bash
POST https://api.fullstory.com/v2/exports
Authorization: Basic {base64(api_key:)}
Content-Type: application/json

{
  "segmentId": "seg_abc123",
  "format": "json",
  "dateRange": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

## JavaScript SDK

```javascript
// Initialize (in HTML)
window['_fs_debug'] = false;
window['_fs_host'] = 'fullstory.com';
window['_fs_org'] = 'YOUR_ORG_ID';

// Identify user
FS.identify('user_123', {
  displayName: 'Jane Doe',
  email: 'jane@example.com',
  plan_str: 'pro'
});

// Custom events
FS.event('Purchase Completed', {
  order_id_str: 'ORD-001',
  value_real: 49.99
});
```

## Key Features

- Session replay with pixel-perfect rendering
- Heatmaps and click maps
- Rage click and error click detection
- Funnel analysis and conversion tracking
- Segment builder for behavioral cohorts
- Data export for BI tools

## When to Use

- Understanding why users drop off in flows
- Diagnosing UI/UX issues with session replay
- Identifying rage clicks and frustration signals
- Analyzing funnel drop-offs with heatmaps
- Exporting behavioral data for analysis

## Rate Limits

- 100 requests/minute
- Export jobs: up to 10 concurrent exports
- Session data retained per plan (90 days on Standard)

## Relevant Skills

- cro
- analytics
- onboarding
- ab-testing
