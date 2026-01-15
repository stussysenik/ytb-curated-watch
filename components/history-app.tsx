"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Command,
  Grid3X3,
  LayoutGrid,
  List,
  Rows3,
  FolderOpen,
  History,
  Star,
  X,
  ChevronRight,
} from "lucide-react"
import { CommandPalette } from "./command-palette"
import { VideoGrid } from "./video-grid"
import { VideoMasonry } from "./video-masonry"
import { VideoRows } from "./video-rows"
import { PlaylistPanel } from "./playlist-panel"
import { cn } from "@/lib/utils"

const VIDEOS = [
  {
    id: "1",
    title: "Design Systems Deep Dive",
    channel: "Design Pilots",
    duration: "24:30",
    watchedAt: "2h ago",
    category: "Design",
    progress: 85,
    playlist: "Learning",
    starred: true,
  },
  {
    id: "2",
    title: "Typography Mastery",
    channel: "Typewolf",
    duration: "18:45",
    watchedAt: "Yesterday",
    category: "Design",
    progress: 100,
    playlist: "Learning",
    starred: false,
  },
  {
    id: "3",
    title: "React 19 Features",
    channel: "Fireship",
    duration: "12:08",
    watchedAt: "2d ago",
    category: "Tech",
    progress: 45,
    playlist: "Tech Stack",
    starred: true,
  },
  {
    id: "4",
    title: "Morning Routine",
    channel: "Ali Abdaal",
    duration: "32:15",
    watchedAt: "3d ago",
    category: "Productivity",
    progress: 100,
    playlist: null,
    starred: false,
  },
  {
    id: "5",
    title: "CSS Grid Mastery",
    channel: "Kevin Powell",
    duration: "45:22",
    watchedAt: "4d ago",
    category: "Tech",
    progress: 72,
    playlist: "Tech Stack",
    starred: false,
  },
  {
    id: "6",
    title: "Color Psychology",
    channel: "The Futur",
    duration: "28:10",
    watchedAt: "5d ago",
    category: "Design",
    progress: 100,
    playlist: "Learning",
    starred: true,
  },
  {
    id: "7",
    title: "Building Habits",
    channel: "Thomas Frank",
    duration: "16:42",
    watchedAt: "1w ago",
    category: "Productivity",
    progress: 30,
    playlist: null,
    starred: false,
  },
  {
    id: "8",
    title: "Framer Motion Advanced",
    channel: "Sam Selikoff",
    duration: "38:55",
    watchedAt: "1w ago",
    category: "Tech",
    progress: 100,
    playlist: "Tech Stack",
    starred: true,
  },
  {
    id: "9",
    title: "Minimalist Guide",
    channel: "Matt D'Avella",
    duration: "22:18",
    watchedAt: "2w ago",
    category: "Lifestyle",
    progress: 100,
    playlist: null,
    starred: false,
  },
  {
    id: "10",
    title: "AI Apps with Next.js",
    channel: "Vercel",
    duration: "52:30",
    watchedAt: "2w ago",
    category: "Tech",
    progress: 60,
    playlist: "Tech Stack",
    starred: true,
  },
  {
    id: "11",
    title: "Street Photography",
    channel: "Sean Tucker",
    duration: "19:45",
    watchedAt: "3w ago",
    category: "Photography",
    progress: 100,
    playlist: "Creative",
    starred: false,
  },
  {
    id: "12",
    title: "Future of Web Dev",
    channel: "Theo",
    duration: "28:33",
    watchedAt: "1mo ago",
    category: "Tech",
    progress: 88,
    playlist: "Tech Stack",
    starred: false,
  },
]

const PLAYLISTS = ["All", "Learning", "Tech Stack", "Creative", "Watch Later"]
type ViewMode = "grid" | "masonry" | "rows" | "dense"
type Tab = "history" | "playlists" | "starred"

