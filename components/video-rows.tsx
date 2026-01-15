"use client"

import { motion } from "framer-motion"
import { Clock, Star, FolderOpen, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Video {
  id: string
  title: string
  channel: string
  duration: string
  watchedAt: string
  category: string
  progress: number
  playlist: string | null
  starred: boolean
}

export function VideoRows({ videos, dense = false }: { videos: Video[]; dense?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1">
      {videos.map((video, i) => (
        <motion.article
          key={video.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02 }}
          whileHover={{ x: 2 }}
          className={cn(
            "group flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-muted/60",
            dense ? "px-2 py-1.5" : "px-3 py-2.5",
          )}
        >
          {/* Thumbnail */}
          <div
            className={cn(
              "relative rounded-lg overflow-hidden bg-muted flex-shrink-0",
              dense ? "w-20 h-12" : "w-32 h-20 sm:w-40 sm:h-24",
            )}
          >
            <img
              src={`/generic-placeholder-icon.png?height=${dense ? 48 : 96}&width=${dense ? 80 : 160}&query=${encodeURIComponent(video.title)}`}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {video.progress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground/20">
                <div className="h-full bg-primary" style={{ width: `${video.progress}%` }} />
              </div>
            )}
            <span
              className={cn(
                "absolute bottom-1 right-1 px-1 py-0.5 bg-foreground/90 text-background font-medium rounded",
                dense ? "text-[9px]" : "text-[10px]",
              )}
            >
              {video.duration}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors",
                dense ? "text-xs" : "text-sm",
              )}
            >
              {video.title}
            </h3>
            <div
              className={cn("flex items-center gap-2 text-muted-foreground mt-0.5", dense ? "text-[10px]" : "text-xs")}
            >
              <span>{video.channel}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{video.category}</span>
            </div>
          </div>

          {/* Meta */}
          <div
            className={cn(
              "hidden sm:flex items-center gap-3 text-muted-foreground flex-shrink-0",
              dense ? "text-[10px]" : "text-xs",
            )}
          >
            <span className="flex items-center gap-1">
              <Clock className={cn(dense ? "w-3 h-3" : "w-3.5 h-3.5")} />
              {video.watchedAt}
            </span>
            {video.playlist && (
              <span className="flex items-center gap-1 text-accent-secondary">
                <FolderOpen className={cn(dense ? "w-3 h-3" : "w-3.5 h-3.5")} />
                {video.playlist}
              </span>
            )}
            {video.starred && (
              <Star className={cn("fill-accent-secondary text-accent-secondary", dense ? "w-3 h-3" : "w-3.5 h-3.5")} />
            )}
          </div>

          {/* Progress indicator */}
          {video.progress === 100 ? (
            <span
              className={cn(
                "px-2 py-0.5 bg-success/20 text-success rounded font-medium",
                dense ? "text-[9px]" : "text-[10px]",
              )}
            >
              Done
            </span>
          ) : (
            <span
              className={cn("px-2 py-0.5 bg-muted text-muted-foreground rounded", dense ? "text-[9px]" : "text-[10px]")}
            >
              {video.progress}%
            </span>
          )}

          {/* Actions */}
          <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent transition-all">
            <MoreHorizontal className={cn("text-muted-foreground", dense ? "w-3.5 h-3.5" : "w-4 h-4")} />
          </button>
        </motion.article>
      ))}
    </motion.div>
  )
}
