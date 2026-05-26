#!/usr/bin/env node

const API_KEY = process.env.WARMBOX_API_KEY
const BASE_URL = 'https://api.warmbox.ai/v1'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'WARMBOX_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { Authorization: 'Bearer ***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
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
    case 'inboxes':
      switch (sub) {
        case 'list':
          result = await api('GET', '/inboxes')
          break
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/inboxes/${args.id}`)
          break
        }
        case 'stats': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/inboxes/${args.id}/stats`)
          break
        }
        case 'pause': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('PATCH', `/inboxes/${args.id}`, { status: 'paused' })
          break
        }
        case 'resume': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('PATCH', `/inboxes/${args.id}`, { status: 'active' })
          break
        }
        default:
          result = { error: 'Unknown inboxes subcommand. Use: list, get, stats, pause, resume' }
      }
      break

    case 'deliverability': {
      if (!args.id) { result = { error: '--id required' }; break }
      result = await api('GET', `/inboxes/${args.id}/deliverability-score`)
      break
    }

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'inboxes list': 'inboxes list',
          'inboxes get': 'inboxes get --id <id>',
          'inboxes stats': 'inboxes stats --id <id>',
          'inboxes pause': 'inboxes pause --id <id>',
          'inboxes resume': 'inboxes resume --id <id>',
          deliverability: 'deliverability --id <id>',
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
