"use client"

import { motion } from "framer-motion"
import { getCurrentLevelXP, getXPForNextLevel } from "@/lib/habit-store"

interface XPBarProps {
  xp: number
  level: number
  size?: "sm" | "lg"
}

export function XPBar({ xp, level, size = "sm" }: XPBarProps) {
  const currentXP = getCurrentLevelXP(xp, level)
  const nextLevelXP = getXPForNextLevel(level)
  const progress = (currentXP / nextLevelXP) * 100

  if (size === "lg") {
    return (
      <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium tracking-widest mb-1">LEVEL</div>
            <motion.div
              className="text-7xl font-black tracking-tighter"
              key={level}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              {level}
            </motion.div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground font-medium tracking-widest mb-1">TOTAL XP</div>
            <motion.div
              className="text-4xl font-bold tabular-nums"
              key={xp}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
            >
              {xp.toLocaleString()}
            </motion.div>
          </div>
        </div>

        {/* Progress bar - sharp and minimal */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium tracking-wider">
            <span className="text-muted-foreground">NEXT LEVEL</span>
            <span className="tabular-nums">
              {currentXP} / {nextLevelXP}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-sm overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>
    )
  }

  // Small size - compact header bar
  return (
    <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold tracking-wider text-muted-foreground">LV</span>
        <span className="text-lg font-black">{level}</span>
      </div>
      <div className="flex-1 h-1.5 bg-secondary rounded-sm overflow-hidden max-w-[120px]">
        <motion.div
          className="h-full bg-primary rounded-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground font-medium tabular-nums tracking-wider">
        {currentXP}/{nextLevelXP}
      </span>
    </motion.div>
  )
}
