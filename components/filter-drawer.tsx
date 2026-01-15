"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  sortBy: "recent" | "oldest" | "duration"
  setSortBy: (v: "recent" | "oldest" | "duration") => void
  progressFilter: "all" | "completed" | "in-progress"
  setProgressFilter: (v: "all" | "completed" | "in-progress") => void
}

export function FilterDrawer({
  open,
  onClose,
  sortBy,
  setSortBy,
  progressFilter,
  setProgressFilter,
}: FilterDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[80vh] overflow-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-muted rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Sort By */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Sort By</h3>
                <div className="grid grid-cols-3 gap-2">
                  <FilterOption label="Recent" active={sortBy === "recent"} onClick={() => setSortBy("recent")} />
                  <FilterOption label="Oldest" active={sortBy === "oldest"} onClick={() => setSortBy("oldest")} />
                  <FilterOption label="Duration" active={sortBy === "duration"} onClick={() => setSortBy("duration")} />
                </div>
              </div>

              {/* Progress Filter */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Watch Progress</h3>
                <div className="space-y-2">
                  <ProgressOption
                    icon={Clock}
                    label="All Videos"
                    description="Show everything"
                    active={progressFilter === "all"}
                    onClick={() => setProgressFilter("all")}
                  />
                  <ProgressOption
                    icon={CheckCircle2}
                    label="Completed"
                    description="Videos you finished"
                    active={progressFilter === "completed"}
                    onClick={() => setProgressFilter("completed")}
                    accentClass="text-success"
                  />
                  <ProgressOption
                    icon={Loader2}
                    label="In Progress"
                    description="Continue watching"
                    active={progressFilter === "in-progress"}
                    onClick={() => setProgressFilter("in-progress")}
                    accentClass="text-accent-secondary"
                  />
                </div>
              </div>

              {/* Apply Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 bg-foreground text-background font-semibold rounded-2xl hover:opacity-90 transition-opacity"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function FilterOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "py-3 px-4 rounded-xl text-sm font-medium transition-all",
        active ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-accent",
      )}
    >
      {label}
    </motion.button>
  )
}

function ProgressOption({
  icon: Icon,
  label,
  description,
  active,
  onClick,
  accentClass,
}: {
  icon: typeof Clock
  label: string
  description: string
  active: boolean
  onClick: () => void
  accentClass?: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all",
        active ? "bg-muted ring-2 ring-foreground" : "bg-muted/50 hover:bg-muted",
      )}
    >
      <div className={cn("p-2 rounded-xl bg-background", accentClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 transition-all",
          active ? "bg-foreground border-foreground" : "border-muted-foreground",
        )}
      />
    </motion.button>
  )
}
