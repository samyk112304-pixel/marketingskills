#!/usr/bin/env node

const API_KEY = process.env.N8N_API_KEY
const BASE_URL = (process.env.N8N_BASE_URL || 'http://localhost:5678').replace(/\/$/, '')

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'N8N_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'X-N8N-API-KEY': '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'X-N8N-API-KEY': API_KEY,
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

async function webhookPost(url, data) {
  if (args['dry-run']) {
    return { _dry_run: true, method: 'POST', url, body: data || undefined }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
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
    case 'workflows':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args.active !== undefined) params.set('active', args.active)
          if (args.limit) params.set('limit', args.limit)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', `/api/v1/workflows${qs}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/api/v1/workflows/${args.id}`)
          break
        }
        case 'create': {
          if (!args.name) { result = { error: '--name required' }; break }
          let workflow = { name: args.name, nodes: [], connections: {}, settings: {} }
          if (args.file) {
            const fs = await import('fs')
            try {
              workflow = JSON.parse(fs.readFileSync(args.file, 'utf8'))
              workflow.name = args.name || workflow.name
            } catch (e) {
              result = { error: `Failed to read file: ${e.message}` }; break
            }
          }
          result = await api('POST', '/api/v1/workflows', workflow)
          break
        }
        case 'activate': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('PATCH', `/api/v1/workflows/${args.id}`, { active: true })
          break
        }
        case 'deactivate': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('PATCH', `/api/v1/workflows/${args.id}`, { active: false })
          break
        }
        case 'delete': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('DELETE', `/api/v1/workflows/${args.id}`)
          break
        }
        default:
          result = { error: 'Unknown workflows subcommand. Use: list, get, create, activate, deactivate, delete' }
      }
      break

    case 'executions':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams()
          if (args['workflow-id']) params.set('workflowId', args['workflow-id'])
          if (args.status) params.set('status', args.status)
          if (args.limit) params.set('limit', args.limit)
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', `/api/v1/executions${qs}`)
          break
        }
        case 'get': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/api/v1/executions/${args.id}`)
          break
        }
        default:
          result = { error: 'Unknown executions subcommand. Use: list, get' }
      }
      break

    case 'webhook': {
      if (sub !== 'trigger') { result = { error: 'Unknown webhook subcommand. Use: trigger' }; break }
      if (!args.url) { result = { error: '--url required' }; break }
      let data
      if (args.data) {
        try { data = JSON.parse(args.data) } catch (e) { result = { error: `Invalid JSON for --data: ${e.message}` }; break }
      }
      result = await webhookPost(args.url, data)
      break
    }

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'workflows list': 'workflows list [--active true|false] [--limit <n>]',
          'workflows get': 'workflows get --id <id>',
          'workflows create': 'workflows create --name <name> [--file <json-file>]',
          'workflows activate': 'workflows activate --id <id>',
          'workflows deactivate': 'workflows deactivate --id <id>',
          'workflows delete': 'workflows delete --id <id>',
          'executions list': 'executions list [--workflow-id <id>] [--status success|error] [--limit <n>]',
          'executions get': 'executions get --id <id>',
          'webhook trigger': 'webhook trigger --url <url> [--data <json>]',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
