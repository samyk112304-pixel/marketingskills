#!/usr/bin/env node

const API_KEY = process.env.MAKE_API_KEY
const TEAM_ID = process.env.MAKE_TEAM_ID
const BASE_URL = (process.env.MAKE_BASE_URL || 'https://us1.make.com/api/v2').replace(/\/$/, '')

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'MAKE_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { Authorization: 'Token ***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Token ${API_KEY}`,
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

function teamParam() {
  const tid = args['team-id'] || TEAM_ID
  if (!tid) return ''
  return `teamId=${tid}`
}

function qs(params) {
  const str = params.toString()
  return str ? `?${str}` : ''
}

async function main() {
  let result

  switch (cmd) {
    case 'scenarios':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          const tid = args['team-id'] || TEAM_ID
          if (tid) params.set('teamId', tid)
          if (args.limit) params.set('limit', args.limit)
          result = await api('GET', `/scenarios${qs(params)}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/scenarios/${args.id}`)
          break
        }
        case 'run': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('POST', `/scenarios/${args.id}/run`, {})
          break
        }
        case 'activate': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('PATCH', `/scenarios/${args.id}`, { isEnabled: true })
          break
        }
        case 'deactivate': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('PATCH', `/scenarios/${args.id}`, { isEnabled: false })
          break
        }
        default:
          result = { error: 'Unknown scenarios subcommand. Use: list, get, run, activate, deactivate' }
      }
      break

    case 'hooks':
      if (sub !== 'list') { result = { error: 'Unknown hooks subcommand. Use: list' }; break }
      {
        const params = new URLSearchParams()
        const tid = args['team-id'] || TEAM_ID
        if (tid) params.set('teamId', tid)
        result = await api('GET', `/hooks${qs(params)}`)
      }
      break

    case 'connections':
      if (sub !== 'list') { result = { error: 'Unknown connections subcommand. Use: list' }; break }
      {
        const params = new URLSearchParams()
        const tid = args['team-id'] || TEAM_ID
        if (tid) params.set('teamId', tid)
        result = await api('GET', `/connections${qs(params)}`)
      }
      break

    case 'executions':
      if (sub !== 'list') { result = { error: 'Unknown executions subcommand. Use: list' }; break }
      {
        if (!args['scenario-id']) { result = { error: '--scenario-id required' }; break }
        const params = new URLSearchParams()
        if (args.limit) params.set('limit', args.limit)
        result = await api('GET', `/scenarios/${args['scenario-id']}/logs${qs(params)}`)
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'scenarios list': 'scenarios list [--limit <n>] [--team-id <id>]',
          'scenarios get': 'scenarios get --id <id>',
          'scenarios run': 'scenarios run --id <id>',
          'scenarios activate': 'scenarios activate --id <id>',
          'scenarios deactivate': 'scenarios deactivate --id <id>',
          'hooks list': 'hooks list [--team-id <id>]',
          'connections list': 'connections list [--team-id <id>]',
          'executions list': 'executions list --scenario-id <id> [--limit <n>]',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
