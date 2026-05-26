# LaunchDarkly

Feature flag management and experimentation platform for continuous delivery and controlled rollouts.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://app.launchdarkly.com/api/v2 |
| MCP | - | Not available |
| CLI | ✓ | [launchdarkly.js](../clis/launchdarkly.js) |
| SDK | ✓ | JavaScript, Python, Go, Java, Ruby, PHP, .NET, iOS, Android |

## Authentication

- **Type**: API Key
- **Header**: `Authorization: {api_key}`
- **Env**: `LAUNCHDARKLY_API_KEY`, `LAUNCHDARKLY_PROJECT_KEY` (default: `default`), `LAUNCHDARKLY_ENV` (default: `production`)
- **Get key**: LaunchDarkly → Account Settings → Authorization → Personal tokens

## Common Agent Operations

### List Feature Flags

```bash
GET https://app.launchdarkly.com/api/v2/flags/{projectKey}?env=production&limit=50
Authorization: {api_key}
```

### Get Feature Flag

```bash
GET https://app.launchdarkly.com/api/v2/flags/{projectKey}/{flagKey}
Authorization: {api_key}
```

### Create Feature Flag

```bash
POST https://app.launchdarkly.com/api/v2/flags/{projectKey}
Authorization: {api_key}
Content-Type: application/json

{
  "name": "New Dashboard",
  "key": "new-dashboard",
  "variations": [
    {"value": true, "name": "On"},
    {"value": false, "name": "Off"}
  ],
  "defaults": {"onVariation": 0, "offVariation": 1}
}
```

### Toggle Flag On/Off

```bash
PATCH https://app.launchdarkly.com/api/v2/flags/{projectKey}/{flagKey}
Authorization: {api_key}
Content-Type: application/json

[
  {
    "op": "replace",
    "path": "/environments/production/on",
    "value": true
  }
]
```

### Delete Feature Flag

```bash
DELETE https://app.launchdarkly.com/api/v2/flags/{projectKey}/{flagKey}
Authorization: {api_key}
```

### List Environments

```bash
GET https://app.launchdarkly.com/api/v2/projects/{projectKey}/environments
Authorization: {api_key}
```

### List Projects

```bash
GET https://app.launchdarkly.com/api/v2/projects
Authorization: {api_key}
```

## JavaScript SDK

```javascript
import * as LaunchDarkly from '@launchdarkly/node-server-sdk';

const client = LaunchDarkly.init('sdk-key');
await client.waitForInitialization();

const context = { kind: 'user', key: 'user-123', email: 'user@example.com' };

// Evaluate flag
const flagValue = await client.variation('new-dashboard', context, false);

// Get all flags
const allFlags = await client.allFlagsState(context);
```

## Key Features

- Instant flag toggles without deployments
- Percentage rollouts and user targeting
- Multivariate flags with custom variations
- Experimentation and A/B testing via flags
- Audit log of all flag changes
- Integrations with Slack, Jira, DataDog

## When to Use

- Gradual feature rollouts to reduce risk
- A/B testing new features with user segments
- Kill switches for problematic features
- Beta program management with user targeting
- Separating deployments from releases

## Rate Limits

- 100 API requests/10 seconds per token
- SDK evaluations are local (no rate limits)

## Relevant Skills

- ab-testing
- feature-flags
- release-management
- personalization
