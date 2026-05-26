# Reply.io

Sales engagement platform for multichannel outreach via email, LinkedIn, calls, SMS, and WhatsApp with sequence automation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at https://api.reply.io/v1 |
| MCP | - | Not available |
| CLI | ✓ | [reply.js](../clis/reply.js) |
| SDK | - | Not available |

## Authentication

- **Type**: API Key
- **Header**: `X-Api-Key: {api_key}`
- **Env**: `REPLY_API_KEY`
- **Get key**: Reply.io Dashboard → Settings → API Keys

## Common Agent Operations

### List Contacts

```bash
GET https://api.reply.io/v1/contacts?page=1&limit=100
X-Api-Key: {api_key}
```

### Get Contact

```bash
GET https://api.reply.io/v1/contacts/{contactId}
X-Api-Key: {api_key}
```

### Create Contact

```bash
POST https://api.reply.io/v1/contacts
X-Api-Key: {api_key}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "company": "Acme Corp"
}
```

### Delete Contact

```bash
DELETE https://api.reply.io/v1/contacts/{contactId}
X-Api-Key: {api_key}
```

### List Campaigns (Sequences)

```bash
GET https://api.reply.io/v1/campaigns
X-Api-Key: {api_key}
```

### Add Contact to Campaign

```bash
POST https://api.reply.io/v1/actions/addToSequence
X-Api-Key: {api_key}
Content-Type: application/json

{
  "email": "jane@example.com",
  "sequenceId": 12345
}
```

### Get Campaign Analytics

```bash
GET https://api.reply.io/v1/campaigns/{campaignId}/analytics
X-Api-Key: {api_key}
```

### List Email Accounts

```bash
GET https://api.reply.io/v1/emailAccounts
X-Api-Key: {api_key}
```

## Key Features

- Multi-step email sequences with delays and conditions
- LinkedIn automation (connection requests, messages)
- AI-powered email writing and reply detection
- A/B testing for email steps
- Real-time reply detection and auto-pause
- CRM integrations (Salesforce, HubSpot, Pipedrive)

## When to Use

- Running personalized email outreach sequences
- Multi-channel sales engagement (email + LinkedIn + calls)
- Automating follow-up sequences with conditions
- Managing outbound SDR workflows
- Tracking reply rates and sequence performance

## Rate Limits

- 100 API requests/minute
- Contact import: up to 1,000 per batch
- Sequence enrollment: 1 contact per request

## Relevant Skills

- cold-email
- outbound
- sequences
- crm
