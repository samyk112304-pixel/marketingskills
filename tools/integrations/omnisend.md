# Omnisend

Email and SMS marketing platform built for ecommerce with automation workflows and segmentation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://api.omnisend.com/v3 |
| MCP | - | Not available |
| CLI | ✓ | [omnisend.js](../clis/omnisend.js) |
| SDK | - | Not available |

## Authentication

- **Type**: API Key
- **Header**: `X-API-KEY: {api_key}`
- **Env**: `OMNISEND_API_KEY`
- **Get key**: Omnisend Dashboard → Store Settings → Integrations → API

## Common Agent Operations

### List Contacts

```bash
GET https://api.omnisend.com/v3/contacts?limit=100&page=1
X-API-KEY: {api_key}
```

### Get Contact

```bash
GET https://api.omnisend.com/v3/contacts/{contactId}
X-API-KEY: {api_key}
```

### Create Contact

```bash
POST https://api.omnisend.com/v3/contacts
X-API-KEY: {api_key}
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "status": "subscribed",
  "statusDate": "2024-01-01T00:00:00Z"
}
```

### Update Contact

```bash
PATCH https://api.omnisend.com/v3/contacts/{contactId}
X-API-KEY: {api_key}
Content-Type: application/json

{
  "firstName": "Jane",
  "tags": ["vip", "high-ltv"]
}
```

### List Campaigns

```bash
GET https://api.omnisend.com/v3/campaigns?status=sent&limit=20
X-API-KEY: {api_key}
```

### List Segments

```bash
GET https://api.omnisend.com/v3/segments
X-API-KEY: {api_key}
```

### Track Custom Event

```bash
POST https://api.omnisend.com/v3/events
X-API-KEY: {api_key}
Content-Type: application/json

{
  "email": "user@example.com",
  "eventName": "Product Viewed",
  "eventVersion": "2",
  "fields": [
    {"id": "productId", "value": "SKU-123"},
    {"id": "price", "value": "49.99"}
  ]
}
```

## Key Features

- Email, SMS, and push notification campaigns
- Pre-built ecommerce automations (welcome, abandoned cart, win-back)
- Segmentation based on purchase history and behavior
- A/B testing for emails
- Product recommendation blocks in emails
- Omnisend Forms for list building

## When to Use

- Ecommerce email marketing (Shopify, WooCommerce, BigCommerce)
- Abandoned cart and post-purchase automations
- SMS marketing for promotions and shipping updates
- List segmentation by purchase behavior
- Multi-channel campaign management

## Rate Limits

- 400 requests/minute
- 10,000 contacts per import batch
- Rate limit headers: `X-Rate-Limit-Remaining`

## Relevant Skills

- emails
- ecommerce
- automation
- sms-marketing
