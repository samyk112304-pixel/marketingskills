#!/usr/bin/env node

const API_KEY = process.env.POSTHOG_API_KEY
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID
const HOST = (process.env.POSTHOG_HOST || 'https://app.posthog.com').replace(/\/$/, '')

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'POSTHOG_API_KEY environment variable required' }))
  process.exit(1)
}

// Management API uses personal API key in Authorization header
async function api(method, path, body) {
  const url = `${HOST}${path}`
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { Authorization: 'Bearer ***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
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

// Capture API uses project API key in the payload body (not personal key in header)
async function capture(event, distinctId, properties) {
  if (!process.env.POSTHOG_PROJECT_API_KEY && !API_KEY) {
    return { error: 'POSTHOG_PROJECT_API_KEY or POSTHOG_API_KEY required for capture' }
  }
  const projectApiKey = process.env.POSTHOG_PROJECT_API_KEY || API_KEY
  const url = `${HOST}/capture/`
  const body = {
    api_key: projectApiKey,
    event,
    distinct_id: distinctId,
    properties: properties || {},
  }
  if (args['dry-run']) {
    return { _dry_run: true, method: 'POST', url, body: { ...body, api_key: '***' } }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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

function projectPath(subpath) {
  const pid = args['project-id'] || PROJECT_ID
  if (!pid) {
    console.error(JSON.stringify({ error: 'POSTHOG_PROJECT_ID env var or --project-id required' }))
    process.exit(1)
  }
  return `/api/projects/${pid}${subpath}`
}

async function main() {
  let result

  switch (cmd) {
    case 'events':
      if (sub !== 'capture') { result = { error: 'Unknown events subcommand. Use: capture' }; break }
      {
        if (!args.event) { result = { error: '--event required' }; break }
        if (!args['distinct-id']) { result = { error: '--distinct-id required' }; break }
        let properties = {}
        if (args.properties) {
          try { properties = JSON.parse(args.properties) } catch (e) { result = { error: `Invalid JSON for --properties: ${e.message}` }; break }
        }
        result = await capture(args.event, args['distinct-id'], properties)
      }
      break

    case 'persons':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.limit) params.set('limit', args.limit)
          if (args.cursor) params.set('cursor', args.cursor)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', projectPath(`/persons/${qs}`))
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', projectPath(`/persons/${args.id}/`))
          break
        }
        default:
          result = { error: 'Unknown persons subcommand. Use: list, get' }
      }
      break

    case 'insights':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.limit) params.set('limit', args.limit)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', projectPath(`/insights/${qs}`))
          break
        }
        case 'query': {
          if (!args.sql) { result = { error: '--sql required (HogQL query)' }; break }
          result = await api('POST', projectPath('/query/'), {
            query: { kind: 'HogQLQuery', query: args.sql },
          })
          break
        }
        default:
          result = { error: 'Unknown insights subcommand. Use: list, query' }
      }
      break

    case 'flags':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.limit) params.set('limit', args.limit)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', projectPath(`/feature_flags/${qs}`))
          break
        }
        case 'get': {
          if (!args.key) { result = { error: '--key required' }; break }
          result = await api('GET', projectPath(`/feature_flags/?search=${encodeURIComponent(args.key)}`))
          break
        }
        default:
          result = { error: 'Unknown flags subcommand. Use: list, get' }
      }
      break

    case 'recordings':
      if (sub !== 'list') { result = { error: 'Unknown recordings subcommand. Use: list' }; break }
      {
        const params = new URLSearchParams()
        if (args.limit) params.set('limit', args.limit)
        if (args['date-from']) params.set('date_from', args['date-from'])
        const qs = params.toString() ? `?${params}` : ''
        result = await api('GET', projectPath(`/session_recordings/${qs}`))
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'events capture': 'events capture --event <name> --distinct-id <id> [--properties <json>]',
          'persons list': 'persons list [--limit <n>] [--cursor <cursor>]',
          'persons get': 'persons get --id <id>',
          'insights list': 'insights list [--limit <n>]',
          'insights query': 'insights query --sql "<hogql>"',
          'flags list': 'flags list [--limit <n>]',
          'flags get': 'flags get --key <flag-key>',
          'recordings list': 'recordings list [--limit <n>] [--date-from <date>]',
          options: '--project-id <id> (override POSTHOG_PROJECT_ID)  --dry-run',
          note: 'For event capture, set POSTHOG_PROJECT_API_KEY (project key) separately from POSTHOG_API_KEY (personal key)',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
