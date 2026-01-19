"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeeklyGrid } from "@/components/weekly-grid"
import { MonthlyGrid } from "@/components/monthly-grid"
import { YearlyGrid } from "@/components/yearly-grid"
import { XPBar } from "@/components/xp-bar"
import type { Habit, Checkin } from "@/lib/habit-store"
import { getMonthDay, getWeekDates, getWeekStartDate } from "@/lib/habit-store"
import { getBadgeById } from "@/lib/badges"

type ViewMode = "week" | "month" | "year"

interface HomeScreenProps {
  habits: Habit[]
  checkins: Checkin[]
  weekStartDate: Date
  xp: number
  level: number
  equippedTitleBadgeId: string | null
  onToggle: (habitId: string, date: string) => void
  onAddClick: () => void
  onPrevWeek: () => void
  onNextWeek: () => void
  onGoToToday: () => void
}

export function HomeScreen({
  habits,
  checkins,
  weekStartDate,
  xp,
  level,
  equippedTitleBadgeId,
  onToggle,
  onAddClick,
  onPrevWeek,
  onNextWeek,
  onGoToToday,
}: HomeScreenProps) {
  const equippedBadge = equippedTitleBadgeId ? getBadgeById(equippedTitleBadgeId) : null
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1)

  const weekDates = getWeekDates(weekStartDate)
  const weekStart = getMonthDay(weekDates[0])
  const weekEnd = getMonthDay(weekDates[6])
  const currentWeekStart = getWeekStartDate()
  const isCurrentWeek = weekStartDate.getTime() === currentWeekStart.getTime()

  const today = new Date()
  const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1
  const isCurrentYear = currentYear === today.getFullYear()

  const handlePrevPeriod = () => {
    if (viewMode === "week") {
      onPrevWeek()
    } else if (viewMode === "month") {
      if (currentMonth === 1) {
        setCurrentMonth(12)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      setCurrentYear(currentYear - 1)
    }
  }

  const handleNextPeriod = () => {
    if (viewMode === "week") {
      onNextWeek()
    } else if (viewMode === "month") {
      if (currentMonth === 12) {
        setCurrentMonth(1)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    } else {
      setCurrentYear(currentYear + 1)
    }
  }

  const handleGoToCurrent = () => {
    if (viewMode === "week") {
      onGoToToday()
    } else if (viewMode === "month") {
      setCurrentYear(today.getFullYear())
      setCurrentMonth(today.getMonth() + 1)
    } else {
      setCurrentYear(today.getFullYear())
    }
  }

  const getPeriodLabel = (): string => {
    if (viewMode === "week") {
      return `${weekStart} — ${weekEnd}`
    } else if (viewMode === "month") {
      return `${currentYear}年 ${currentMonth}月`
    } else {
      return `${currentYear}年`
    }
  }

  const isCurrentPeriod = (): boolean => {
    if (viewMode === "week") return isCurrentWeek
    if (viewMode === "month") return isCurrentMonth
    return isCurrentYear
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tighter">HABITLY</h1>
              {equippedBadge && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/30">
                  <span className="text-sm">{equippedBadge.icon}</span>
                  <span className="text-xs font-bold text-primary">{equippedBadge.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevPeriod} aria-label="前へ">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground font-medium tracking-wider min-w-[120px] text-center">
                {getPeriodLabel()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleNextPeriod}
                disabled={isCurrentPeriod()}
                aria-label="次へ"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {!isCurrentPeriod() && (
            <div className="mb-2">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs font-bold" onClick={handleGoToCurrent}>
                {viewMode === "week" ? "今週に戻る" : viewMode === "month" ? "今月に戻る" : "今年に戻る"}
              </Button>
            </div>
          )}
          <XPBar xp={xp} level={level} />
        </div>
      </header>

      {/* View mode tabs */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week" className="text-xs font-bold">
              週
            </TabsTrigger>
            <TabsTrigger value="month" className="text-xs font-bold">
              月
            </TabsTrigger>
            <TabsTrigger value="year" className="text-xs font-bold">
              年
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {viewMode === "week" && (
          <WeeklyGrid habits={habits} checkins={checkins} weekStartDate={weekStartDate} onToggle={onToggle} />
        )}
        {viewMode === "month" && (
          <MonthlyGrid habits={habits} checkins={checkins} year={currentYear} month={currentMonth} />
        )}
        {viewMode === "year" && <YearlyGrid habits={habits} checkins={checkins} year={currentYear} />}
      </main>

      <motion.div className="fixed bottom-20 right-4" whileTap={{ scale: 0.9 }} transition={{ duration: 0.1 }}>
        <Button size="lg" className="w-14 h-14 rounded-full" onClick={onAddClick} aria-label="Habitを追加">
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </Button>
      </motion.div>
    </div>
  )
}
