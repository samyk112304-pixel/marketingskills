#!/usr/bin/env node

const ACCOUNT_SID = process.env.IMPACT_ACCOUNT_SID
const AUTH_TOKEN = process.env.IMPACT_AUTH_TOKEN
const BASE_URL = 'https://api.impact.com'

if (!ACCOUNT_SID) {
  console.error(JSON.stringify({ error: 'IMPACT_ACCOUNT_SID environment variable required' }))
  process.exit(1)
}
if (!AUTH_TOKEN) {
  console.error(JSON.stringify({ error: 'IMPACT_AUTH_TOKEN environment variable required' }))
  process.exit(1)
}

const AUTH = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')

async function api(method, path, body) {
  const url = `${BASE_URL}${path}`
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { Authorization: 'Basic ***', Accept: 'application/json' }, body: body || undefined }
  }
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Basic ${AUTH}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
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

const SID = ACCOUNT_SID

async function main() {
  let result

  switch (cmd) {
    case 'campaigns':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.limit) params.set('PageSize', args.limit)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', `/Mediapartners/${SID}/Campaigns${qs}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/Mediapartners/${SID}/Campaigns/${args.id}`)
          break
        }
        default:
          result = { error: 'Unknown campaigns subcommand. Use: list, get' }
      }
      break

    case 'conversions':
      if (sub !== 'list') { result = { error: 'Unknown conversions subcommand. Use: list' }; break }
      {
        const params = new URLSearchParams()
        if (args.start) params.set('StartDate', args.start)
        if (args.end) params.set('EndDate', args.end)
        if (args['campaign-id']) params.set('CampaignId', args['campaign-id'])
        if (args.limit) params.set('PageSize', args.limit)
        result = await api('GET', `/Mediapartners/${SID}/Conversions?${params}`)
      }
      break

    case 'clicks':
      if (sub !== 'list') { result = { error: 'Unknown clicks subcommand. Use: list' }; break }
      {
        const params = new URLSearchParams()
        if (args.start) params.set('StartDate', args.start)
        if (args.end) params.set('EndDate', args.end)
        if (args.limit) params.set('PageSize', args.limit)
        result = await api('GET', `/Mediapartners/${SID}/FPClicks?${params}`)
      }
      break

    case 'reports':
      if (sub !== 'performance') { result = { error: 'Unknown reports subcommand. Use: performance' }; break }
      {
        const params = new URLSearchParams()
        if (args.start) params.set('StartDate', args.start)
        if (args.end) params.set('EndDate', args.end)
        result = await api('GET', `/Mediapartners/${SID}/Reports/adv_action_listing?${params}`)
      }
      break

    case 'partners':
      if (sub !== 'list') { result = { error: 'Unknown partners subcommand. Use: list' }; break }
      {
        const params = new URLSearchParams()
        if (args['campaign-id']) params.set('CampaignId', args['campaign-id'])
        const qs = params.toString() ? `?${params}` : ''
        result = await api('GET', `/Mediapartners/${SID}/Mediapartners${qs}`)
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'campaigns list': 'campaigns list [--limit <n>]',
          'campaigns get': 'campaigns get --id <id>',
          'conversions list': 'conversions list [--start <YYYY-MM-DD>] [--end <YYYY-MM-DD>] [--campaign-id <id>] [--limit <n>]',
          'clicks list': 'clicks list [--start <YYYY-MM-DD>] [--end <YYYY-MM-DD>] [--limit <n>]',
          'reports performance': 'reports performance [--start <YYYY-MM-DD>] [--end <YYYY-MM-DD>]',
          'partners list': 'partners list [--campaign-id <id>]',
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
