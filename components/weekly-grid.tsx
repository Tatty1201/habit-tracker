"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { Habit, Checkin } from "@/lib/habit-store"
import { formatDate, getWeekDates, getDayName, getMonthDay, isToday } from "@/lib/habit-store"

interface WeeklyGridProps {
  habits: Habit[]
  checkins: Checkin[]
  weekStartDate: Date
  onToggle: (habitId: string, date: string) => void
}

export function WeeklyGrid({ habits, checkins, weekStartDate, onToggle }: WeeklyGridProps) {
  const weekDates = getWeekDates(weekStartDate)
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set())

  const isChecked = (habitId: string, date: string): boolean => {
    return checkins.some((c) => c.habitId === habitId && c.date === date && c.done)
  }

  const handleToggle = (habitId: string, date: string) => {
    // 今日の日付かチェック
    const dateObj = new Date(date)
    if (!isToday(dateObj)) {
      return // 当日以外はチェック不可
    }

    const cellKey = `${habitId}-${date}`
    const wasChecked = isChecked(habitId, date)

    if (!wasChecked) {
      setAnimatingCells((prev) => new Set(prev).add(cellKey))
      setTimeout(() => {
        setAnimatingCells((prev) => {
          const next = new Set(prev)
          next.delete(cellKey)
          return next
        })
      }, 300)
    }

    onToggle(habitId, date)
  }

  if (habits.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/30 rounded-lg mb-6" />
        <h3 className="text-2xl font-bold tracking-tight mb-2">NO HABITS YET</h3>
        <p className="text-muted-foreground text-sm tracking-wide">ADD YOUR FIRST HABIT TO START TRACKING</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Header row - minimal */}
      <div className="grid gap-1" style={{ gridTemplateColumns: `minmax(80px, 1fr) repeat(7, 1fr)` }}>
        <div className="h-12" />
        {weekDates.map((date) => (
          <div
            key={formatDate(date)}
            className={cn(
              "flex flex-col items-center justify-center h-12 text-xs",
              isToday(date) && "text-primary font-bold",
            )}
          >
            <span className="font-semibold tracking-wider">{getDayName(date)}</span>
            <span className={cn("text-[10px]", isToday(date) ? "text-primary" : "text-muted-foreground")}>
              {getMonthDay(date)}
            </span>
          </div>
        ))}
      </div>

      {/* Habit rows */}
      {habits
        .filter((h) => h.isActive)
        .map((habit) => (
          <div
            key={habit.id}
            className="grid gap-1"
            style={{ gridTemplateColumns: `minmax(80px, 1fr) repeat(7, 1fr)` }}
          >
            <div className="flex items-center min-h-12 px-1 py-1">
              <span className="text-xs font-bold tracking-wide uppercase leading-tight break-words line-clamp-2">
                {habit.name}
              </span>
            </div>
            {weekDates.map((date) => {
              const dateStr = formatDate(date)
              const checked = isChecked(habit.id, dateStr)
              const todayCell = isToday(date)
              const cellKey = `${habit.id}-${dateStr}`
              const isAnimating = animatingCells.has(cellKey)

              return (
                <motion.button
                  key={dateStr}
                  onClick={() => handleToggle(habit.id, dateStr)}
                  disabled={!todayCell}
                  className={cn(
                    "relative min-h-12 rounded-md transition-colors duration-100",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                    checked ? "bg-primary" : "bg-secondary/50 hover:bg-secondary",
                    todayCell && !checked && "ring-1 ring-primary/50",
                    !todayCell && "opacity-50 cursor-not-allowed hover:bg-secondary/50",
                  )}
                  whileTap={todayCell ? { scale: 0.9 } : {}}
                  transition={{ duration: 0.1 }}
                  aria-label={`${habit.name} - ${getMonthDay(date)} ${checked ? "完了" : "未完了"}`}
                >
                  <AnimatePresence>
                    {isAnimating && (
                      <motion.div
                        className="absolute inset-0 rounded-md bg-primary"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Check icon - instant appearance */}
                  <AnimatePresence mode="wait">
                    {checked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-primary-foreground" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>
        ))}
    </div>
  )
}
