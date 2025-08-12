"use client"
import { type FormEvent, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Link2, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Props = {
  onSubmit: (url: string) => void
  loading?: boolean
}

export default function RepoInput({ onSubmit, loading = false }: Props) {
  const [value, setValue] = useState("")
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("recent-repos")
      if (raw) setRecent(JSON.parse(raw))
    } catch {}
  }, [])

  const saveRecent = (url: string) => {
    try {
      const list = [url, ...recent.filter((u) => u !== url)].slice(0, 5)
      setRecent(list)
      localStorage.setItem("recent-repos", JSON.stringify(list))
    } catch {}
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onSubmit(value.trim())
    saveRecent(value.trim())
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://github.com/owner/repo (optionally /tree/branch)"
            className="pl-8 ring-1 ring-transparent focus-visible:ring-2 focus-visible:ring-violet-500/50"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Load"}
        </Button>
      </form>

      {recent.length > 0 && (
        <>
          <Separator />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <History className="size-3.5" />
            <span>Recent</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {recent.map((url) => (
              <Badge
                key={url}
                variant="secondary"
                className="cursor-pointer border-violet-300/50 dark:border-violet-900/40"
                onClick={() => setValue(url)}
              >
                {url}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
