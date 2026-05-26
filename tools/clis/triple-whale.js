#!/usr/bin/env node

const API_KEY = process.env.TRIPLE_WHALE_API_KEY
const SHOP_URL = process.env.TRIPLE_WHALE_SHOP_URL
const BASE_URL = 'https://api.triplewhale.com/api/v2'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'TRIPLE_WHALE_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'X-API-KEY': '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'X-API-KEY': API_KEY,
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

function shopUrl() {
  const s = args['shop-url'] || SHOP_URL
  if (!s) {
    console.error(JSON.stringify({ error: 'TRIPLE_WHALE_SHOP_URL env var or --shop-url required' }))
    process.exit(1)
  }
  return s
}

async function main() {
  let result

  switch (cmd) {
    case 'summary': {
      const start = args.start
      const end = args.end
      if (!start || !end) { result = { error: '--start and --end required (YYYY-MM-DD)' }; break }
      const params = new URLSearchParams({ shopUrl: shopUrl(), startDate: start, endDate: end })
      result = await api('GET', `/attribution/get-data?${params}`)
      break
    }

    case 'roas': {
      const start = args.start
      const end = args.end
      if (!start || !end) { result = { error: '--start and --end required (YYYY-MM-DD)' }; break }
      const params = new URLSearchParams({ shopUrl: shopUrl(), startDate: start, endDate: end, metrics: 'roas,spend,revenue' })
      if (args.channel) params.set('channel', args.channel)
      result = await api('GET', `/metrics?${params}`)
      break
    }

    case 'cohorts': {
      const start = args.start
      const end = args.end
      if (!start || !end) { result = { error: '--start and --end required (YYYY-MM-DD)' }; break }
      const params = new URLSearchParams({ shopUrl: shopUrl(), startDate: start, endDate: end })
      result = await api('GET', `/attribution/cohort-data?${params}`)
      break
    }

    case 'channels': {
      const params = new URLSearchParams({ shopUrl: shopUrl() })
      result = await api('GET', `/attribution/channels?${params}`)
      break
    }

    case 'orders': {
      const start = args.start
      const end = args.end
      if (!start || !end) { result = { error: '--start and --end required (YYYY-MM-DD)' }; break }
      const body = { shopUrl: shopUrl(), startDate: start, endDate: end, page: args.page ? Number(args.page) : 1 }
      if (args.limit) body.limit = Number(args.limit)
      result = await api('POST', '/attribution/get-orders', body)
      break
    }

    default:
      result = {
        error: 'Unknown command',
        usage: {
          summary: 'summary --start <YYYY-MM-DD> --end <YYYY-MM-DD> [--shop-url <url>]',
          roas: 'roas --start <YYYY-MM-DD> --end <YYYY-MM-DD> [--channel <channel>] [--shop-url <url>]',
          cohorts: 'cohorts --start <YYYY-MM-DD> --end <YYYY-MM-DD> [--shop-url <url>]',
          channels: 'channels [--shop-url <url>]',
          orders: 'orders --start <YYYY-MM-DD> --end <YYYY-MM-DD> [--limit <n>] [--page <n>] [--shop-url <url>]',
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
