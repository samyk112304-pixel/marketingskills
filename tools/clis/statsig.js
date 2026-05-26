#!/usr/bin/env node

const API_KEY = process.env.STATSIG_CONSOLE_API_KEY
const BASE_URL = 'https://statsigapi.net/console/v1'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'STATSIG_CONSOLE_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'statsig-api-key': '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'statsig-api-key': API_KEY,
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
    case 'gates':
      switch (sub) {
        case 'list':
          result = await api('GET', '/gates')
          break
        case 'get': {
          if (!args.name) { result = { error: '--name required' }; break }
          result = await api('GET', `/gates/${encodeURIComponent(args.name)}`)
          break
        }
        case 'create': {
          if (!args.name) { result = { error: '--name required' }; break }
          const body = { name: args.name }
          if (args.description) body.description = args.description
          result = await api('POST', '/gates', body)
          break
        }
        case 'enable': {
          if (!args.name) { result = { error: '--name required' }; break }
          result = await api('PATCH', `/gates/${encodeURIComponent(args.name)}`, { isEnabled: true })
          break
        }
        case 'disable': {
          if (!args.name) { result = { error: '--name required' }; break }
          result = await api('PATCH', `/gates/${encodeURIComponent(args.name)}`, { isEnabled: false })
          break
        }
        default:
          result = { error: 'Unknown gates subcommand. Use: list, get, create, enable, disable' }
      }
      break

    case 'experiments':
      switch (sub) {
        case 'list':
          result = await api('GET', '/experiments')
          break
        case 'get': {
          if (!args.name) { result = { error: '--name required' }; break }
          result = await api('GET', `/experiments/${encodeURIComponent(args.name)}`)
          break
        }
        case 'create': {
          if (!args.name) { result = { error: '--name required' }; break }
          const body = { name: args.name }
          if (args.description) body.description = args.description
          if (args.allocation) body.allocation = Number(args.allocation)
          result = await api('POST', '/experiments', body)
          break
        }
        case 'results': {
          if (!args.name) { result = { error: '--name required' }; break }
          result = await api('GET', `/experiments/${encodeURIComponent(args.name)}/pulse_results`)
          break
        }
        default:
          result = { error: 'Unknown experiments subcommand. Use: list, get, create, results' }
      }
      break

    case 'configs':
      if (sub !== 'list') { result = { error: 'Unknown configs subcommand. Use: list' }; break }
      result = await api('GET', '/dynamic_configs')
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'gates list': 'gates list',
          'gates get': 'gates get --name <name>',
          'gates create': 'gates create --name <name> [--description <desc>]',
          'gates enable': 'gates enable --name <name>',
          'gates disable': 'gates disable --name <name>',
          'experiments list': 'experiments list',
          'experiments get': 'experiments get --name <name>',
          'experiments create': 'experiments create --name <name> [--description <desc>] [--allocation <0-100>]',
          'experiments results': 'experiments results --name <name>',
          'configs list': 'configs list',
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
