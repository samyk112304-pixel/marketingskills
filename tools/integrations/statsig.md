# Statsig

Experimentation and feature management platform with feature gates, A/B tests, dynamic configs, and Pulse analytics.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Console API at https://statsigapi.net/console/v1 |
| MCP | - | Not available |
| CLI | ✓ | [statsig.js](../clis/statsig.js) |
| SDK | ✓ | JavaScript, Python, Go, Java, Ruby, iOS, Android, .NET |

## Authentication

- **Type**: Console API Key (for management)
- **Header**: `statsig-api-key: {api_key}`
- **Env**: `STATSIG_CONSOLE_API_KEY`
- **Note**: Different from SDK server/client keys. Get from Statsig Console → Project Settings → Keys & Environments
- **Server SDK key**: Used only in SDK initialization, not for REST API

## Common Agent Operations

### List Feature Gates

```bash
GET https://statsigapi.net/console/v1/gates
statsig-api-key: {api_key}
```

### Get Feature Gate

```bash
GET https://statsigapi.net/console/v1/gates/{gateName}
statsig-api-key: {api_key}
```

### Create Feature Gate

```bash
POST https://statsigapi.net/console/v1/gates
statsig-api-key: {api_key}
Content-Type: application/json

{
  "name": "new-checkout-flow",
  "description": "Test new checkout experience",
  "isEnabled": true
}
```

### Enable / Disable Gate

```bash
PATCH https://statsigapi.net/console/v1/gates/{gateName}
statsig-api-key: {api_key}
Content-Type: application/json

{"isEnabled": true}
```

### List Experiments

```bash
GET https://statsigapi.net/console/v1/experiments
statsig-api-key: {api_key}
```

### Get Experiment

```bash
GET https://statsigapi.net/console/v1/experiments/{experimentName}
statsig-api-key: {api_key}
```

### Create Experiment

```bash
POST https://statsigapi.net/console/v1/experiments
statsig-api-key: {api_key}
Content-Type: application/json

{
  "name": "checkout-button-color",
  "description": "Test button color impact on conversion",
  "allocation": 50,
  "groups": [
    {"name": "control", "size": 50},
    {"name": "treatment", "size": 50}
  ]
}
```

### Get Pulse Results (Experiment Results)

```bash
GET https://statsigapi.net/console/v1/experiments/{experimentName}/pulse_results
statsig-api-key: {api_key}
```

### List Dynamic Configs

```bash
GET https://statsigapi.net/console/v1/dynamic_configs
statsig-api-key: {api_key}
```

## JavaScript SDK

```javascript
import Statsig from 'statsig-node';

await Statsig.initialize('server-secret-key');

const user = { userID: 'user123', email: 'user@example.com' };

// Check feature gate
const isEnabled = Statsig.checkGate(user, 'new-checkout-flow');

// Get experiment value
const config = Statsig.getExperiment(user, 'checkout-button-color');
const buttonColor = config.get('color', 'blue');

// Get dynamic config
const dynamicConfig = Statsig.getConfig(user, 'homepage_config');
```

## Key Features

- Feature gates for targeting rules and rollouts
- A/B/n experiments with statistical significance via Pulse
- Dynamic configs for remote configuration
- Layers for mutually exclusive experiments
- Auto-generated metrics and guardrails
- Warehouse-native mode for existing data pipelines

## When to Use

- Feature flag management with experiment coupling
- Product experiments with automatic metric analysis
- Remote configuration without deployments
- Mutual exclusion for overlapping experiments
- Statistical analysis of experiment results (Pulse)

## Rate Limits

- Console API: 1,000 requests/minute
- SDK evaluations are local, no rate limits

## Relevant Skills

- ab-testing
- feature-flags
- analytics
- personalization
