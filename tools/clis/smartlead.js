#!/usr/bin/env node

const API_KEY = process.env.SMARTLEAD_API_KEY
const BASE_URL = 'https://server.smartlead.ai/api/v1'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'SMARTLEAD_API_KEY environment variable required' }))
  process.exit(1)
}

function withKey(params) {
  params.set('api_key', API_KEY)
  return params
}

async function api(method, path, body) {
  // Append api_key to URL
  const sep = path.includes('?') ? '&' : '?'
  const url = `${BASE_URL}${path}${sep}api_key=${encodeURIComponent(API_KEY)}`
  if (args['dry-run']) {
    return { _dry_run: true, method, url: url.replace(API_KEY, '***'), body: body || undefined }
  }
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { status: res.status, body: text }
  }
}

function parseArgs(args) {
  const result = { _: [] }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = args[i + 1]
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
    case 'campaigns':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.limit) params.set('limit', args.limit)
          if (args.offset) params.set('offset', args.offset)
          result = await api('GET', `/campaigns?${params}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/campaigns/${args.id}`)
          break
        }
        case 'create': {
          if (!args.name) { result = { error: '--name required' }; break }
          const body = { name: args.name }
          if (args['from-name']) body.from_name = args['from-name']
          if (args['from-email']) body.from_email = args['from-email']
          result = await api('POST', '/campaigns/create', body)
          break
        }
        case 'stats': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/campaigns/${args.id}/analytics`)
          break
        }
        case 'start': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('POST', `/campaigns/${args.id}/status`, { status: 'START' })
          break
        }
        case 'pause': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('POST', `/campaigns/${args.id}/status`, { status: 'PAUSE' })
          break
        }
        default:
          result = { error: 'Unknown campaigns subcommand. Use: list, get, create, stats, start, pause' }
      }
      break

    case 'leads':
      switch (sub) {
        case 'add': {
          if (!args['campaign-id']) { result = { error: '--campaign-id required' }; break }
          if (!args.email) { result = { error: '--email required' }; break }
          const lead = { email: args.email }
          if (args['first-name']) lead.first_name = args['first-name']
          if (args['last-name']) lead.last_name = args['last-name']
          if (args.company) lead.company_name = args.company
          result = await api('POST', `/campaigns/${args['campaign-id']}/leads`, { lead_list: [lead] })
          break
        }
        case 'list': {
          if (!args['campaign-id']) { result = { error: '--campaign-id required' }; break }
          const params = new URLSearchParams()
          if (args.limit) params.set('limit', args.limit)
          if (args.offset) params.set('offset', args.offset)
          result = await api('GET', `/campaigns/${args['campaign-id']}/leads-export?${params}`)
          break
        }
        default:
          result = { error: 'Unknown leads subcommand. Use: add, list' }
      }
      break

    case 'email-accounts':
      switch (sub) {
        case 'list':
          result = await api('GET', '/email-accounts')
          break
        case 'stats':
          result = await api('GET', '/email-accounts/fetch-all')
          break
        default:
          result = { error: 'Unknown email-accounts subcommand. Use: list, stats' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'campaigns list': 'campaigns list [--limit <n>] [--offset <n>]',
          'campaigns get': 'campaigns get --id <id>',
          'campaigns create': 'campaigns create --name <name> [--from-name <name>] [--from-email <email>]',
          'campaigns stats': 'campaigns stats --id <id>',
          'campaigns start': 'campaigns start --id <id>',
          'campaigns pause': 'campaigns pause --id <id>',
          'leads add': 'leads add --campaign-id <id> --email <email> [--first-name <name>] [--last-name <name>] [--company <name>]',
          'leads list': 'leads list --campaign-id <id> [--limit <n>] [--offset <n>]',
          'email-accounts list': 'email-accounts list',
          'email-accounts stats': 'email-accounts stats',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
