// Habit Store - ローカル状態管理（後でSupabase接続予定）

export interface Habit {
  id: string
  name: string
  createdAt: Date
  isActive: boolean
}

export interface Checkin {
  date: string // YYYY-MM-DD
  habitId: string
  done: boolean
}

export interface HabitStore {
  habits: Habit[]
  checkins: Checkin[]
  weekStartDate: Date
  xp: number
  level: number
}

// ダミーデータ
export const initialHabits: Habit[] = [
  { id: "1", name: "運動", createdAt: new Date(), isActive: true },
  { id: "2", name: "読書", createdAt: new Date(), isActive: true },
  { id: "3", name: "瞑想", createdAt: new Date(), isActive: true },
]

export const initialCheckins: Checkin[] = []

// ユーティリティ関数
export function calculateXP(checkins: Checkin[]): number {
  return checkins.filter((c) => c.done).length * 10
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 200) + 1
}

export function getXPForNextLevel(level: number): number {
  return level * 200
}

export function getCurrentLevelXP(xp: number, level: number): number {
  return xp - (level - 1) * 200
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }
  return dates
}

export function getDayName(date: Date): string {
  const days = ["日", "月", "火", "水", "木", "金", "土"]
  return days[date.getDay()]
}

export function getMonthDay(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return formatDate(date) === formatDate(today)
}

export function getWeekStartDate(customStart?: Date): Date {
  const today = customStart || new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Monday start
  const monday = new Date(today)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function calculateStreak(checkins: Checkin[]): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let checkDate = new Date(today)
  
  // 今日から過去に遡って連続日数を計算
  while (true) {
    const dateStr = formatDate(checkDate)
    const hasCheckin = checkins.some((c) => c.date === dateStr && c.done)
    
    if (hasCheckin) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      // 今日にチェックがない場合は昨日から計算開始
      if (streak === 0 && formatDate(checkDate) === formatDate(today)) {
        checkDate.setDate(checkDate.getDate() - 1)
        continue
      }
      break
    }
  }
  
  return streak
}
