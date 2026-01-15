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

export function VideoGrid({ videos }: { videos: Video[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4"
    >
      {videos.map((video, i) => (
        <VideoThumbnail key={video.id} video={video} index={i} size="medium" />
      ))}
    </motion.div>
  )
}
