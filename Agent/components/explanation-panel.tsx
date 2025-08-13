"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Sparkles, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

type Props = {
  explanation: string
  loading?: boolean
  onRegenerate?: () => void
  autoHeight?: boolean
  hideRegenerate?: boolean
}

export default function ExplanationPanel({
  explanation,
  loading = false,
  onRegenerate,
  autoHeight = false,
  hideRegenerate = false,
}: Props) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(explanation || "")
      setCopied(true)
      toast({ title: "Copied explanation to clipboard" })
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" })
    }
  }

  const content = (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Loader2 className="size-4 animate-spin" />
            Generating explanation...
          </motion.div>
        ) : explanation ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="prose prose-sm dark:prose-invert max-w-none"
          >
            <div dangerouslySetInnerHTML={{ __html: mdToHtml(explanation) }} className="explanation-content" />
          </motion.div>
        ) : (
          <motion.p
            key="empty"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm text-muted-foreground"
          >
            The explanation will appear here after you select a file or paste code and click "Explain".
          </motion.p>
        )}
      </AnimatePresence>

      {explanation && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          {!hideRegenerate && onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <Sparkles className="size-4 mr-1" />
              Regenerate
            </Button>
          )}
        </div>
      )}
    </div>
  )

  // Auto-growing version: no fixed height and no ScrollArea
  if (autoHeight) {
    return <div className="p-4">{content}</div>
  }

  // Scrollable version: requires parent to provide a fixed height
  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="p-4">{content}</div>
      </ScrollArea>
    </div>
  )
}

// Enhanced markdown to HTML converter with better styling
function mdToHtml(md: string) {
  const html = md
    // Headers with emojis and styling
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-semibold mt-4 mb-2 text-violet-700 dark:text-violet-300">$1</h3>',
    )
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-violet-800 dark:text-violet-200">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-violet-900 dark:text-violet-100">$1</h1>')

    // Lists with better styling
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
    .replace(/\n<li>/gim, '<ul class="list-disc list-inside space-y-1 mb-3"><li>')
    .replace(/<\/li>\n(?!<li>)/gim, "</li></ul>\n")

    // Code blocks with syntax highlighting classes
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre class="bg-muted/50 rounded-lg p-3 my-3 overflow-x-auto"><code class="text-sm font-mono">$2</code></pre>',
    )

    // Inline code with styling
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-muted/60 px-1.5 py-0.5 rounded text-sm font-mono text-violet-700 dark:text-violet-300">$1</code>',
    )

    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')

    // Line breaks
    .replace(/\n/g, "<br/>")

  return html
}
