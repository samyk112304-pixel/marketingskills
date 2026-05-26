# AGENTS.md

Guidelines for AI agents working in this repository.

## Repository Overview

This repository contains **Agent Skills** for AI agents following the [Agent Skills specification](https://agentskills.io/specification.md). Skills install to `.agents/skills/` (the cross-agent standard). This repo also serves as a **Claude Code plugin marketplace** via `.claude-plugin/marketplace.json`.

- **Name**: Marketing Skills
- **Version**: 2.2.0 (see `VERSIONS.md`)
- **GitHub**: [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)
- **Creator**: Corey Haines
- **License**: MIT

## Repository Structure

```
marketingskills/
├── .claude-plugin/
│   ├── marketplace.json   # Claude Code plugin marketplace manifest (auto-synced)
│   └── plugin.json        # Plugin manifest for Claude Code loader
├── .github/
│   ├── ISSUE_TEMPLATE/    # skill-request.yml + config.yml
│   ├── PULL_REQUEST_TEMPLATE/  # new-skill.md, skill-update.md, documentation.md
│   ├── scripts/
│   │   └── sync-skills.js # Auto-syncs README, marketplace.json, plugin.json on push
│   └── workflows/
│       ├── sync-skills.yml      # Runs sync-skills.js when skills/ changes
│       └── validate-skill.yml   # Validates SKILL.md frontmatter on PR/push
├── skills/                # 42 Agent Skills (source of truth)
│   └── skill-name/
│       ├── SKILL.md       # Required — main instructions (<500 lines)
│       ├── evals/
│       │   └── evals.json # Automated quality evals
│       ├── references/    # Optional — detailed docs loaded on demand
│       ├── scripts/       # Optional — executable code
│       └── assets/        # Optional — templates, data files
├── tools/
│   ├── clis/              # 65 zero-dependency Node.js CLI tools (Node 18+)
│   ├── composio/          # Composio integration layer (quick start + toolkit mapping)
│   ├── integrations/      # API integration guides per tool (~100 guides)
│   └── REGISTRY.md        # Tool index with capabilities
├── AGENTS.md              # This file (CLAUDE.md symlinks here)
├── CLAUDE.md              # Symlink → AGENTS.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── VERSIONS.md            # Per-skill version tracking
├── validate-skills.sh     # Local skill validation script
└── validate-skills-official.sh  # Validation against agentskills.io spec
```

**Gitignored install artifacts** (created by `npx skills add`, never committed):
- `.agents/` — installed skills directory
- `.claude/` — Claude Code symlink target
- `skills-lock.json` — installed skill versions lockfile

## Build / Lint / Test Commands

**Skills** are content-only (no build step). Run local validation:

```bash
# Validate all skills in skills/ against the spec
bash validate-skills.sh

# Validate against the official agentskills.io spec
bash validate-skills-official.sh
```

Manual checks before opening a PR:
- YAML frontmatter is valid
- `name` field matches directory name exactly
- `name` is 1-64 chars, lowercase alphanumeric and hyphens only
- `description` is 1-1024 characters with trigger phrases
- `SKILL.md` is under 500 lines

**CLI tools** (`tools/clis/*.js`) are zero-dependency Node.js scripts (Node 18+). Verify with:

```bash
node --check tools/clis/<name>.js   # Syntax check
node tools/clis/<name>.js           # Show usage (no args = help)
node tools/clis/<name>.js <cmd> --dry-run  # Preview request without sending
```

## CI / GitHub Actions

Two workflows run on pushes and PRs to `main`:

| Workflow | File | Trigger | What it does |
|----------|------|---------|--------------|
| Validate Skill | `validate-skill.yml` | Push/PR on `**/SKILL.md` | Runs `Flash-Brew-Digital/validate-skill@v1` on each changed skill |
| Sync Skills | `sync-skills.yml` | Push on `skills/**` or `marketplace.json` | Runs `sync-skills.js` to keep README table, `marketplace.json`, and `plugin.json` in sync |

The sync step commits automatically as `Coreybot`. Do not manually edit the `<!-- SKILLS:START -->…<!-- SKILLS:END -->` block in `README.md` — it is auto-generated.

## Skills Inventory (42 skills)

### Conversion Optimization
| Skill | What it does |
|-------|-------------|
| `cro` | Pages and forms CRO |
| `signup` | Registration and trial activation flows |
| `onboarding` | Post-signup activation, time-to-value |
| `popups` | Modals, overlays, slide-ins, banners |
| `paywalls` | In-app upgrade moments, upsell modals |

### Content & Copy
| Skill | What it does |
|-------|-------------|
| `copywriting` | Marketing page copy (homepage, landing, pricing) |
| `copy-editing` | Edit and polish existing copy |
| `cold-email` | B2B cold outreach emails and sequences |
| `emails` | Automated email flows and lifecycle sequences |
| `social` | Social media content (LinkedIn, Twitter/X, Instagram, TikTok) |
| `image` | AI image generation, design tools, marketing visuals |
| `video` | AI video production (Sora, Kling, HeyGen, Runway) |
| `sms` | SMS/MMS marketing flows and campaigns |

### SEO & Discovery
| Skill | What it does |
|-------|-------------|
| `seo-audit` | Technical and on-page SEO diagnosis |
| `ai-seo` | AI search optimization (AEO, GEO, LLMO, AI Overviews) |
| `programmatic-seo` | Scaled page generation from templates and data |
| `site-architecture` | Page hierarchy, navigation, URL structure, internal linking |
| `competitors` | Comparison and alternative pages for SEO and sales |
| `schema` | Structured data and schema markup |
| `aso` | App Store and Google Play listing optimization |
| `directory-submissions` | Product Hunt, G2, AI/SaaS/MCP directory submissions |

### Paid & Distribution
| Skill | What it does |
|-------|-------------|
| `ads` | Google, Meta, LinkedIn, TikTok ad campaigns |
| `ad-creative` | Bulk ad creative generation and iteration |

### Measurement & Testing
| Skill | What it does |
|-------|-------------|
| `analytics` | Event tracking setup (GA4, Mixpanel, GTM) |
| `ab-testing` | Experiment design, sample sizing, results analysis |

### Growth & Retention
| Skill | What it does |
|-------|-------------|
| `referrals` | Referral and affiliate programs |
| `free-tools` | Marketing tools and calculators as lead gen |
| `churn-prevention` | Cancel flows, save offers, dunning, payment recovery |
| `community-marketing` | Build and leverage online communities |
| `lead-magnets` | Lead magnet strategy, format selection, conversion |
| `co-marketing` | Partner identification and joint campaigns |

### Strategy & Monetization
| Skill | What it does |
|-------|-------------|
| `marketing-ideas` | 140+ SaaS marketing ideas |
| `marketing-psychology` | Mental models and behavioral science in marketing |
| `launch` | Product launches and announcements |
| `pricing` | Pricing, packaging, and monetization strategy |
| `content-strategy` | Content planning, topic selection, editorial calendar |
| `customer-research` | Customer interviews, surveys, synthesis |

### Sales & GTM
| Skill | What it does |
|-------|-------------|
| `revops` | Lead lifecycle, scoring, routing, pipeline management |
| `sales-enablement` | Sales decks, one-pagers, objection handling, demo scripts |
| `prospecting` | Find and qualify prospect lists (B2B SaaS, SMB, local) |
| `competitor-profiling` | Competitive intelligence research from URLs |

### Foundation
| Skill | What it does |
|-------|-------------|
| `product-marketing` | Create/update `.agents/product-marketing.md` context file |

## Agent Skills Specification

Skills follow the [Agent Skills spec](https://agentskills.io/specification.md).

### Required Frontmatter

```yaml
---
name: skill-name
description: What this skill does and when to use it. Include trigger phrases.
---
```

### Frontmatter Field Constraints

| Field         | Required | Constraints                                                      |
|---------------|----------|------------------------------------------------------------------|
| `name`        | Yes      | 1-64 chars, lowercase `a-z`, numbers, hyphens. Must match dir.   |
| `description` | Yes      | 1-1024 chars. Describe what it does and when to use it.          |
| `license`     | No       | License name (default: MIT)                                      |
| `metadata`    | No       | Key-value pairs (author, version, etc.)                          |

### Name Field Rules

- Lowercase letters, numbers, and hyphens only
- Cannot start or end with hyphen
- No consecutive hyphens (`--`)
- Must match parent directory name exactly

**Valid**: `cro`, `emails`, `ab-testing`
**Invalid**: `Page-CRO`, `-page`, `page--cro`

### Optional Skill Directories

```
skills/skill-name/
├── SKILL.md        # Required - main instructions (<500 lines)
├── evals/
│   └── evals.json  # Test cases for automated quality checks
├── references/     # Optional - detailed docs loaded on demand
├── scripts/        # Optional - executable code
└── assets/         # Optional - templates, data files
```

## Writing Style Guidelines

### Structure

- Keep `SKILL.md` under 500 lines (move details to `references/`)
- Use H2 (`##`) for main sections, H3 (`###`) for subsections
- Use bullet points and numbered lists liberally
- Short paragraphs (2-4 sentences max)

### Tone

- Direct and instructional
- Second person ("You are a conversion rate optimization expert")
- Professional but approachable

### Formatting

- Bold (`**text**`) for key terms
- Code blocks for examples and templates
- Tables for reference data
- No excessive emojis

### Clarity Principles

- Clarity over cleverness
- Specific over vague
- Active voice over passive
- One idea per section

### Description Field Best Practices

The `description` is critical for skill discovery. Include:
1. What the skill does
2. When to use it (trigger phrases)
3. Related skills for scope boundaries

```yaml
description: When the user wants to optimize conversions on any marketing page. Use when the user says "CRO," "conversion rate optimization," "this page isn't converting." For signup flows, see signup.
```

## Product Marketing Context File

All skills check for `.agents/product-marketing.md` (with `.claude/product-marketing.md` and the legacy `.claude/product-marketing-context.md` as fallbacks). This file is the **foundation** every skill reads first to understand the product, audience, and positioning.

Run the `product-marketing` skill to create or update it:

```
/product-marketing
```

The file lives outside the repo at `.agents/product-marketing.md` and is gitignored.

## Claude Code Plugin

This repo also serves as a plugin marketplace. The manifest at `.claude-plugin/marketplace.json` lists all skills for installation via:

```bash
/plugin marketplace add coreyhaines31/marketingskills
/plugin install marketing-skills
```

See [Claude Code plugins documentation](https://code.claude.com/docs/en/plugins.md) for details.

## Installation Methods

```bash
# CLI install — all skills
npx skills add coreyhaines31/marketingskills

# CLI install — specific skills
npx skills add coreyhaines31/marketingskills --skill cro copywriting

# List available skills without installing
npx skills add coreyhaines31/marketingskills --list

# Multi-agent install via SkillKit
npx skillkit install coreyhaines31/marketingskills
```

Skills install to `.agents/skills/` with agent-specific symlinks (e.g., `.claude/skills/` for Claude Code).

## Git Workflow

### Branch Naming

- New skills: `feature/skill-name`
- Improvements: `fix/skill-name-description`
- Documentation: `docs/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add skill-name skill`
- `fix: improve clarity in cro`
- `docs: update README`

### Pull Request Checklist

- [ ] `name` matches directory name exactly
- [ ] `name` follows naming rules (lowercase, hyphens, no `--`)
- [ ] `description` is 1-1024 chars with trigger phrases
- [ ] `SKILL.md` is under 500 lines
- [ ] `evals/evals.json` exists (preferred)
- [ ] `VERSIONS.md` updated with new skill entry
- [ ] No sensitive data or credentials

## Tool Integrations

This repository includes a tools registry for agent-compatible marketing tools.

- **Tool discovery**: Read `tools/REGISTRY.md` to see available tools and their capabilities
- **Integration details**: See `tools/integrations/{tool}.md` for API endpoints, auth, and common operations
- **65 CLI tools**: Zero-dependency Node.js scripts in `tools/clis/` covering analytics, SEO, email, ads, CRM, payments, referrals, and more
- **MCP-enabled tools**: ga4, stripe, mailchimp, google-ads, resend, zapier, zoominfo, clay, supermetrics, coupler, outreach, crossbeam, introw, composio, exa, rankparse, truelist, firecrawl, browserbase, heygen, sequenzy, nitrosend, cogny
- **Composio** (integration layer): Adds MCP access to OAuth-heavy tools without native MCP servers (HubSpot, Salesforce, Meta Ads, LinkedIn Ads, Google Sheets, Slack, Notion, etc.). See `tools/integrations/composio.md`

### Registry Structure

```
tools/
├── REGISTRY.md              # Index of all tools with capabilities
├── clis/                    # 65 zero-dependency Node.js CLI tools
├── composio/
│   ├── README.md            # Quick start guide
│   └── marketing-tools.md   # Full toolkit mapping
└── integrations/            # ~100 detailed integration guides
    ├── ga4.md
    ├── stripe.md
    ├── rewardful.md
    └── ...
```

### When to Use Tools

Skills reference relevant tools for implementation. For example:
- `referrals` skill → rewardful, tolt, dub-co, mention-me guides
- `analytics` skill → ga4, mixpanel, segment guides
- `emails` skill → customer-io, mailchimp, resend, sequenzy, nitrosend guides
- `ads` skill → google-ads, meta-ads, linkedin-ads, tiktok-ads guides
- `prospecting` skill → apollo, clay, zoominfo, hunter, snov, truelist, github, firecrawl, browserbase guides
- `sms` skill → klaviyo, postscript, attentive, twilio, brevo guides

For tools without native MCP servers (HubSpot, Salesforce, Meta Ads, LinkedIn Ads, Google Sheets, Slack, Notion), Composio provides MCP access via a single server. See `tools/integrations/composio.md` for setup and `tools/composio/marketing-tools.md` for the full toolkit mapping.

## Checking for Updates

When using any skill from this repository:

1. **Once per session**, on first skill use, check for updates:
   - Fetch `VERSIONS.md` from GitHub: https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/VERSIONS.md
   - Compare versions against local skill files

2. **Only prompt if meaningful**:
   - 2 or more skills have updates, OR
   - Any skill has a major version bump (e.g., 1.x to 2.x)

3. **Non-blocking notification** at end of response:
   ```
   ---
   Skills update available: X marketing skills have updates.
   Say "update skills" to update automatically, or run `git pull` in your marketingskills folder.
   ```

4. **If user says "update skills"**:
   - Run `git pull` in the marketingskills directory
   - Confirm what was updated

## Skill Categories

See `README.md` for the current list of skills organized by category. When adding new skills, follow the naming patterns of existing skills in that category.

## Claude Code-Specific Enhancements

These patterns are **Claude Code only** and must not be added to `SKILL.md` files directly, as skills are designed to be cross-agent compatible (Codex, Cursor, Windsurf, etc.). Apply them locally in your own project's `.claude/skills/` overrides instead.

### Dynamic content injection with `!`command``

Claude Code supports embedding shell commands in SKILL.md using `` !`command` `` syntax. When the skill is invoked, Claude Code runs the command and injects the output inline — the model sees the result, not the instruction.

**Most useful application: auto-inject the product marketing context file**

Instead of every skill telling the agent "go check if `.agents/product-marketing.md` exists and read it," you can inject it automatically:

```markdown
Product context: !`cat .agents/product-marketing.md 2>/dev/null || echo "No product context file found — ask the user about their product before proceeding."`
```

Place this at the top of a skill's body (after frontmatter) to make context available immediately without any file-reading step.

**Other useful injections:**

```markdown
# Inject today's date for recency-sensitive skills
Today's date: !`date +%Y-%m-%d`

# Inject current git branch (useful for workflow skills)
Current branch: !`git branch --show-current 2>/dev/null`

# Inject recent commits for context
Recent commits: !`git log --oneline -5 2>/dev/null`
```

**Why this is Claude Code-only**: Other agents that load skills will see the literal `` !`command` `` string rather than executing it, which would appear as garbled instructions. Keep cross-agent skill files free of this syntax.
