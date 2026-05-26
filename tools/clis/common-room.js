#!/usr/bin/env node

const API_KEY = process.env.COMMON_ROOM_API_KEY
const BASE_URL = 'https://api.commonroom.io/community/v1'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'COMMON_ROOM_API_KEY environment variable required' }))
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
    case 'members':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.limit) params.set('limit', args.limit)
          if (args.cursor) params.set('cursor', args.cursor)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', `/members${qs}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/members/${args.id}`)
          break
        }
        case 'search': {
          if (!args.query) { result = { error: '--query required' }; break }
          const params = new URLSearchParams({ search: args.query })
          if (args.limit) params.set('limit', args.limit)
          result = await api('GET', `/members?${params}`)
          break
        }
        case 'activities': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/members/${args.id}/activities`)
          break
        }
        default:
          result = { error: 'Unknown members subcommand. Use: list, get, search, activities' }
      }
      break

    case 'segments':
      if (sub !== 'list') { result = { error: 'Unknown segments subcommand. Use: list' }; break }
      result = await api('GET', '/segments')
      break

    case 'activities':
      if (sub !== 'list') { result = { error: 'Unknown activities subcommand. Use: list' }; break }
      {
        const params = new URLSearchParams()
        if (args.limit) params.set('limit', args.limit)
        if (args.source) params.set('source', args.source)
        if (args.start) params.set('startDate', args.start)
        const qs = params.toString() ? `?${params}` : ''
        result = await api('GET', `/activities${qs}`)
      }
      break

    case 'tags':
      if (sub !== 'list') { result = { error: 'Unknown tags subcommand. Use: list' }; break }
      result = await api('GET', '/tags')
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'members list': 'members list [--limit <n>] [--cursor <cursor>]',
          'members get': 'members get --id <id>',
          'members search': 'members search --query <q> [--limit <n>]',
          'members activities': 'members activities --id <id>',
          'segments list': 'segments list',
          'activities list': 'activities list [--limit <n>] [--source <github|slack|discord>] [--start <date>]',
          'tags list': 'tags list',
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
