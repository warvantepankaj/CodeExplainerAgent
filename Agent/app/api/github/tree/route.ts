import { type NextRequest, NextResponse } from "next/server"

type GitTreeItem = {
  path: string
  mode: string
  type: "blob" | "tree"
  sha: string
  url: string
}

type TreeNode = {
  name: string
  path: string
  type: "file" | "dir"
  children?: TreeNode[]
}

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url")
    if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 })

    const { owner, repo, branch } = parseGitHubUrl(url)
    const token = req.headers.get("x-github-token") || process.env.GITHUB_TOKEN || ""
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "User-Agent": "v0-code-explainer",
    }
    if (token) headers.Authorization = `Bearer ${token}`

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
    if (!repoRes.ok) {
      const body = await safeJson(repoRes)
      const message = body?.message || `Repo not found or API error (${repoRes.status})`
      return NextResponse.json({ error: message, status: repoRes.status }, { status: repoRes.status })
    }
    const repoData = await repoRes.json()
    const defaultBranch = branch || repoData.default_branch || "main"

    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`,
      { headers },
    )
    if (!treeRes.ok) {
      const body = await safeJson(treeRes)
      const message = body?.message || `Tree fetch failed (${treeRes.status})`
      return NextResponse.json({ error: message, status: treeRes.status }, { status: treeRes.status })
    }
    const treeData = await treeRes.json()
    const items: GitTreeItem[] = treeData.tree || []
    const nodes = buildTree(items)

    return NextResponse.json({
      owner,
      repo,
      branch: defaultBranch,
      tree: nodes,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
}

function parseGitHubUrl(input: string): { owner: string; repo: string; branch?: string } {
  try {
    const u = new URL(input)
    if (u.hostname !== "github.com") throw new Error("Not a GitHub URL")
    const parts = u.pathname.replace(/^\/+|\/+$/g, "").split("/")
    const owner = parts[0]
    const repo = (parts[1] || "").replace(/\.git$/, "")
    let branch: string | undefined
    const treeIdx = parts.indexOf("tree")
    if (treeIdx >= 0 && parts[treeIdx + 1]) {
      branch = parts[treeIdx + 1]
    }
    if (!owner || !repo) throw new Error("Invalid GitHub repo URL")
    return { owner, repo, branch }
  } catch {
    // fallback for owner/repo input
    const cleaned = input.replace(/^https?:\/\/|git@github\.com:|\.git$/g, "")
    const parts = cleaned.split("/")
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1] }
    throw new Error("Invalid GitHub URL")
  }
}

function buildTree(items: GitTreeItem[]): TreeNode[] {
  const root: Record<string, any> = {}

  for (const item of items) {
    const segments = item.path.split("/")
    let current = root
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      const isLast = i === segments.length - 1
      if (!current[seg]) {
        current[seg] = {
          name: seg,
          path: segments.slice(0, i + 1).join("/"),
          type: isLast ? (item.type === "blob" ? "file" : "dir") : "dir",
          children: {},
        }
      }
      current = current[seg].children
    }
  }

  const toArray = (nodeMap: Record<string, any>): TreeNode[] =>
    Object.values(nodeMap)
      .map((n: any) => ({
        name: n.name,
        path: n.path,
        type: n.type,
        children: n.type === "dir" ? toArray(n.children) : undefined,
      }))
      .sort((a: TreeNode, b: TreeNode) => {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1
        return a.name.localeCompare(b.name)
      })

  return toArray(root)
}

async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}
