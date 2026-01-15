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

export function VideoCard({ video, index }: { video: Video; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
    >
      {/* Thumbnail - using img instead of next/image for simpler loading */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-3">
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
              transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
              className="h-full bg-primary"
            />
          </div>
        )}

        {/* Duration Badge */}
        <span className="absolute bottom-2 right-2 px-2 py-1 bg-foreground/90 text-background text-xs font-medium rounded-md">
          {video.duration}
        </span>

        {/* Play Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-foreground/30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            className="w-14 h-14 bg-background rounded-full flex items-center justify-center shadow-lg"
          >
            <Play className="w-6 h-6 text-foreground fill-current ml-1" />
          </motion.div>
        </motion.div>

        {/* Completed Badge */}
        {video.progress === 100 && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-success text-background text-xs font-medium rounded-md">
            Watched
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-1">{video.channel}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{video.watchedAt}</span>
          </div>
        </div>
        <button className="p-1 h-fit rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </motion.article>
  )
}
