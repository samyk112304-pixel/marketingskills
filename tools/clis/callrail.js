#!/usr/bin/env node

const API_KEY = process.env.CALLRAIL_API_KEY
const ACCOUNT_ID = process.env.CALLRAIL_ACCOUNT_ID
const BASE_URL = 'https://api.callrail.com/v3'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'CALLRAIL_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { Authorization: 'Token token=***' }, body: body || undefined }
  }
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Token token=${API_KEY}`,
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

function accountPath(subpath) {
  const aid = args['account-id'] || ACCOUNT_ID
  if (!aid) {
    console.error(JSON.stringify({ error: 'CALLRAIL_ACCOUNT_ID env var or --account-id required' }))
    process.exit(1)
  }
  return `${BASE_URL}/a/${aid}${subpath}`
}

async function main() {
  let result

  switch (cmd) {
    case 'accounts':
      if (sub !== 'list') { result = { error: 'Unknown accounts subcommand. Use: list' }; break }
      result = await api('GET', `${BASE_URL}/a.json`)
      break

    case 'calls':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.start) params.set('start_date', args.start)
          if (args.end) params.set('end_date', args.end)
          if (args.limit) params.set('per_page', args.limit)
          if (args.page) params.set('page', args.page)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', accountPath(`/calls.json${qs}`))
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', accountPath(`/calls/${args.id}.json`))
          break
        }
        case 'search': {
          if (!args.query) { result = { error: '--query required' }; break }
          const params = new URLSearchParams({ search: args.query })
          if (args.limit) params.set('per_page', args.limit)
          result = await api('GET', accountPath(`/calls.json?${params}`))
          break
        }
        default:
          result = { error: 'Unknown calls subcommand. Use: list, get, search' }
      }
      break

    case 'forms':
      if (sub !== 'list') { result = { error: 'Unknown forms subcommand. Use: list' }; break }
      {
        const params = new URLSearchParams()
        if (args.start) params.set('start_date', args.start)
        if (args.end) params.set('end_date', args.end)
        if (args.limit) params.set('per_page', args.limit)
        const qs = params.toString() ? `?${params}` : ''
        result = await api('GET', accountPath(`/form_submissions.json${qs}`))
      }
      break

    case 'trackers':
      if (sub !== 'list') { result = { error: 'Unknown trackers subcommand. Use: list' }; break }
      result = await api('GET', accountPath('/trackers.json'))
      break

    case 'companies':
      if (sub !== 'list') { result = { error: 'Unknown companies subcommand. Use: list' }; break }
      result = await api('GET', accountPath('/companies.json'))
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'accounts list': 'accounts list',
          'calls list': 'calls list [--start <YYYY-MM-DD>] [--end <YYYY-MM-DD>] [--limit <n>] [--page <n>]',
          'calls get': 'calls get --id <id>',
          'calls search': 'calls search --query <q> [--limit <n>]',
          'forms list': 'forms list [--start <YYYY-MM-DD>] [--end <YYYY-MM-DD>] [--limit <n>]',
          'trackers list': 'trackers list',
          'companies list': 'companies list',
          options: '--account-id <id> (override CALLRAIL_ACCOUNT_ID)  --dry-run',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
