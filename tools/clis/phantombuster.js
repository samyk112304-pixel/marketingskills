#!/usr/bin/env node

const API_KEY = process.env.PHANTOMBUSTER_API_KEY
const BASE_URL = 'https://api.phantombuster.com/api/v2'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'PHANTOMBUSTER_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'X-Phantombuster-Key': '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'X-Phantombuster-Key': API_KEY,
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
    case 'agents':
      switch (sub) {
        case 'list':
          result = await api('GET', '/agents/fetch-all')
          break
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/agents/fetch?id=${encodeURIComponent(args.id)}`)
          break
        }
        case 'launch': {
          if (!args.id) { result = { error: '--id required' }; break }
          const body = { id: args.id }
          if (args.args) {
            try {
              body.arguments = JSON.parse(args.args)
            } catch (e) {
              result = { error: `Invalid JSON for --args: ${e.message}` }; break
            }
          }
          result = await api('POST', '/agents/launch', body)
          break
        }
        case 'output': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/agents/output?id=${encodeURIComponent(args.id)}`)
          break
        }
        case 'abort': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('POST', '/agents/abort', { id: args.id })
          break
        }
        default:
          result = { error: 'Unknown agents subcommand. Use: list, get, launch, output, abort' }
      }
      break

    case 'containers':
      if (sub !== 'list') { result = { error: 'Unknown containers subcommand. Use: list' }; break }
      result = await api('GET', '/containers/fetch-all')
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'agents list': 'agents list',
          'agents get': 'agents get --id <id>',
          'agents launch': 'agents launch --id <id> [--args <json>]',
          'agents output': 'agents output --id <id>',
          'agents abort': 'agents abort --id <id>',
          'containers list': 'containers list',
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