export function HistoryApp() {
  const [search, setSearch] = useState("")
  const [cmdOpen, setCmdOpen] = useState(false)
  const [view, setView] = useState<ViewMode>("masonry")
  const [tab, setTab] = useState<Tab>("history")
  const [playlist, setPlaylist] = useState("All")
  const [showPlaylistPanel, setShowPlaylistPanel] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCmdOpen(true)
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setCmdOpen(false)
        inputRef.current?.blur()
      }
      // View shortcuts: 1=grid, 2=masonry, 3=rows, 4=dense
      if (!e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== "INPUT") {
        if (e.key === "1") setView("grid")
        if (e.key === "2") setView("masonry")
        if (e.key === "3") setView("rows")
        if (e.key === "4") setView("dense")
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const filtered = useMemo(() => {
    return VIDEOS.filter((v) => {
      const matchSearch =
        v.title.toLowerCase().includes(search.toLowerCase()) || v.channel.toLowerCase().includes(search.toLowerCase())
      const matchPlaylist = playlist === "All" || v.playlist === playlist
      const matchTab = tab === "history" || (tab === "starred" && v.starred) || (tab === "playlists" && v.playlist)
      return matchSearch && matchPlaylist && matchTab
    })
  }, [search, playlist, tab])

  const clearSearch = useCallback(() => setSearch(""), [])

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header - Compact, information-dense */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-3 h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <History className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="hidden sm:block font-bold text-base tracking-tight">
                Re<span className="text-primary">call</span>
              </span>
            </div>

            {/* Tabs - Mobile: icons only, Desktop: icons + text */}
            <div className="flex bg-muted rounded-xl p-1 gap-0.5">
              <TabBtn icon={History} label="History" active={tab === "history"} onClick={() => setTab("history")} />
              <TabBtn
                icon={FolderOpen}
                label="Playlists"
                active={tab === "playlists"}
                onClick={() => setTab("playlists")}
              />
              <TabBtn icon={Star} label="Starred" active={tab === "starred"} onClick={() => setTab("starred")} />
            </div>

            {/* Search - Raycast style */}
            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full h-10 sm:h-11 pl-10 pr-20 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {search && (
                    <button onClick={clearSearch} className="p-1 hover:bg-accent rounded">
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                  <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-background rounded text-[10px] text-muted-foreground border border-border">
                    <Command className="w-2.5 h-2.5" />K
                  </kbd>
                </div>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              <ViewBtn icon={Grid3X3} active={view === "grid"} onClick={() => setView("grid")} shortcut="1" />
              <ViewBtn icon={LayoutGrid} active={view === "masonry"} onClick={() => setView("masonry")} shortcut="2" />
              <ViewBtn icon={Rows3} active={view === "rows"} onClick={() => setView("rows")} shortcut="3" />
              <ViewBtn icon={List} active={view === "dense"} onClick={() => setView("dense")} shortcut="4" />
            </div>
          </div>
        </div>
      </header>

      {/* Playlist Pills - horizontal scroll on mobile */}
      <div className="sticky top-14 sm:top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPlaylistPanel(!showPlaylistPanel)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Playlists</span>
              <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", showPlaylistPanel && "rotate-90")} />
            </button>
            <div className="h-4 w-px bg-border" />
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
              {PLAYLISTS.map((p) => (
                <motion.button
                  key={p}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPlaylist(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                    playlist === p ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-accent",
                  )}
                >
                  {p}
                </motion.button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> videos
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Playlist Side Panel - Desktop only */}
        <AnimatePresence>
          {showPlaylistPanel && (
            <PlaylistPanel
              playlists={PLAYLISTS}
              selected={playlist}
              onSelect={setPlaylist}
              onClose={() => setShowPlaylistPanel(false)}
            />
          )}
        </AnimatePresence>

        {/* Video Content */}
        <main className="flex-1 max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <AnimatePresence mode="wait">
            {view === "grid" && <VideoGrid key="grid" videos={filtered} />}
            {view === "masonry" && <VideoMasonry key="masonry" videos={filtered} />}
            {view === "rows" && <VideoRows key="rows" videos={filtered} />}
            {view === "dense" && <VideoRows key="dense" videos={filtered} dense />}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No videos found</p>
            </motion.div>
          )}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onSearch={setSearch}
        setView={setView}
        setTab={setTab}
      />
    </div>
  )
}

function TabBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: { icon: typeof History; label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  )
}

function ViewBtn({
  icon: Icon,
  active,
  onClick,
  shortcut,
}: { icon: typeof Grid3X3; active: boolean; onClick: () => void; shortcut: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={`Press ${shortcut}`}
      className={cn(
        "p-2 rounded-lg transition-all relative group",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {shortcut}
      </span>
    </motion.button>
  )
}
