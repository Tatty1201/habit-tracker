"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { Habit, Checkin } from "@/lib/habit-store"
import { formatDate } from "@/lib/habit-store"

interface MonthlyGridProps {
  habits: Habit[]
  checkins: Checkin[]
  year: number
  month: number // 1-12
}

export function MonthlyGrid({ habits, checkins, year, month }: MonthlyGridProps) {
  const activeHabits = habits.filter((h) => h.isActive)
  const [selectedHabitId, setSelectedHabitId] = useState<string>(activeHabits[0]?.id || "")
  const isChecked = (habitId: string, date: string): boolean => {
    return checkins.some((c) => c.habitId === habitId && c.date === date && c.done)
  }

  // 月の日数を取得
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate()
  }

  // 月の最初の日の曜日を取得（0: 日曜日）
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month - 1, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month

  // カレンダーのグリッドデータを生成
  const calendarDays: (number | null)[] = []
  // 最初の週の空白
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  // 日付
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const getDayDate = (day: number): Date => {
    return new Date(year, month - 1, day)
  }

  const isToday = (day: number): boolean => {
    if (!isCurrentMonth) return false
    return today.getDate() === day
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
          <div className="grid grid-cols-7 gap-1">
            {/* 曜日ヘッダー */}
            {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground font-semibold py-1">
                {day}
              </div>
            ))}
            {/* カレンダー日付 */}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const date = getDayDate(day)
              const dateStr = formatDate(date)
              const checked = isChecked(habit.id, dateStr)
              const todayCell = isToday(day)

              return (
                <div
                  key={day}
                  className={cn(
                    "relative aspect-square rounded-md flex items-center justify-center",
                    checked ? "bg-primary" : "bg-secondary/30",
                    todayCell && "ring-2 ring-primary",
                  )}
                >
                  {checked && <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />}
                  <span
                    className={cn(
                      "absolute bottom-0.5 right-1 text-[10px] font-medium",
                      checked ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
