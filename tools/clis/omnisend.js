#!/usr/bin/env node

const API_KEY = process.env.OMNISEND_API_KEY
const BASE_URL = 'https://api.omnisend.com/v3'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'OMNISEND_API_KEY environment variable required' }))
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

async function main() {
  let result

  switch (cmd) {
    case 'contacts':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.limit) params.set('limit', args.limit)
          if (args.page) params.set('page', args.page)
          if (args.email) params.set('email', args.email)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', `/contacts${qs}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/contacts/${args.id}`)
          break
        }
        case 'create': {
          if (!args.email) { result = { error: '--email required' }; break }
          const body = {
            email: args.email,
            status: args.status || 'subscribed',
            statusDate: new Date().toISOString(),
          }
          if (args['first-name']) body.firstName = args['first-name']
          if (args['last-name']) body.lastName = args['last-name']
          result = await api('POST', '/contacts', body)
          break
        }
        case 'update': {
          if (!args.id) { result = { error: '--id required' }; break }
          const body = {}
          if (args['first-name']) body.firstName = args['first-name']
          if (args['last-name']) body.lastName = args['last-name']
          if (args.status) body.status = args.status
          result = await api('PATCH', `/contacts/${args.id}`, body)
          break
        }
        case 'tag': {
          if (!args.id) { result = { error: '--id required' }; break }
          if (!args.tags) { result = { error: '--tags required (comma-separated)' }; break }
          const tags = args.tags.split(',').map(t => t.trim())
          result = await api('PATCH', `/contacts/${args.id}`, { tags })
          break
        }
        default:
          result = { error: 'Unknown contacts subcommand. Use: list, get, create, update, tag' }
      }
      break

    case 'campaigns':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.status) params.set('status', args.status)
          if (args.limit) params.set('limit', args.limit)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', `/campaigns${qs}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/campaigns/${args.id}`)
          break
        }
        default:
          result = { error: 'Unknown campaigns subcommand. Use: list, get' }
      }
      break

    case 'segments':
      if (sub !== 'list') { result = { error: 'Unknown segments subcommand. Use: list' }; break }
      result = await api('GET', '/segments')
      break

    case 'events': {
      if (sub !== 'track') { result = { error: 'Unknown events subcommand. Use: track' }; break }
      if (!args.email) { result = { error: '--email required' }; break }
      if (!args.event) { result = { error: '--event required' }; break }
      const body = { email: args.email, eventName: args.event, eventVersion: '2', fields: [] }
      if (args.data) {
        try {
          const data = JSON.parse(args.data)
          body.fields = Object.entries(data).map(([id, value]) => ({ id, value: String(value) }))
        } catch (e) {
          result = { error: `Invalid JSON for --data: ${e.message}` }; break
        }
      }
      result = await api('POST', '/events', body)
      break
    }

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'contacts list': 'contacts list [--limit <n>] [--page <n>] [--email <email>]',
          'contacts get': 'contacts get --id <id>',
          'contacts create': 'contacts create --email <email> [--first-name <n>] [--last-name <n>] [--status <subscribed|nonSubscribed|unsubscribed>]',
          'contacts update': 'contacts update --id <id> [--first-name <n>] [--last-name <n>] [--status <status>]',
          'contacts tag': 'contacts tag --id <id> --tags <tag1,tag2>',
          'campaigns list': 'campaigns list [--status <draft|sending|sent>] [--limit <n>]',
          'campaigns get': 'campaigns get --id <id>',
          'segments list': 'segments list',
          'events track': 'events track --email <email> --event <name> [--data <json>]',
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
