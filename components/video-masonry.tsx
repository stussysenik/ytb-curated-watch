"use client"

import { motion } from "framer-motion"
import { VideoThumbnail } from "./video-thumbnail"

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

export function VideoMasonry({ videos }: { videos: Video[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 auto-rows-[minmax(120px,auto)]"
    >
      {videos.map((video, i) => {
        // Asymmetric pattern: every 5th and 7th item spans 2 cols
        const isLarge = i % 7 === 0 || i % 11 === 4
        // Every 3rd large item also spans 2 rows
        const isTall = isLarge && i % 3 === 0

        return (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`${isLarge ? "col-span-2" : ""} ${isTall ? "row-span-2" : ""}`}
          >
            <VideoThumbnail video={video} index={i} size={isLarge ? (isTall ? "large" : "wide") : "medium"} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
