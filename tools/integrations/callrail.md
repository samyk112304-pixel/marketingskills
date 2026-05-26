# CallRail

Call tracking and analytics platform for measuring which marketing channels drive phone calls and form submissions.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://api.callrail.com/v3 |
| MCP | - | Not available |
| CLI | ✓ | [callrail.js](../clis/callrail.js) |
| SDK | - | Not available |

## Authentication

- **Type**: API Token
- **Header**: `Authorization: Token token={api_key}`
- **Env**: `CALLRAIL_API_KEY`, `CALLRAIL_ACCOUNT_ID`
- **Get key**: CallRail Dashboard → Settings → API Access → Create API Key

## Common Agent Operations

### List Accounts

```bash
GET https://api.callrail.com/v3/a.json
Authorization: Token token={api_key}
```

### List Calls

```bash
GET https://api.callrail.com/v3/a/{accountId}/calls.json?start_date=2024-01-01&end_date=2024-01-31&per_page=100
Authorization: Token token={api_key}
```

### Get Call

```bash
GET https://api.callrail.com/v3/a/{accountId}/calls/{callId}.json
Authorization: Token token={api_key}
```

### Search Calls

```bash
GET https://api.callrail.com/v3/a/{accountId}/calls.json?search=john+doe
Authorization: Token token={api_key}
```

### List Form Submissions

```bash
GET https://api.callrail.com/v3/a/{accountId}/form_submissions.json?start_date=2024-01-01&end_date=2024-01-31
Authorization: Token token={api_key}
```

### List Trackers

```bash
GET https://api.callrail.com/v3/a/{accountId}/trackers.json
Authorization: Token token={api_key}
```

### List Companies

```bash
GET https://api.callrail.com/v3/a/{accountId}/companies.json
Authorization: Token token={api_key}
```

## Key Features

- Dynamic Number Insertion (DNI) for source attribution
- Call recording and transcription
- Form submission tracking
- Keyword-level call attribution (Google Ads)
- Multi-touch attribution reporting
- Lead scoring and qualification tagging

## When to Use

- Attributing phone calls to marketing channels
- Tracking offline conversions from paid ads
- Analyzing call quality and outcomes
- Form submission tracking and attribution
- Measuring ROI from SEO and paid campaigns

## Rate Limits

- 100 requests/minute per token
- Pagination: max 250 records per page
- Data retention depends on plan

## Relevant Skills

- analytics
- ads
- attribution
- lead-generation
