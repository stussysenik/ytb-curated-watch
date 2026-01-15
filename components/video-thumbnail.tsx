"use client"

import { motion } from "framer-motion"
import { Star, FolderOpen, Clock } from "lucide-react"
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

type Size = "small" | "medium" | "wide" | "large"

export function VideoThumbnail({ video, index, size = "medium" }: { video: Video; index: number; size?: Size }) {
  const aspectClass = {
    small: "aspect-video",
    medium: "aspect-video",
    wide: "aspect-[2/1]",
    large: "aspect-[4/3] sm:aspect-square",
  }[size]

  const titleClass = {
    small: "text-[10px] line-clamp-1",
    medium: "text-xs line-clamp-2",
    wide: "text-sm line-clamp-2",
    large: "text-sm sm:text-base line-clamp-2",
  }[size]

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer h-full flex flex-col"
    >
      {/* Thumbnail */}
      <div className={cn("relative rounded-xl overflow-hidden bg-muted", aspectClass)}>
        <img
          src={`/generic-placeholder-icon.png?height=${size === "large" ? 300 : 180}&width=${size === "wide" ? 400 : 320}&query=${encodeURIComponent(video.title + " " + video.category)}`}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Progress */}
        {video.progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${video.progress}%` }}
              transition={{ delay: index * 0.03 + 0.2 }}
              className="h-full bg-primary"
            />
          </div>
        )}

        {/* Duration */}
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-foreground/90 text-background text-[10px] font-medium rounded">
          {video.duration}
        </span>

        {/* Starred indicator */}
        {video.starred && (
          <span className="absolute top-2 right-2 p-1 bg-foreground/80 rounded-full">
            <Star className="w-3 h-3 fill-accent-secondary text-accent-secondary" />
          </span>
        )}

        {/* Completed badge */}
        {video.progress === 100 && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-success text-background text-[10px] font-medium rounded">
            Watched
          </span>
        )}

        {/* Hover overlay with quick info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent flex flex-col justify-end p-3"
        >
          <div className="flex items-center gap-2 text-[10px] text-background/90">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.watchedAt}
            </span>
            {video.playlist && (
              <span className="flex items-center gap-1">
                <FolderOpen className="w-3 h-3" />
                {video.playlist}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <div className="flex-1 pt-2 pb-1">
        <h3
          className={cn(
            "font-medium text-foreground leading-snug group-hover:text-primary transition-colors",
            titleClass,
          )}
        >
          {video.title}
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">{video.channel}</p>
      </div>
    </motion.article>
  )
}
