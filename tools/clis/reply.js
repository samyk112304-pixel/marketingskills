#!/usr/bin/env node

const API_KEY = process.env.REPLY_API_KEY
const BASE_URL = 'https://api.reply.io/v1'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'REPLY_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'X-Api-Key': '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'X-Api-Key': API_KEY,
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
          const body = { email: args.email }
          if (args['first-name']) body.firstName = args['first-name']
          if (args['last-name']) body.lastName = args['last-name']
          if (args.company) body.company = args.company
          if (args.title) body.title = args.title
          if (args.phone) body.phone = args.phone
          result = await api('POST', '/contacts', body)
          break
        }
        case 'delete': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('DELETE', `/contacts/${args.id}`)
          break
        }
        default:
          result = { error: 'Unknown contacts subcommand. Use: list, get, create, delete' }
      }
      break

    case 'sequences':
      switch (sub) {
        case 'list':
          result = await api('GET', '/campaigns')
          break
        case 'enroll': {
          if (!args['sequence-id']) { result = { error: '--sequence-id required' }; break }
          if (!args.email) { result = { error: '--email required' }; break }
          result = await api('POST', '/actions/addToSequence', {
            email: args.email,
            sequenceId: Number(args['sequence-id']),
          })
          break
        }
        case 'stats': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/campaigns/${args.id}/analytics`)
          break
        }
        default:
          result = { error: 'Unknown sequences subcommand. Use: list, enroll, stats' }
      }
      break

    case 'email-accounts':
      if (sub !== 'list') { result = { error: 'Unknown email-accounts subcommand. Use: list' }; break }
      result = await api('GET', '/emailAccounts')
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'contacts list': 'contacts list [--limit <n>] [--page <n>]',
          'contacts get': 'contacts get --id <id>',
          'contacts create': 'contacts create --email <email> [--first-name <n>] [--last-name <n>] [--company <n>] [--title <t>] [--phone <p>]',
          'contacts delete': 'contacts delete --id <id>',
          'sequences list': 'sequences list',
          'sequences enroll': 'sequences enroll --sequence-id <id> --email <email>',
          'sequences stats': 'sequences stats --id <id>',
          'email-accounts list': 'email-accounts list',
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
