import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url")
    const path = req.nextUrl.searchParams.get("path")
    if (!url || !path) return NextResponse.json({ error: "Missing url or path" }, { status: 400 })

    const { owner, repo, branch } = parseGitHubUrl(url)
    const ref = branch || "main"

    // Read optional GitHub token from header or env (no UI changes needed)
    const token = req.headers.get("x-github-token") || process.env.GITHUB_TOKEN || ""
    const ghHeaders: HeadersInit = {
      Accept: "application/vnd.github+json",
      "User-Agent": "v0-code-explainer",
    }
    if (token) ghHeaders.Authorization = `Bearer ${token}`

    // Try GitHub Contents API first
    let content = ""
    let language = "text"

    const apiRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(
        ref,
      )}`,
      { headers: ghHeaders },
    )

    if (apiRes.ok) {
      const data = await apiRes.json()
      if (data && data.encoding === "base64" && data.content) {
        content = Buffer.from(data.content, "base64").toString("utf-8")
      } else if (data && data.download_url) {
        const raw = await fetch(data.download_url, { headers: { "User-Agent": "v0-code-explainer" } })
        if (raw.ok) {
          content = await raw.text()
        } else {
          // Fall back to raw.githubusercontent if direct download_url fails
          const fallbackRaw = await fetch(rawGitUrl(owner, repo, ref, path), {
            headers: { "User-Agent": "v0-code-explainer" },
          })
          if (fallbackRaw.ok) content = await fallbackRaw.text()
        }
      } else {
        // Unexpected shape: fallback to raw
        const fallbackRaw = await fetch(rawGitUrl(owner, repo, ref, path), {
          headers: { "User-Agent": "v0-code-explainer" },
        })
        if (fallbackRaw.ok) content = await fallbackRaw.text()
      }
    } else {
      // Rate-limited or forbidden. Fallback to raw.githubusercontent.com
      const fallbackRaw = await fetch(rawGitUrl(owner, repo, ref, path), {
        headers: { "User-Agent": "v0-code-explainer" },
      })
      if (!fallbackRaw.ok) {
        const body = await safeJson(apiRes)
        const message = body?.message || `Failed to fetch file (${apiRes.status})`
        return NextResponse.json({ error: message }, { status: apiRes.status })
      }
      content = await fallbackRaw.text()
    }

    language = detectLanguageFromPath(path, content)
    return NextResponse.json({ content, language })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
}

function parseGitHubUrl(input: string): { owner: string; repo: string; branch?: string } {
  const u = new URL(input)
  const parts = u.pathname.replace(/^\/+|\/+$/g, "").split("/")
  const owner = parts[0]
  const repo = (parts[1] || "").replace(/\.git$/, "")
  let branch: string | undefined
  const treeIdx = parts.indexOf("tree")
  if (treeIdx >= 0 && parts[treeIdx + 1]) branch = parts[treeIdx + 1]
  return { owner, repo, branch }
}

function rawGitUrl(owner: string, repo: string, ref: string, path: string) {
  // raw.githubusercontent.com expects an unescaped path
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`
}

function detectLanguageFromPath(path: string, content: string): string {
  const lower = path.toLowerCase()
  if (lower.endsWith(".java")) return "java"
  if (lower.endsWith(".py")) return "python"
  if (
    lower.endsWith(".cpp") ||
    lower.endsWith(".cc") ||
    lower.endsWith(".cxx") ||
    lower.endsWith(".hpp") ||
    lower.endsWith(".hh") ||
    lower.endsWith(".hxx")
  ) {
    return "cpp"
  }
  if (lower.endsWith(".c") || lower.endsWith(".h")) return "c"
  if (lower.endsWith(".js")) return "javascript"
  if (lower.endsWith(".ts")) return "typescript"
  if (lower.endsWith(".tsx")) return "tsx"
  if (lower.endsWith(".jsx")) return "jsx"
  if (lower.endsWith(".json")) return "json"
  if (lower.endsWith(".md")) return "markdown"
  // Fallback heuristic
  const lc = content.toLowerCase()
  if (
    /\bstd::/.test(lc) ||
    /#include\s*<iostream>/.test(lc) ||
    /cout\s*<</.test(lc) ||
    /cin\s*>>/.test(lc) ||
    /template\s*</.test(lc)
  ) {
    return "cpp"
  }
  if (/^\s*#include/m.test(content)) return "c"
  if (/^\s*import java\./m.test(content) || /public class /.test(content)) return "java"
  if (/^\s*def\s+\w+\(/m.test(content) || /^\s*class\s+\w+:/m.test(content)) return "python"
  return "text"
}

async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}
