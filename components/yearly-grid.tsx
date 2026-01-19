"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { Habit, Checkin } from "@/lib/habit-store"
import { formatDate } from "@/lib/habit-store"

interface YearlyGridProps {
  habits: Habit[]
  checkins: Checkin[]
  year: number
}

export function YearlyGrid({ habits, checkins, year }: YearlyGridProps) {
  const activeHabits = habits.filter((h) => h.isActive)
  const [selectedHabitId, setSelectedHabitId] = useState<string>(activeHabits[0]?.id || "")
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

  const getCheckinCountForMonth = (habitId: string, year: number, month: number): number => {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    let count = 0

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(d)
      if (checkins.some((c) => c.habitId === habitId && c.date === dateStr && c.done)) {
        count++
      }
    }
    return count
  }

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate()
  }

  const getCompletionRate = (habitId: string, year: number, month: number): number => {
    const count = getCheckinCountForMonth(habitId, year, month)
    const days = getDaysInMonth(year, month)
    return Math.round((count / days) * 100)
  }

  // 達成率に応じた色の強度
  const getIntensity = (rate: number): string => {
    if (rate === 0) return "bg-secondary/30"
    if (rate < 25) return "bg-primary/20"
    if (rate < 50) return "bg-primary/40"
    if (rate < 75) return "bg-primary/60"
    if (rate < 100) return "bg-primary/80"
    return "bg-primary"
  }

  if (activeHabits.length === 0) {
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
    <Tabs value={selectedHabitId} onValueChange={setSelectedHabitId} className="w-full">
      <ScrollArea className="w-full whitespace-nowrap">
        <TabsList className="inline-flex w-auto h-auto p-1">
          {activeHabits.map((habit) => (
            <TabsTrigger
              key={habit.id}
              value={habit.id}
              className="text-xs font-bold px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {habit.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {activeHabits.map((habit) => (
        <TabsContent key={habit.id} value={habit.id} className="mt-4">
          <div className="grid grid-cols-3 gap-2">
            {months.map((monthName, index) => {
              const monthNum = index + 1
              const count = getCheckinCountForMonth(habit.id, year, monthNum)
              const rate = getCompletionRate(habit.id, year, monthNum)
              const days = getDaysInMonth(year, monthNum)

              return (
                <motion.div
                  key={monthNum}
                  className={cn("p-3 rounded-lg border border-border transition-colors", getIntensity(rate))}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="text-xs font-bold tracking-wider mb-1 opacity-90">{monthName}</div>
                  <div className="text-2xl font-black">
                    {count}
                    <span className="text-sm text-muted-foreground font-normal">/{days}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">{rate}%</div>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
