# VWO

A/B testing and conversion rate optimization platform with heatmaps, session recordings, and personalization.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://app.vwo.com/api/v2 |
| MCP | - | Not available |
| CLI | ✓ | [vwo.js](../clis/vwo.js) |
| SDK | ✓ | JavaScript, Python, Ruby, PHP, Java, .NET, Go |

## Authentication

- **Type**: API Token
- **Header**: `token: {api_key}`
- **Env**: `VWO_API_KEY`
- **Get key**: VWO Dashboard → Users → Your Profile → API Token

## Common Agent Operations

### List Campaigns

```bash
GET https://app.vwo.com/api/v2/campaigns?status=RUNNING&limit=25
token: {api_key}
```

### Get Campaign

```bash
GET https://app.vwo.com/api/v2/campaigns/{campaignId}
token: {api_key}
```

### Get Campaign Report

```bash
GET https://app.vwo.com/api/v2/campaigns/{campaignId}/report
token: {api_key}
```

### Pause Campaign

```bash
PATCH https://app.vwo.com/api/v2/campaigns/{campaignId}
token: {api_key}
Content-Type: application/json

{"status": "PAUSED"}
```

### Resume Campaign

```bash
PATCH https://app.vwo.com/api/v2/campaigns/{campaignId}
token: {api_key}
Content-Type: application/json

{"status": "RUNNING"}
```

### List Goals

```bash
GET https://app.vwo.com/api/v2/campaigns/{campaignId}/goals
token: {api_key}
```

### Create Goal

```bash
POST https://app.vwo.com/api/v2/campaigns/{campaignId}/goals
token: {api_key}
Content-Type: application/json

{
  "name": "Signup Completed",
  "type": "pageVisit",
  "urls": [{"type": "EXACT", "value": "https://example.com/thank-you"}]
}
```

## JavaScript SDK

```javascript
import vwo from 'vwo-node-sdk';

const vwoClientInstance = vwo.launch({
  settingsFile: '<YOUR_SETTINGS_FILE>'
});

// Get variation
const variationName = vwoClientInstance.getVariationName('CAMPAIGN_KEY', 'USER_ID');

// Track goal
vwoClientInstance.track('CAMPAIGN_KEY', 'USER_ID', 'GOAL_IDENTIFIER');
```

## Key Features

- A/B and multivariate testing
- Split URL testing
- Personalization campaigns
- Heatmaps and session recordings
- Funnel and conversion analysis
- SmartStats for faster significance

## When to Use

- Running A/B tests on landing pages and flows
- Personalizing content for user segments
- Analyzing conversion funnels with heatmaps
- Testing pricing pages and CTAs
- Multivariate testing multiple page elements

## Rate Limits

- 1,000 API requests/hour
- Report data may be delayed up to 1 hour

## Relevant Skills

- ab-testing
- cro
- landing-pages
- personalization
