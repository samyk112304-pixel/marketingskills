#!/usr/bin/env node

const API_KEY = process.env.VWO_API_KEY
const BASE_URL = 'https://app.vwo.com/api/v2'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'VWO_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { token: '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'token': API_KEY,
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
        case 'report': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/campaigns/${args.id}/report`)
          break
        }
        case 'pause': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('PATCH', `/campaigns/${args.id}`, { status: 'PAUSED' })
          break
        }
        case 'resume': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('PATCH', `/campaigns/${args.id}`, { status: 'RUNNING' })
          break
        }
        default:
          result = { error: 'Unknown campaigns subcommand. Use: list, get, report, pause, resume' }
      }
      break

    case 'goals':
      switch (sub) {
        case 'list': {
          if (!args['campaign-id']) { result = { error: '--campaign-id required' }; break }
          result = await api('GET', `/campaigns/${args['campaign-id']}/goals`)
          break
        }
        case 'create': {
          if (!args['campaign-id']) { result = { error: '--campaign-id required' }; break }
          if (!args.name) { result = { error: '--name required' }; break }
          if (!args.type) { result = { error: '--type required (pageVisit|clickTracking|formSubmit|custom)' }; break }
          const body = { name: args.name, type: args.type }
          if (args.url) body.urls = [{ type: 'EXACT', value: args.url }]
          result = await api('POST', `/campaigns/${args['campaign-id']}/goals`, body)
          break
        }
        default:
          result = { error: 'Unknown goals subcommand. Use: list, create' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'campaigns list': 'campaigns list [--status <RUNNING|PAUSED|FINISHED>] [--limit <n>]',
          'campaigns get': 'campaigns get --id <id>',
          'campaigns report': 'campaigns report --id <id>',
          'campaigns pause': 'campaigns pause --id <id>',
          'campaigns resume': 'campaigns resume --id <id>',
          'goals list': 'goals list --campaign-id <id>',
          'goals create': 'goals create --campaign-id <id> --name <name> --type <pageVisit|clickTracking|formSubmit|custom> [--url <url>]',
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
