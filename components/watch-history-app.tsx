"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Grid3X3, List, Clock, Filter, X, Play, ChevronDown } from "lucide-react"
import { VideoCard } from "./video-card"
import { VideoListItem } from "./video-list-item"
import { FilterDrawer } from "./filter-drawer"
import { cn } from "@/lib/utils"

const MOCK_VIDEOS = [
  {
    id: "1",
    title: "Building a Design System from Scratch",
    channel: "Design Pilots",
    duration: "24:30",
    thumbnail: "/design-system-tutorial-colorful.jpg",
    watchedAt: "2 hours ago",
    category: "Design",
    progress: 85,
  },
  {
    id: "2",
    title: "The Art of Typography in UI Design",
    channel: "Typewolf",
    duration: "18:45",
    thumbnail: "/typography-art-poster.jpg",
    watchedAt: "Yesterday",
    category: "Design",
    progress: 100,
  },
  {
    id: "3",
    title: "React 19 - What's New and Exciting",
    channel: "Fireship",
    duration: "12:08",
    thumbnail: "/react-programming-code-blue.jpg",
    watchedAt: "2 days ago",
    category: "Tech",
    progress: 45,
  },
  {
    id: "4",
    title: "Morning Productivity Routine",
    channel: "Ali Abdaal",
    duration: "32:15",
    thumbnail: "/morning-productivity-sunrise-coffee.jpg",
    watchedAt: "3 days ago",
    category: "Productivity",
    progress: 100,
  },
  {
    id: "5",
    title: "Mastering CSS Grid Layout",
    channel: "Kevin Powell",
    duration: "45:22",
    thumbnail: "/css-grid-layout-tutorial.jpg",
    watchedAt: "4 days ago",
    category: "Tech",
    progress: 72,
  },
  {
    id: "6",
    title: "The Psychology of Color in Branding",
    channel: "The Futur",
    duration: "28:10",
    thumbnail: "/color-psychology-branding-rainbow.jpg",
    watchedAt: "5 days ago",
    category: "Design",
    progress: 100,
  },
  {
    id: "7",
    title: "How to Build Habits That Stick",
    channel: "Thomas Frank",
    duration: "16:42",
    thumbnail: "/habits-productivity-notebook.jpg",
    watchedAt: "1 week ago",
    category: "Productivity",
    progress: 30,
  },
  {
    id: "8",
    title: "Advanced Framer Motion Animations",
    channel: "Sam Selikoff",
    duration: "38:55",
    thumbnail: "/animation-motion-graphics-purple.jpg",
    watchedAt: "1 week ago",
    category: "Tech",
    progress: 100,
  },
  {
    id: "9",
    title: "Minimalist Living Guide 2024",
    channel: "Matt D'Avella",
    duration: "22:18",
    thumbnail: "/minimalist-living-room-white.jpg",
    watchedAt: "2 weeks ago",
    category: "Lifestyle",
    progress: 100,
  },
  {
    id: "10",
    title: "Building AI Apps with Next.js",
    channel: "Vercel",
    duration: "52:30",
    thumbnail: "/ai-artificial-intelligence-code.jpg",
    watchedAt: "2 weeks ago",
    category: "Tech",
    progress: 60,
  },
  {
    id: "11",
    title: "Street Photography Composition",
    channel: "Sean Tucker",
    duration: "19:45",
    thumbnail: "/street-photography-urban-city.jpg",
    watchedAt: "3 weeks ago",
    category: "Photography",
    progress: 100,
  },
  {
    id: "12",
    title: "The Future of Web Development",
    channel: "Theo",
    duration: "28:33",
    thumbnail: "/web-development-future-tech.jpg",
    watchedAt: "1 month ago",
    category: "Tech",
    progress: 88,
  },
]

const CATEGORIES = ["All", "Design", "Tech", "Productivity", "Lifestyle", "Photography"]

export function WatchHistoryApp() {
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "duration">("recent")
  const [progressFilter, setProgressFilter] = useState<"all" | "completed" | "in-progress">("all")

  const filteredVideos = useMemo(() => {
    let result = MOCK_VIDEOS.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.channel.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === "All" || video.category === selectedCategory
      const matchesProgress =
        progressFilter === "all" ||
        (progressFilter === "completed" && video.progress === 100) ||
        (progressFilter === "in-progress" && video.progress < 100)
      return matchesSearch && matchesCategory && matchesProgress
    })

    if (sortBy === "oldest") result = [...result].reverse()
    if (sortBy === "duration")
      result = [...result].sort((a, b) => {
        const aDur = a.duration.split(":").reduce((acc, t, i) => acc + Number.parseInt(t) * (i === 0 ? 60 : 1), 0)
        const bDur = b.duration.split(":").reduce((acc, t, i) => acc + Number.parseInt(t) * (i === 0 ? 60 : 1), 0)
        return bDur - aDur
      })

    return result
  }, [search, selectedCategory, sortBy, progressFilter])

  const handleClearSearch = useCallback(() => setSearch(""), [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground fill-current" />
              </div>
              <span className="font-bold text-lg md:text-xl tracking-tight text-foreground">
                Re<span className="text-primary">Watch</span>
              </span>
            </motion.div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <SearchInput value={search} onChange={setSearch} onClear={handleClearSearch} />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(true)}
                className="p-2 md:p-2.5 rounded-xl bg-muted hover:bg-accent transition-colors relative"
              >
                <Filter className="w-5 h-5 text-foreground" />
                {(progressFilter !== "all" || sortBy !== "recent") && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-secondary rounded-full" />
                )}
              </motion.button>
              <div className="hidden sm:flex bg-muted rounded-xl p-1">
                <ViewToggle icon={Grid3X3} active={viewMode === "grid"} onClick={() => setViewMode("grid")} />
                <ViewToggle icon={List} active={viewMode === "list"} onClick={() => setViewMode("list")} />
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <SearchInput value={search} onChange={setSearch} onClear={handleClearSearch} />
          </div>
        </div>
      </motion.header>

      {/* Category Pills */}
      <div className="sticky top-16 md:top-20 z-30 bg-background/60 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                  selectedCategory === category
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredVideos.length}</span> videos found
          </p>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Clock className="w-4 h-4" />
            {sortBy === "recent" ? "Most Recent" : sortBy === "oldest" ? "Oldest First" : "Longest First"}
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Video Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredVideos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              {filteredVideos.map((video, index) => (
                <VideoListItem key={video.id} video={video} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No videos found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </motion.div>
        )}
      </main>

      {/* Filter Drawer */}
      <FilterDrawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        progressFilter={progressFilter}
        setProgressFilter={setProgressFilter}
      />
    </div>
  )
}

function SearchInput({
  value,
  onChange,
  onClear,
}: { value: string; onChange: (v: string) => void; onClear: () => void }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your watch history..."
        className="w-full h-12 pl-12 pr-12 bg-muted rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function ViewToggle({ icon: Icon, active, onClick }: { icon: typeof Grid3X3; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  )
}
