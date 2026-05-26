#!/usr/bin/env node

const API_KEY = process.env.FULLSTORY_API_KEY
const BASE_URL = 'https://api.fullstory.com'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'FULLSTORY_API_KEY environment variable required' }))
  process.exit(1)
}

// FullStory uses HTTP Basic auth: base64(apiKey + ':')
const AUTH = Buffer.from(`${API_KEY}:`).toString('base64')

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { Authorization: 'Basic ***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Basic ${AUTH}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { status: res.status, body: text }
  }
}

function parseArgs(argv) {
  const result = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        result[key] = next
        i++
      } else {
        result[key] = true
      }
    } else {
      result._.push(arg)
    }
  }
  return result
}

const args = parseArgs(process.argv.slice(2))
const [cmd, sub] = args._

async function main() {
  let result

  switch (cmd) {
    case 'users':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.limit) params.set('limit', args.limit)
          if (args['page-token']) params.set('pageToken', args['page-token'])
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', `/v2/users${qs}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/v2/users/${args.id}`)
          break
        }
        default:
          result = { error: 'Unknown users subcommand. Use: list, get' }
      }
      break

    case 'sessions':
      switch (sub) {
        case 'list': {
          if (!args['user-id']) { result = { error: '--user-id required' }; break }
          const params = new URLSearchParams({ uid: args['user-id'] })
          if (args.limit) params.set('limit', args.limit)
          result = await api('GET', `/v2/sessions?${params}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/v2/sessions/${args.id}`)
          break
        }
        default:
          result = { error: 'Unknown sessions subcommand. Use: list, get' }
      }
      break

    case 'events':
      if (sub !== 'search') { result = { error: 'Unknown events subcommand. Use: search' }; break }
      {
        if (!args['user-id']) { result = { error: '--user-id required' }; break }
        const body = {
          query: {
            filters: [{ field: 'uid', operator: 'equals', value: args['user-id'] }]
          },
          limit: args.limit ? Number(args.limit) : 100,
        }
        if (args['event-type']) {
          body.query.filters.push({ field: 'eventType', operator: 'equals', value: args['event-type'] })
        }
        if (args.start) body.dateRange = { startDate: args.start }
        if (args.end) body.dateRange = { ...(body.dateRange || {}), endDate: args.end }
        result = await api('POST', '/v2/events/search', body)
      }
      break

    case 'segments':
      if (sub !== 'list') { result = { error: 'Unknown segments subcommand. Use: list' }; break }
      result = await api('GET', '/v2/segments')
      break

    case 'exports':
      if (sub !== 'create') { result = { error: 'Unknown exports subcommand. Use: create' }; break }
      {
        if (!args['segment-id']) { result = { error: '--segment-id required' }; break }
        const format = args.format || 'json'
        if (!['json', 'csv'].includes(format)) { result = { error: '--format must be json or csv' }; break }
        const body = { segmentId: args['segment-id'], format }
        if (args.start || args.end) {
          body.dateRange = {}
          if (args.start) body.dateRange.startDate = args.start
          if (args.end) body.dateRange.endDate = args.end
        }
        result = await api('POST', '/v2/exports', body)
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'users list': 'users list [--limit <n>] [--page-token <token>]',
          'users get': 'users get --id <id>',
          'sessions list': 'sessions list --user-id <id> [--limit <n>]',
          'sessions get': 'sessions get --id <id>',
          'events search': 'events search --user-id <id> [--event-type <type>] [--start <date>] [--end <date>] [--limit <n>]',
          'segments list': 'segments list',
          'exports create': 'exports create --segment-id <id> --format <json|csv> [--start <date>] [--end <date>]',
          options: '--dry-run (preview request without sending)',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
