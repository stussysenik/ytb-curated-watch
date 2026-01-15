"use client"

import { motion } from "framer-motion"
import { FolderOpen, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlaylistPanelProps {
  playlists: string[]
  selected: string
  onSelect: (p: string) => void
  onClose: () => void
}

export function PlaylistPanel({ playlists, selected, onSelect, onClose }: PlaylistPanelProps) {
  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 220, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="hidden lg:block border-r border-border bg-muted/30 overflow-hidden flex-shrink-0"
    >
      <div className="p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Playlists</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-1">
          {playlists.map((p, i) => (
            <motion.button
              key={p}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(p)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all",
                selected === p
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <FolderOpen className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 truncate">{p}</span>
              {selected === p && <ChevronRight className="w-4 h-4" />}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
