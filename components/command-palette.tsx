"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, History, FolderOpen, Star, Grid3X3, LayoutGrid, Rows3, List, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onSearch: (q: string) => void
  setView: (v: "grid" | "masonry" | "rows" | "dense") => void
  setTab: (t: "history" | "playlists" | "starred") => void
}

const COMMANDS = [
  { id: "history", icon: History, label: "Go to History", action: "tab", value: "history" },
  { id: "playlists", icon: FolderOpen, label: "Go to Playlists", action: "tab", value: "playlists" },
  { id: "starred", icon: Star, label: "Go to Starred", action: "tab", value: "starred" },
  { id: "grid", icon: Grid3X3, label: "Grid View", action: "view", value: "grid", shortcut: "1" },
  { id: "masonry", icon: LayoutGrid, label: "Masonry View", action: "view", value: "masonry", shortcut: "2" },
  { id: "rows", icon: Rows3, label: "Rows View", action: "view", value: "rows", shortcut: "3" },
  { id: "dense", icon: List, label: "Dense List", action: "view", value: "dense", shortcut: "4" },
]

export function CommandPalette({ open, onClose, onSearch, setView, setTab }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setQuery("")
      setSelected(0)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelected((s) => (s + 1) % filtered.length)
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelected((s) => (s - 1 + filtered.length) % filtered.length)
      }
      if (e.key === "Enter" && filtered[selected]) {
        e.preventDefault()
        executeCommand(filtered[selected])
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, filtered, selected])

  const executeCommand = (cmd: (typeof COMMANDS)[0]) => {
    if (cmd.action === "tab") setTab(cmd.value as "history" | "playlists" | "starred")
    if (cmd.action === "view") setView(cmd.value as "grid" | "masonry" | "rows" | "dense")
    onClose()
  }

  const handleSearchSubmit = () => {
    if (query && filtered.length === 0) {
      onSearch(query)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg bg-background rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelected(0)
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
              />
              <kbd className="px-2 py-1 bg-muted rounded text-[10px] text-muted-foreground">ESC</kbd>
            </div>

            {/* Commands */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length > 0 ? (
                filtered.map((cmd, i) => (
                  <motion.button
                    key={cmd.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelected(i)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                      selected === i ? "bg-muted" : "hover:bg-muted/50",
                    )}
                  >
                    <cmd.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm text-foreground">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] text-muted-foreground">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-opacity",
                        selected === i ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </motion.button>
                ))
              ) : (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">No commands found</p>
                  <p className="text-xs text-muted-foreground">Press Enter to search for "{query}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-3 border-t border-border text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1 bg-muted rounded">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 bg-muted rounded">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 bg-muted rounded">esc</kbd> Close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
