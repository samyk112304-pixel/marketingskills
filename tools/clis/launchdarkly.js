#!/usr/bin/env node

const API_KEY = process.env.LAUNCHDARKLY_API_KEY
const DEFAULT_PROJECT = process.env.LAUNCHDARKLY_PROJECT_KEY || 'default'
const DEFAULT_ENV = process.env.LAUNCHDARKLY_ENV || 'production'
const BASE_URL = 'https://app.launchdarkly.com/api/v2'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'LAUNCHDARKLY_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { Authorization: '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': API_KEY,
      'Content-Type': method === 'PATCH' ? 'application/json-patch+json' : 'application/json',
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
  const project = args.project || DEFAULT_PROJECT
  const env = args.env || DEFAULT_ENV

  switch (cmd) {
    case 'flags':
      switch (sub) {
        case 'list': {
          const params = new URLSearchParams({ env })
          if (args.limit) params.set('limit', args.limit)
          result = await api('GET', `/flags/${project}?${params}`)
          break
        }
        case 'get': {
          if (!args.key) { result = { error: '--key required' }; break }
          result = await api('GET', `/flags/${project}/${args.key}`)
          break
        }
        case 'create': {
          if (!args.key) { result = { error: '--key required' }; break }
          if (!args.name) { result = { error: '--name required' }; break }
          const body = {
            name: args.name,
            key: args.key,
            variations: [
              { value: true, name: 'On' },
              { value: false, name: 'Off' },
            ],
            defaults: { onVariation: 0, offVariation: 1 },
          }
          if (args.type === 'multivariate') {
            // Keep as-is, user can customize via API
          }
          result = await api('POST', `/flags/${project}`, body)
          break
        }
        case 'toggle': {
          if (!args.key) { result = { error: '--key required' }; break }
          if (args.on === undefined) { result = { error: '--on <true|false> required' }; break }
          const on = args.on === 'true' || args.on === true
          const patch = [{ op: 'replace', path: `/environments/${env}/on`, value: on }]
          result = await api('PATCH', `/flags/${project}/${args.key}`, patch)
          break
        }
        case 'delete': {
          if (!args.key) { result = { error: '--key required' }; break }
          result = await api('DELETE', `/flags/${project}/${args.key}`)
          break
        }
        default:
          result = { error: 'Unknown flags subcommand. Use: list, get, create, toggle, delete' }
      }
      break

    case 'environments':
      if (sub !== 'list') { result = { error: 'Unknown environments subcommand. Use: list' }; break }
      result = await api('GET', `/projects/${project}/environments`)
      break

    case 'projects':
      if (sub !== 'list') { result = { error: 'Unknown projects subcommand. Use: list' }; break }
      result = await api('GET', '/projects')
      break

    case 'experiments':
      if (sub !== 'list') { result = { error: 'Unknown experiments subcommand. Use: list' }; break }
      {
        if (!args.key) { result = { error: '--key (flag key) required' }; break }
        result = await api('GET', `/flags/${project}/${args.key}/experiments?env=${env}`)
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'flags list': 'flags list [--project <key>] [--env <key>] [--limit <n>]',
          'flags get': 'flags get --key <flag-key> [--project <key>]',
          'flags create': 'flags create --key <key> --name <name> [--type <boolean|multivariate>] [--project <key>]',
          'flags toggle': 'flags toggle --key <key> --on <true|false> [--project <key>] [--env <key>]',
          'flags delete': 'flags delete --key <key> [--project <key>]',
          'environments list': 'environments list [--project <key>]',
          'projects list': 'projects list',
          'experiments list': 'experiments list --key <flag-key> [--project <key>] [--env <key>]',
          options: '--dry-run  --project <key> (override LAUNCHDARKLY_PROJECT_KEY)  --env <key> (override LAUNCHDARKLY_ENV)',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
