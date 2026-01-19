"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { TabNav } from "@/components/tab-nav"
import { HomeScreen } from "@/components/home-screen"
import { HabitsScreen } from "@/components/habits-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { HabitForm } from "@/components/habit-form"
import { LevelUpModal } from "@/components/level-up-modal"
import {
  type Habit,
  type Checkin,
  initialHabits,
  initialCheckins,
  calculateXP,
  calculateLevel,
  calculateStreak,
  getWeekStartDate,
} from "@/lib/habit-store"
import { evaluateBadges, type EvaluationContext } from "@/lib/badges"

type Tab = "home" | "habits" | "profile"

const STORAGE_KEY = "habitly:v1"

interface StoredState {
  habits: Habit[]
  checkins: Checkin[]
  weekStartDate: string
  unlockedBadgeIds: string[]
  equippedTitleBadgeId: string | null
}

// localStorage から読み込む
function loadFromStorage(): Partial<StoredState> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
    console.warn("localStorage からの読み込みに失敗しました:", error)
    return null
  }
}

// localStorage に保存する
function saveToStorage(
  habits: Habit[],
  checkins: Checkin[],
  weekStartDate: Date,
  unlockedBadgeIds: string[],
  equippedTitleBadgeId: string | null,
) {
  try {
    const data: StoredState = {
      habits: habits.map((h) => ({
        ...h,
        createdAt: h.createdAt,
      })),
      checkins,
      weekStartDate: weekStartDate.toISOString(),
      unlockedBadgeIds,
      equippedTitleBadgeId,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn("localStorage への保存に失敗しました:", error)
  }
}

export default function HabitTracker() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [checkins, setCheckins] = useState<Checkin[]>(initialCheckins)
  const [weekStartDate, setWeekStartDate] = useState(() => getWeekStartDate())
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpLevel, setLevelUpLevel] = useState(1)
  const [isInitialized, setIsInitialized] = useState(false)
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([])
  const [equippedTitleBadgeId, setEquippedTitleBadgeId] = useState<string | null>(null)

  const xp = calculateXP(checkins)
  const level = calculateLevel(xp)
  const streak = calculateStreak(checkins)

  const prevLevelRef = useRef(level)

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    const stored = loadFromStorage()
    if (stored) {
      if (stored.habits) {
        setHabits(
          stored.habits.map((h) => ({
            ...h,
            createdAt: new Date(h.createdAt),
          }))
        )
      }
      if (stored.checkins) {
        setCheckins(stored.checkins)
      }
      if (stored.weekStartDate) {
        const storedWeekStart = new Date(stored.weekStartDate)
        const currentWeekStart = getWeekStartDate()
        
        // 保存された週が今週より古い場合、今週に自動更新
        if (storedWeekStart < currentWeekStart) {
          setWeekStartDate(currentWeekStart)
        } else {
          setWeekStartDate(storedWeekStart)
        }
      }
      if (stored.unlockedBadgeIds) {
        setUnlockedBadgeIds(stored.unlockedBadgeIds)
      }
      if (stored.equippedTitleBadgeId !== undefined) {
        setEquippedTitleBadgeId(stored.equippedTitleBadgeId)
      }
    }
    setIsInitialized(true)
  }, [])

  // state が変更されたら localStorage に保存
  useEffect(() => {
    if (!isInitialized) return
    saveToStorage(habits, checkins, weekStartDate, unlockedBadgeIds, equippedTitleBadgeId)
  }, [habits, checkins, weekStartDate, unlockedBadgeIds, equippedTitleBadgeId, isInitialized])

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setLevelUpLevel(level)
      setShowLevelUp(true)
    }
    prevLevelRef.current = level
  }, [level])

  // Toggle checkin
  const handleToggle = useCallback(
    (habitId: string, date: string) => {
      setCheckins((prev) => {
        const existing = prev.find((c) => c.habitId === habitId && c.date === date)
        let newCheckins: Checkin[]
        let isAdding = false

        if (existing) {
          if (existing.done) {
            // チェックを外す（削除）
            newCheckins = prev.filter((c) => !(c.habitId === habitId && c.date === date))
            isAdding = false
          } else {
            // チェックを付ける
            newCheckins = prev.map((c) => (c.habitId === habitId && c.date === date ? { ...c, done: true } : c))
            isAdding = true
          }
        } else {
          // 新規チェック
          newCheckins = [...prev, { habitId, date, done: true }]
          isAdding = true
        }

        // バッジ評価（チェックを付けた時のみ）
        // チェックを外してもバッジは失われない
        if (isAdding) {
          try {
            const context: EvaluationContext = {
              habits,
              checkins: newCheckins,
              level: calculateLevel(calculateXP(newCheckins)),
              xp: calculateXP(newCheckins),
              streak: calculateStreak(newCheckins),
              currentUnlockedIds: unlockedBadgeIds,
            }
            const newBadgeIds = evaluateBadges(context)
            if (newBadgeIds.length > 0) {
              setUnlockedBadgeIds((prev) => [...prev, ...newBadgeIds])
            }
          } catch (error) {
            console.warn("バッジ評価エラー:", error)
          }
        }

        return newCheckins
      })
    },
    [habits, unlockedBadgeIds]
  )

  // Add habit
  const handleAddHabit = useCallback(
    (name: string) => {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        createdAt: new Date(),
        isActive: true,
      }
      const newHabits = [...habits, newHabit]
      setHabits(newHabits)
      
      // バッジ評価（習慣数チェック）
      try {
        const context: EvaluationContext = {
          habits: newHabits,
          checkins,
          level,
          xp,
          streak,
          currentUnlockedIds: unlockedBadgeIds,
        }
        const newBadgeIds = evaluateBadges(context)
        if (newBadgeIds.length > 0) {
          setUnlockedBadgeIds((prev) => [...prev, ...newBadgeIds])
        }
      } catch (error) {
        console.warn("バッジ評価エラー:", error)
      }
      
      setAddModalOpen(false)
    },
    [habits, checkins, level, xp, streak, unlockedBadgeIds]
  )

  // Edit habit
  const handleEditHabit = useCallback((id: string, name: string) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, name } : h)))
  }, [])

  // Delete habit
  const handleDeleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
    setCheckins((prev) => prev.filter((c) => c.habitId !== id))
  }, [])

  // Navigate to previous week
  const handlePrevWeek = useCallback(() => {
    setWeekStartDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 7)
      return newDate
    })
  }, [])

  // Navigate to next week
  const handleNextWeek = useCallback(() => {
    setWeekStartDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + 7)
      return newDate
    })
  }, [])

  // Go to current week
  const handleGoToToday = useCallback(() => {
    setWeekStartDate(getWeekStartDate())
  }, [])

  return (
    <div className="bg-background min-h-screen">
      {activeTab === "home" && (
        <HomeScreen
          habits={habits}
          checkins={checkins}
          weekStartDate={weekStartDate}
          xp={xp}
          level={level}
          equippedTitleBadgeId={equippedTitleBadgeId}
          onToggle={handleToggle}
          onAddClick={() => setAddModalOpen(true)}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onGoToToday={handleGoToToday}
        />
      )}

      {activeTab === "habits" && (
        <HabitsScreen habits={habits} onAdd={handleAddHabit} onEdit={handleEditHabit} onDelete={handleDeleteHabit} />
      )}

      {activeTab === "profile" && (
        <ProfileScreen
          xp={xp}
          level={level}
          streak={streak}
          unlockedBadgeIds={unlockedBadgeIds}
          equippedTitleBadgeId={equippedTitleBadgeId}
          onEquipTitle={setEquippedTitleBadgeId}
        />
      )}

      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <HabitForm open={addModalOpen} onOpenChange={setAddModalOpen} onSubmit={handleAddHabit} mode="add" />

      <LevelUpModal level={levelUpLevel} show={showLevelUp} onClose={() => setShowLevelUp(false)} />
    </div>
  )
}
