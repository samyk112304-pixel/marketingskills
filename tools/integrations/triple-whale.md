# Triple Whale

DTC ecommerce analytics platform for Shopify stores with attribution, ROAS tracking, and cohort analysis.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://api.triplewhale.com/api/v2 |
| MCP | - | Not available |
| CLI | ✓ | [triple-whale.js](../clis/triple-whale.js) |
| SDK | - | Not available |

## Authentication

- **Type**: API Key
- **Header**: `X-API-KEY: {api_key}` or `Authorization: Bearer {api_key}`
- **Env**: `TRIPLE_WHALE_API_KEY`, `TRIPLE_WHALE_SHOP_URL`
- **Shop URL**: e.g. `mystore.myshopify.com`
- **Get key**: Triple Whale Dashboard → Settings → Integrations → API

## Common Agent Operations

### Get Summary Stats

```bash
GET https://api.triplewhale.com/api/v2/attribution/get-data?shopUrl=mystore.myshopify.com&startDate=2024-01-01&endDate=2024-01-31
X-API-KEY: {api_key}
```

### Get Attribution Data

```bash
POST https://api.triplewhale.com/api/v2/attribution/get-orders
X-API-KEY: {api_key}
Content-Type: application/json

{
  "shopUrl": "mystore.myshopify.com",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "page": 1
}
```

### Get Cohort Data

```bash
GET https://api.triplewhale.com/api/v2/attribution/cohort-data?shopUrl=mystore.myshopify.com&startDate=2024-01-01&endDate=2024-01-31
X-API-KEY: {api_key}
```

### List Channels

```bash
GET https://api.triplewhale.com/api/v2/attribution/channels?shopUrl=mystore.myshopify.com
X-API-KEY: {api_key}
```

### Get ROAS Metrics

```bash
GET https://api.triplewhale.com/api/v2/metrics?shopUrl=mystore.myshopify.com&startDate=2024-01-01&endDate=2024-01-31&metrics=roas,spend,revenue
X-API-KEY: {api_key}
```

## Key Features

- Multi-touch attribution across paid channels
- First-party pixel for accurate tracking post-iOS 14
- ROAS and blended MER (Marketing Efficiency Ratio) dashboards
- Cohort analysis for LTV and retention
- Creative analytics for ad performance
- Shopify-native integration

## When to Use

- Measuring true ROAS across Facebook, Google, TikTok
- Understanding LTV by acquisition channel
- Cohort analysis for customer retention
- Post-iOS 14 attribution challenges
- DTC blended performance reporting

## Rate Limits

- 60 requests/minute per API key
- Date ranges limited to 90 days per request for order-level data
- Cohort data supports up to 12-month windows

## Relevant Skills

- analytics
- ads
- ecommerce
- attribution
