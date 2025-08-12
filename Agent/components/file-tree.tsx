"use client"
import { useState, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type TreeNode = {
  name: string
  path: string
  type: "file" | "dir"
  children?: TreeNode[]
}

type Props = {
  nodes: TreeNode[]
  onSelectFile?: (path: string) => void
  selectedPath?: string
}

const TreeItem = memo(function TreeItem({
  node,
  depth,
  onSelectFile,
  selectedPath,
}: {
  node: TreeNode
  depth: number
  onSelectFile?: (path: string) => void
  selectedPath?: string
}) {
  const [open, setOpen] = useState(depth < 1) // open top-level by default

  const isFile = node.type === "file"
  const isSelected = selectedPath === node.path
  const hasChildren = node.children && node.children.length > 0

  const toggle = () => setOpen((o) => !o)

  return (
    <div>
      <div
        className={cn(
          "group grid grid-cols-[auto_1fr] items-center gap-1 rounded px-1 py-1 cursor-pointer transition-all",
          "hover:bg-violet-500/10",
          isSelected && "bg-violet-500/15 ring-1 ring-violet-500/30",
        )}
        style={{ paddingLeft: depth * 12 }}
        onClick={() => {
          if (isFile) {
            onSelectFile?.(node.path)
          } else {
            toggle()
          }
        }}
        role="treeitem"
        aria-expanded={!isFile ? open : undefined}
        aria-selected={isSelected}
      >
        <div className="flex items-center">
          {!isFile && (
            <>
              {open ? (
                <ChevronDown className="size-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="size-4 text-muted-foreground" />
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 min-w-0">
          {isFile ? (
            <FileText className="size-4 text-blue-600 dark:text-blue-400" />
          ) : open ? (
            <FolderOpen className="size-4 text-violet-600 dark:text-violet-400" />
          ) : (
            <Folder className="size-4 text-violet-600 dark:text-violet-400" />
          )}
          <span className={cn("truncate text-sm", isSelected && "font-medium")}>{node.name}</span>
        </div>
      </div>
      {!isFile && hasChildren && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              role="group"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="border-l border-border/50 ml-[14px]"
            >
              {node.children!.map((child) => (
                <TreeItem
                  key={child.path}
                  node={child}
                  depth={depth + 1}
                  onSelectFile={onSelectFile}
                  selectedPath={selectedPath}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
})

export default function FileTree({ nodes, onSelectFile, selectedPath }: Props) {
  return (
    <div role="tree" aria-label="Repository file tree" className="text-sm">
      {nodes.map((n) => (
        <TreeItem key={n.path} node={n} depth={0} onSelectFile={onSelectFile} selectedPath={selectedPath} />
      ))}
    </div>
  )
}
