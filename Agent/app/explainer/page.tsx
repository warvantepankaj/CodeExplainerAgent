"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { Folder, FileText, Link2, Loader2, Github, Code2, Search, ChevronDown, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import ThemeToggle from "@/components/theme-toggle"
import RepoInput from "@/components/repo-input"
import FileTree, { type TreeNode } from "@/components/file-tree"
import CodeViewer from "@/components/code-viewer"
import ExplanationPanel from "@/components/explanation-panel"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type RepoInfo = {
  owner: string
  repo: string
  branch: string
  url: string
}

export default function ExplainerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [loadingTree, setLoadingTree] = useState(false)
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null)
  const [tree, setTree] = useState<TreeNode[] | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [code, setCode] = useState<string>("")
  const [language, setLanguage] = useState<string>("")
  const [explaining, setExplaining] = useState(false)
  const [explanation, setExplanation] = useState<string>("")
  const [manualCode, setManualCode] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"repo" | "paste">("repo")
  const [expOpenMobile, setExpOpenMobile] = useState(true)
  const [expOpenDesktop, setExpOpenDesktop] = useState(true)

  // Set initial tab based on URL params
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "paste" || tab === "repo") {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (newTab: "repo" | "paste") => {
    setActiveTab(newTab)
    // Update URL without page reload
    const newUrl = `/explainer?tab=${newTab}`
    window.history.replaceState(null, "", newUrl)
  }

  const handleLoadRepo = async (url: string) => {
    setLoadingTree(true)
    setTree(null)
    setSelectedPath(null)
    setCode("")
    setExplanation("")
    try {
      const res = await fetch(`/api/github/tree?url=${encodeURIComponent(url)}`)
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      setRepoInfo({
        owner: data.owner,
        repo: data.repo,
        branch: data.branch,
        url: `https://github.com/${data.owner}/${data.repo}/tree/${data.branch}`,
      })
      setTree(data.tree)
      toast({
        title: "Repository loaded",
        description: `${data.owner}/${data.repo} @ ${data.branch}`,
      })
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error loading repository",
        description: err.message || "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoadingTree(false)
    }
  }

  const handleSelectFile = async (path: string) => {
    if (!repoInfo) return
    setSelectedPath(path)
    setCode("")
    setExplanation("")
    try {
      const res = await fetch(
        `/api/github/file?url=${encodeURIComponent(repoInfo.url)}&path=${encodeURIComponent(path)}`,
      )
      if (!res.ok) throw new Error(`Failed to load file: ${res.status}`)
      const data = await res.json()
      setCode(data.content || "")
      setLanguage(data.language || "")
      void explainCode(data.content || "", data.language || "", path)
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error opening file",
        description: err.message || "Unknown error",
        variant: "destructive",
      })
    }
  }

  const explainCode = async (codeText: string, lang: string, path?: string) => {
    if (!codeText?.trim()) return
    setExplaining(true)
    setExplanation("")
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeText, language: lang, path }),
      })
      if (!res.ok) throw new Error(`Explain failed: ${res.status}`)
      const data = await res.json()
      setExplanation(data.explanation || "")
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error explaining code",
        description: err.message || "Unknown error",
        variant: "destructive",
      })
    } finally {
      setExplaining(false)
    }
  }

  const onExplainManual = () => {
    const lang = detectLanguageFromCode(manualCode)
    setLanguage(lang)
    setSelectedPath(null)
    setCode(manualCode)
    void explainCode(manualCode, lang)
  }

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md bg-gradient-to-br from-violet-600 to-blue-600 shadow-sm" />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold tracking-tight">Code Explainer</span>
                <span className="text-xs text-muted-foreground">GitHub repos • Java • C • C++ • Python</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
              )}
            >
              <Github className="size-4" />
              <span>{"Star on GitHub"}</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <Card className="mb-4 md:mb-6 border-violet-200/40 dark:border-violet-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">
              <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                Start with a GitHub repo or paste code
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="bg-muted/50 w-full">
                <TabsTrigger
                  value="repo"
                  className="flex-1 flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all"
                >
                  <Link2 className="size-4" /> GitHub Repo
                </TabsTrigger>
                <TabsTrigger
                  value="paste"
                  className="flex-1 flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all"
                >
                  <Code2 className="size-4" /> Paste Code
                </TabsTrigger>
              </TabsList>

              <TabsContent value="repo" className="pt-4">
                <RepoInput loading={loadingTree} onSubmit={handleLoadRepo} />
                {repoInfo && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="border-violet-300/40 dark:border-violet-900/40">
                      {repoInfo.owner}/{repoInfo.repo}
                    </Badge>
                    <span className="text-xs">branch</span>
                    <Badge variant="outline" className="border-blue-300/50 dark:border-blue-900/40">
                      {repoInfo.branch}
                    </Badge>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="paste" className="pt-4">
                <div className="flex flex-col gap-3">
                  <div className="rounded-md border bg-muted/30 p-2 ring-1 ring-transparent focus-within:ring-violet-500/40 transition">
                    <textarea
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="Paste Java, C, C++, or Python code here..."
                      className="min-h-40 w-full resize-y bg-transparent outline-none text-sm font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={onExplainManual}
                      disabled={!manualCode.trim()}
                      className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                    >
                      Explain code
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {"Language detected: "}
                      <Badge variant="outline" className="border-violet-300/50 dark:border-violet-900/40">
                        {detectLanguageFromCode(manualCode) || "unknown"}
                      </Badge>
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="text-xs text-muted-foreground text-center mt-2">
              Switch between GitHub repositories and pasted code anytime
            </div>
          </CardContent>
        </Card>

        {/* Mobile: stack panels, Explanation at the bottom */}
        <div className="grid md:hidden gap-3">
          <Card className="border-blue-200/40 dark:border-blue-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Repository files</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingTree ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm p-4">
                  <Loader2 className="size-4 animate-spin" />
                  Loading file tree...
                </div>
              ) : tree ? (
                <div className="h-[50vh] overflow-y-auto border-t">
                  <div className="p-4">
                    <FileTree nodes={tree} onSelectFile={handleSelectFile} selectedPath={selectedPath || undefined} />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-4">Load a repository to browse files.</p>
              )}
            </CardContent>
          </Card>
          <Card className="border-violet-200/40 dark:border-violet-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Code</CardTitle>
            </CardHeader>
            <CardContent>
              {code ? (
                <CodeViewer code={code} language={language} path={selectedPath || undefined} />
              ) : (
                <div className="text-sm text-muted-foreground">Select a file to view its code.</div>
              )}
            </CardContent>
          </Card>
          <Collapsible open={expOpenMobile} onOpenChange={setExpOpenMobile}>
            <Card className="border-blue-200/40 dark:border-blue-900/30">
              <CardHeader className="pb-2 flex items-center justify-between">
                <CardTitle className="text-base">Code Explanation</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ChevronDown
                      className={cn("size-4 transition-transform", expOpenMobile ? "rotate-0" : "-rotate-90")}
                    />
                    {expOpenMobile ? "Collapse" : "Expand"}
                  </Button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <ExplanationPanel
                    explanation={explanation}
                    loading={explaining}
                    onRegenerate={() => explainCode(code, language, selectedPath || undefined)}
                    autoHeight
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        {/* Desktop: two panels side-by-side, explanation as a separate block below */}
        <div className="hidden md:flex md:flex-col gap-4">
          <PanelGroup direction="horizontal" className="rounded-lg border bg-card">
            <Panel defaultSize={28} minSize={20} className="h-[64vh]">
              <div className="h-full flex flex-col">
                <div className="px-3 py-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Folder className="size-4 text-violet-600 dark:text-violet-400" />
                    <span>Repository files</span>
                  </div>
                  {repoInfo && (
                    <a
                      href={repoInfo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      View on GitHub
                    </a>
                  )}
                </div>
                <div className="flex-1 min-h-0">
                  {loadingTree ? (
                    <div className="h-full grid place-items-center text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span className="text-sm">Loading file tree...</span>
                      </div>
                    </div>
                  ) : tree ? (
                    <ScrollArea className="h-full">
                      <div className="p-2 pr-4">
                        <FileTree
                          nodes={tree}
                          onSelectFile={handleSelectFile}
                          selectedPath={selectedPath || undefined}
                        />
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="h-full grid place-items-center text-muted-foreground text-sm p-4 text-center">
                      Load a repository to browse files. Or paste code above to explain without GitHub.
                    </div>
                  )}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="w-1 bg-border relative group">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-violet-500/70 to-blue-500/70 group-hover:from-violet-500 group-hover:to-blue-500 transition-colors" />
            </PanelResizeHandle>
            <Panel defaultSize={72} minSize={40} className="h-[64vh]">
              <div className="h-full flex flex-col">
                <div className="px-3 py-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                    <span>Code</span>
                    {selectedPath && (
                      <Badge
                        variant="secondary"
                        className="ml-2 max-w-[40ch] truncate border-blue-300/50 dark:border-blue-900/40"
                      >
                        {selectedPath}
                      </Badge>
                    )}
                  </div>
                  {code && (
                    <div className="text-xs text-muted-foreground">
                      Language:{" "}
                      <Badge variant="outline" className="border-violet-300/50 dark:border-violet-900/40">
                        {language || "auto"}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  {code ? (
                    <CodeViewer code={code} language={language} path={selectedPath || undefined} />
                  ) : (
                    <div className="h-full grid place-items-center text-muted-foreground text-sm p-4 text-center">
                      Select a file to view its code.
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>

          {/* Explanation block below the two panels */}
          <Collapsible open={expOpenDesktop} onOpenChange={setExpOpenDesktop}>
            <Card className="border-violet-200/40 dark:border-violet-900/30">
              <CardHeader className="pb-2 flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="size-4 text-violet-600 dark:text-violet-400" />
                  Code Explanation
                </CardTitle>
                <div className="flex items-center gap-2">
                  {code && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => explainCode(code, language, selectedPath || undefined)}
                      className="border-violet-300/50 dark:border-violet-900/40"
                    >
                      Regenerate
                    </Button>
                  )}
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <ChevronDown
                        className={cn("size-4 transition-transform", expOpenDesktop ? "rotate-0" : "-rotate-90")}
                      />
                      {expOpenDesktop ? "Collapse" : "Expand"}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <ExplanationPanel
                    explanation={explanation}
                    loading={explaining}
                    onRegenerate={() => explainCode(code, language, selectedPath || undefined)}
                    autoHeight
                    hideRegenerate
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-6 text-xs text-muted-foreground flex items-center justify-between gap-3">
          <span>{"Built with Next.js, shadcn/ui, and GitHub API"}</span>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </main>
  )
}

function detectLanguageFromCode(code: string): string {
  if (!code) return ""
  const cHints = ["#include", "printf(", "scanf(", "malloc(", "int main(", "char *", "->"]
  const cppHints = [
    "#include <iostream",
    "std::",
    "using namespace std",
    "cout <<",
    "cin >>",
    "template<",
    "vector<",
    "map<",
  ]
  const javaHints = ["public class", "System.out.println", "import java.", "public static void main", "@Override"]
  const pyHints = ["def ", "import ", "print(", "self", "class ", "async def", "from "]
  const scores = { c: 0, cpp: 0, java: 0, python: 0 }
  const lower = code.toLowerCase()
  cHints.forEach((h) => (scores.c += lower.includes(h.replace("(", "").toLowerCase()) ? 1 : 0))
  cppHints.forEach((h) => (scores.cpp += lower.includes(h.toLowerCase()) ? 1 : 0))
  javaHints.forEach((h) => (scores.java += lower.includes(h.toLowerCase()) ? 1 : 0))
  pyHints.forEach((h) => (scores.python += lower.includes(h.toLowerCase()) ? 1 : 0))
  const max = Math.max(scores.c, scores.cpp, scores.java, scores.python)
  if (max === 0) return ""
  if (max === scores.cpp) return "cpp"
  if (max === scores.c) return "c"
  if (max === scores.java) return "java"
  return "python"
}
