"use client"

import { motion } from "framer-motion"
import { Play, Clock, MoreVertical } from "lucide-react"

interface Video {
  id: string
  title: string
  channel: string
  duration: string
  thumbnail: string
  watchedAt: string
  category: string
  progress: number
}

export function VideoListItem({ video, index }: { video: Video; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ x: 4 }}
      className="group flex gap-4 p-3 rounded-2xl hover:bg-muted/50 cursor-pointer transition-colors"
    >
      {/* Thumbnail - using img instead of next/image */}
      <div className="relative w-40 sm:w-48 aspect-video rounded-xl overflow-hidden bg-muted flex-shrink-0">
        <img
          src={video.thumbnail || "/placeholder.svg"}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Progress Bar */}
        {video.progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${video.progress}%` }}
              transition={{ delay: index * 0.03 + 0.2, duration: 0.4 }}
              className="h-full bg-primary"
            />
          </div>
        )}

        {/* Duration Badge */}
        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-foreground/90 text-background text-xs font-medium rounded">
          {video.duration}
        </span>

        {/* Play Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-foreground/30 flex items-center justify-center"
        >
          <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-foreground fill-current ml-0.5" />
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-1">
        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-2">{video.channel}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{video.watchedAt}</span>
          </div>
          <span className="px-2 py-0.5 bg-muted rounded-full text-xs">{video.category}</span>
          {video.progress === 100 && (
            <span className="px-2 py-0.5 bg-success/20 text-success rounded-full text-xs font-medium">Watched</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <button className="p-2 h-fit rounded-xl opacity-0 group-hover:opacity-100 hover:bg-muted transition-all self-center">
        <MoreVertical className="w-5 h-5 text-muted-foreground" />
      </button>
    </motion.article>
  )
}
