import { readdir, readFile, mkdir, writeFile, cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, basename, extname } from 'node:path'

const ARCHIVE = join(import.meta.dirname, '..', 'archive')
const TARGET = join(import.meta.dirname, '..', 'src', 'content', 'posts')

// Simple YAML frontmatter parser (no deps needed)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { data: {}, body: content }

  const fm = match[1]
  const body = content.slice(match[0].length).trim()
  const data = {}

  for (const line of fm.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()
    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    // Handle arrays [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean)
    }
    if (value !== undefined && value !== '') {
      data[key] = value
    }
  }

  return { data, body }
}

function slugify(name) {
  return basename(name, extname(name))
    .replace(/\s+/g, '-')
    .replace(/[^\w一-鿿-]/g, '')
    .toLowerCase()
}

function extractSummary(body) {
  // Remove <!--more--> marker, use content before it as summary
  const moreIdx = body.indexOf('<!--more-->')
  if (moreIdx !== -1) {
    return body.slice(0, moreIdx)
      .replace(/^#+\s+.*$/gm, '')  // remove headings
      .replace(/\$\$?[\s\S]*?\$\$?/g, '') // remove math
      .replace(/\n{2,}/g, ' ')
      .trim()
      .slice(0, 160)
  }
  // Fallback: first meaningful paragraph
  const clean = body
    .replace(/^#+\s+.*$/gm, '')
    .replace(/\$\$?[\s\S]*?\$\$?/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
  const firstPara = clean.split('\n\n')[0] || clean.split('\n')[0] || ''
  return firstPara.replace(/\n/g, ' ').trim().slice(0, 160)
}

function guessConcepts(body, title) {
  // Heuristic: extract key terms from headings
  const headings = body.match(/^##?\s+(.+)$/gm) || []
  return [...new Set(headings.map(h =>
    h.replace(/^##?\s+/, '')
      .replace(/[`*_~\[\]()]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
  ))].slice(0, 5)
}

async function migrateFile(fileName, isDir = false) {
  const srcPath = join(ARCHIVE, fileName)

  // Skip non-.md files and the resources dir
  if (!fileName.endsWith('.md') && !isDir) return null
  if (fileName === 'resources') return null

  const slug = slugify(fileName)
  const targetDir = join(TARGET, slug)

  // Read content
  let content
  try {
    content = await readFile(join(ARCHIVE, fileName), 'utf-8')
  } catch {
    return null
  }

  const { data: fm, body } = parseFrontmatter(content)

  // Clean up body: remove <!--more--> but keep content
  let cleanBody = body.replace(/<!--more-->/g, '')
  // Remove [TOC] markers
  cleanBody = cleanBody.replace(/^\[TOC\]\s*$/gim, '')
  // Add empty lines around LaTeX blocks so MDX parses them correctly
  // (MDX handles $ and $$ fine, just keep them)

  const summary = extractSummary(body)
  const concepts = guessConcepts(cleanBody, fm.title || slug)
  const tags = Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : [])

  // Parse date
  let dateStr = fm.date || '2018-01-01'
  // Hugo dates can be like "2017-12-30 17:00:43"
  dateStr = dateStr.split(' ')[0] || dateStr

  const newContent = `---
title: "${fm.title || slug}"
date: ${dateStr}
stage: 1
prerequisites: []
concepts: [${concepts.join(', ')}]
tags: [${JSON.stringify(tags).replace(/"/g, '').replace(/\[|\]/g, '')}]
summary: "${summary.replace(/"/g, '\\"')}"
---

${cleanBody}
`

  // Create directory
  await mkdir(targetDir, { recursive: true })
  await writeFile(join(targetDir, 'index.mdx'), newContent, 'utf-8')

  // Copy assets from associated directory
  const assetDir = join(ARCHIVE, slug)
  if (existsSync(assetDir) && slug !== fileName.replace(/\.md$/, '')) {
    // has a sibling directory
  }

  return { slug, title: fm.title, concepts }
}

async function main() {
  const entries = await readdir(ARCHIVE, { withFileTypes: true })

  // Collect: .md files + directories that have matching .md
  const mdFiles = entries.filter(e => e.isFile() && e.name.endsWith('.md'))
  const dirs = entries.filter(e => e.isDirectory())

  console.log(`Found ${mdFiles.length} .md files, ${dirs.length} directories`)

  const results = []

  for (const file of mdFiles) {
    const result = await migrateFile(file.name)
    if (result) {
      results.push(result)
      console.log(`  ✓ ${file.name} → ${result.slug}/`)
    }
  }

  // Handle the Logic-Conjunctive-Normal-Form special case:
  // - Logic-Conjunctive-Normal-Form.md (article)
  // - Logic-Conjunctive-Normal-Form/ (assets: cnf.jpeg)
  // The article was already migrated above; now copy assets
  for (const dir of dirs) {
    const dirSlug = slugify(dir.name)
    const targetDir = join(TARGET, dirSlug)
    const srcDir = join(ARCHIVE, dir.name)

    if (existsSync(targetDir)) {
      // Copy contents from the old asset dir
      const assets = await readdir(srcDir)
      for (const asset of assets) {
        if (asset.startsWith('.')) continue
        const srcAsset = join(srcDir, asset)
        const dstAsset = join(targetDir, asset)
        try {
          await cp(srcAsset, dstAsset)
          console.log(`  ✓ ${dir.name}/${asset} → ${dirSlug}/${asset}`)
        } catch (err) {
          console.log(`  ⚠ ${dir.name}/${asset}: ${err.message}`)
        }
      }
    }
  }

  console.log(`\nMigrated ${results.length} posts to src/content/posts/`)
}

main().catch(console.error)
