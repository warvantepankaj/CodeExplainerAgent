"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
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
            <div dangerouslySetInnerHTML={{ __html: mdToHtml(explanation) }} />
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
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </Button>
          {!hideRegenerate && onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}>
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

// Minimal markdown to HTML converter (headings, lists, code fences)
function mdToHtml(md: string) {
  const html = md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/\n<li>/gim, "<ul><li>")
    .replace(/<\/li>\n(?!<li>)/gim, "</li></ul>\n")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>")
  return html
}
