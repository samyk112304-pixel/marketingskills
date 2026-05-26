# Impact

Partnership automation platform for affiliate, influencer, and partner programs with comprehensive tracking and reporting.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://api.impact.com |
| MCP | - | Not available |
| CLI | ✓ | [impact.js](../clis/impact.js) |
| SDK | - | Not available |

## Authentication

- **Type**: HTTP Basic Auth
- **Credentials**: `AccountSid:AuthToken`
- **Header**: `Authorization: Basic {base64(AccountSid:AuthToken)}`
- **Env**: `IMPACT_ACCOUNT_SID`, `IMPACT_AUTH_TOKEN`
- **Get credentials**: Impact Dashboard → Settings → API → Account SID & Auth Token

## Common Agent Operations

### List Campaigns

```bash
GET https://api.impact.com/Mediapartners/{accountSid}/Campaigns
Authorization: Basic {base64(AccountSid:AuthToken)}
```

### Get Campaign

```bash
GET https://api.impact.com/Mediapartners/{accountSid}/Campaigns/{campaignId}
Authorization: Basic {base64(AccountSid:AuthToken)}
```

### List Conversions

```bash
GET https://api.impact.com/Mediapartners/{accountSid}/Conversions?StartDate=2024-01-01&EndDate=2024-01-31&PageSize=100
Authorization: Basic {base64(AccountSid:AuthToken)}
```

### List Clicks (FP Clicks)

```bash
GET https://api.impact.com/Mediapartners/{accountSid}/FPClicks?StartDate=2024-01-01&EndDate=2024-01-31
Authorization: Basic {base64(AccountSid:AuthToken)}
```

### Get Performance Report

```bash
GET https://api.impact.com/Mediapartners/{accountSid}/Reports/adv_action_listing?StartDate=2024-01-01&EndDate=2024-01-31
Authorization: Basic {base64(AccountSid:AuthToken)}
```

### List Media Partners

```bash
GET https://api.impact.com/Mediapartners/{accountSid}/Mediapartners?CampaignId={campaignId}
Authorization: Basic {base64(AccountSid:AuthToken)}
```

## Key Features

- Affiliate and partner program management
- Multi-touch attribution across partner touchpoints
- Automated commission payments
- Fraud detection and prevention
- Real-time reporting and dashboards
- Custom tracking parameters and deep links

## When to Use

- Managing affiliate or referral programs
- Tracking partner-driven conversions
- Analyzing click and conversion data by partner
- Running influencer campaign tracking
- Automating commission calculations and payouts

## Rate Limits

- 100 requests/minute per account
- Conversion export: up to 10,000 records per request
- Date range: up to 90 days per request

## Relevant Skills

- affiliates
- partnerships
- referrals
- analytics
