"use client"
import { useMemo } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"

type Props = {
  code: string
  language?: string
  path?: string
}

const extensionToLang: Record<string, string> = {
  ".c": "c",
  ".h": "c",
  ".java": "java",
  ".py": "python",
  ".js": "javascript",
  ".ts": "typescript",
  ".tsx": "tsx",
  ".jsx": "jsx",
  ".json": "json",
  ".md": "markdown",
  ".sh": "bash",
  ".yml": "yaml",
  ".yaml": "yaml",
}

export default function CodeViewer({ code, language, path }: Props) {
  const { resolvedTheme } = useTheme()
  const lang = useMemo(() => {
    if (language) return language
    if (path) {
      const ext = Object.keys(extensionToLang).find((e) => path.endsWith(e))
      if (ext) return extensionToLang[ext]
    }
    return "text"
  }, [language, path])
  return (
    <div className="h-full w-full overflow-auto">
      <SyntaxHighlighter
        language={lang as any}
        style={resolvedTheme === "dark" ? (oneDark as any) : (oneLight as any)}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          minHeight: "100%",
          background: "transparent",
        }}
        codeTagProps={{ style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" } }}
        showLineNumbers
        wrapLines
        wrapLongLines
      >
        {code || ""}
      </SyntaxHighlighter>
    </div>
  )
}
