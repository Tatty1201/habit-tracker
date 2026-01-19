"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LevelUpModalProps {
  level: number
  show: boolean
  onClose: () => void
}

export function LevelUpModal({ level, show, onClose }: LevelUpModalProps) {
  useEffect(() => {
    if (show) {
      // Quick auto close
      const timer = setTimeout(onClose, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent line */}
            <motion.div
              className="w-16 h-1 bg-primary mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            />

            {/* Level text */}
            <motion.p
              className="text-xs font-bold tracking-[0.3em] text-muted-foreground mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              LEVEL UP
            </motion.p>

            {/* Big level number */}
            <motion.div
              className="text-[120px] font-black leading-none tracking-tighter"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {level}
            </motion.div>

            {/* Accent line bottom */}
            <motion.div
              className="w-16 h-1 bg-primary mt-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            />

            <motion.p
              className="text-xs font-medium tracking-wider text-muted-foreground mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              KEEP PUSHING
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
