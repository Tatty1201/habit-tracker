// Badge definitions and evaluation logic
import { formatDate } from "./habit-store"

export interface Badge {
  id: string
  name: string
  desc: string
  icon: string
  category: "beginner" | "streak" | "level" | "habit" | "completion" | "special"
}

export const BADGES: Badge[] = [
  // Beginner badges (最初の一歩)
  { id: "first_checkin", name: "最初の一歩", desc: "初めてチェックを付けた", icon: "🎯", category: "beginner" },
  { id: "create_3_habits", name: "習慣コレクター", desc: "習慣を3つ作成した", icon: "📝", category: "beginner" },
  { id: "day_complete", name: "完璧な一日", desc: "今日、全習慣を達成した", icon: "⭐", category: "beginner" },
  { id: "level_2", name: "レベル2", desc: "レベル2に到達した", icon: "🎖️", category: "level" },

  // Level badges
  { id: "level_5", name: "レベル5", desc: "レベル5に到達した", icon: "🏅", category: "level" },
  { id: "level_10", name: "レベル10", desc: "レベル10に到達した", icon: "🎗️", category: "level" },
  { id: "level_15", name: "レベル15", desc: "レベル15に到達した", icon: "🏆", category: "level" },
  { id: "level_20", name: "レベル20", desc: "レベル20に到達した", icon: "👑", category: "level" },
  { id: "level_25", name: "レベル25", desc: "レベル25に到達した", icon: "💎", category: "level" },
  { id: "level_30", name: "レベル30", desc: "レベル30に到達した", icon: "⚡", category: "level" },
  { id: "level_50", name: "レベル50", desc: "レベル50に到達した", icon: "🌟", category: "level" },
  { id: "level_75", name: "レベル75", desc: "レベル75に到達した", icon: "🔥", category: "level" },
  { id: "level_100", name: "レベル100", desc: "レベル100に到達した", icon: "🚀", category: "level" },

  // Streak badges (連続記録)
  { id: "streak_3", name: "3日連続", desc: "3日連続で習慣を実行", icon: "🔗", category: "streak" },
  { id: "streak_7", name: "1週間連続", desc: "7日連続で習慣を実行", icon: "📅", category: "streak" },
  { id: "streak_14", name: "2週間連続", desc: "14日連続で習慣を実行", icon: "📆", category: "streak" },
  { id: "streak_30", name: "30日連続", desc: "30日連続で習慣を実行", icon: "🎊", category: "streak" },
  { id: "streak_50", name: "50日連続", desc: "50日連続で習慣を実行", icon: "🎉", category: "streak" },
  { id: "streak_100", name: "100日連続", desc: "100日連続で習慣を実行", icon: "💯", category: "streak" },
  { id: "streak_200", name: "200日連続", desc: "200日連続で習慣を実行", icon: "🌈", category: "streak" },
  { id: "streak_365", name: "1年連続", desc: "365日連続で習慣を実行", icon: "🎆", category: "streak" },
  { id: "streak_500", name: "500日連続", desc: "500日連続で習慣を実行", icon: "🏰", category: "streak" },
  { id: "streak_1000", name: "1000日連続", desc: "1000日連続で習慣を実行", icon: "🗿", category: "streak" },

  // Completion badges (達成数)
  { id: "check_10", name: "10チェック", desc: "累計10回チェックした", icon: "✅", category: "completion" },
  { id: "check_50", name: "50チェック", desc: "累計50回チェックした", icon: "☑️", category: "completion" },
  { id: "check_100", name: "100チェック", desc: "累計100回チェックした", icon: "✔️", category: "completion" },
  { id: "check_250", name: "250チェック", desc: "累計250回チェックした", icon: "💚", category: "completion" },
  { id: "check_500", name: "500チェック", desc: "累計500回チェックした", icon: "💙", category: "completion" },
  { id: "check_1000", name: "1000チェック", desc: "累計1000回チェックした", icon: "💜", category: "completion" },
  { id: "check_2000", name: "2000チェック", desc: "累計2000回チェックした", icon: "🖤", category: "completion" },
  { id: "check_5000", name: "5000チェック", desc: "累計5000回チェックした", icon: "🤍", category: "completion" },

  // Habit count badges
  { id: "habit_5", name: "習慣マスター", desc: "5つの習慣を管理", icon: "📚", category: "habit" },
  { id: "habit_10", name: "習慣の達人", desc: "10個の習慣を管理", icon: "📖", category: "habit" },
  { id: "habit_15", name: "習慣の賢者", desc: "15個の習慣を管理", icon: "🧙", category: "habit" },
  { id: "habit_20", name: "習慣の伝説", desc: "20個の習慣を管理", icon: "🦸", category: "habit" },

  // Perfect day badges
  { id: "perfect_7", name: "完璧な1週間", desc: "7日間、毎日全習慣達成", icon: "🌟", category: "completion" },
  { id: "perfect_30", name: "完璧な1ヶ月", desc: "30日間、毎日全習慣達成", icon: "✨", category: "completion" },
  { id: "perfect_100", name: "完璧な100日", desc: "100日間、毎日全習慣達成", icon: "🌠", category: "completion" },

  // Early bird / Night owl
  { id: "early_bird", name: "早起き", desc: "朝6時前にチェック", icon: "🌅", category: "special" },
  { id: "night_owl", name: "夜型", desc: "夜10時以降にチェック", icon: "🌙", category: "special" },

  // Comeback badges
  { id: "comeback", name: "カムバック", desc: "7日間の空白後、再開", icon: "🔄", category: "special" },
  { id: "never_give_up", name: "諦めない心", desc: "30日間の空白後、再開", icon: "💪", category: "special" },

  // Week completion
  { id: "monday_complete", name: "月曜の達人", desc: "月曜日に全習慣達成", icon: "📅", category: "completion" },
  { id: "friday_complete", name: "金曜の達人", desc: "金曜日に全習慣達成", icon: "🎉", category: "completion" },
  { id: "weekend_warrior", name: "週末の戦士", desc: "土日に全習慣達成", icon: "⚔️", category: "completion" },

  // Month completion
  { id: "january_complete", name: "1月マスター", desc: "1月、全日全習慣達成", icon: "🎍", category: "completion" },
  { id: "february_complete", name: "2月マスター", desc: "2月、全日全習慣達成", icon: "💝", category: "completion" },
  { id: "march_complete", name: "3月マスター", desc: "3月、全日全習慣達成", icon: "🌸", category: "completion" },
  { id: "april_complete", name: "4月マスター", desc: "4月、全日全習慣達成", icon: "🌷", category: "completion" },
  { id: "may_complete", name: "5月マスター", desc: "5月、全日全習慣達成", icon: "🎏", category: "completion" },
  { id: "june_complete", name: "6月マスター", desc: "6月、全日全習慣達成", icon: "☂️", category: "completion" },
  { id: "july_complete", name: "7月マスター", desc: "7月、全日全習慣達成", icon: "🎋", category: "completion" },
  { id: "august_complete", name: "8月マスター", desc: "8月、全日全習慣達成", icon: "🌻", category: "completion" },
  { id: "september_complete", name: "9月マスター", desc: "9月、全日全習慣達成", icon: "🍂", category: "completion" },
  { id: "october_complete", name: "10月マスター", desc: "10月、全日全習慣達成", icon: "🎃", category: "completion" },
  { id: "november_complete", name: "11月マスター", desc: "11月、全日全習慣達成", icon: "🍁", category: "completion" },
  { id: "december_complete", name: "12月マスター", desc: "12月、全日全習慣達成", icon: "🎄", category: "completion" },

  // Season completion
  { id: "spring_master", name: "春の覇者", desc: "春（3-5月）全日達成", icon: "🌺", category: "completion" },
  { id: "summer_master", name: "夏の覇者", desc: "夏（6-8月）全日達成", icon: "☀️", category: "completion" },
  { id: "autumn_master", name: "秋の覇者", desc: "秋（9-11月）全日達成", icon: "🍄", category: "completion" },
  { id: "winter_master", name: "冬の覇者", desc: "冬（12-2月）全日達成", icon: "⛄", category: "completion" },

  // Year completion
  { id: "year_2026_complete", name: "2026年制覇", desc: "2026年、全日全習慣達成", icon: "🎊", category: "completion" },
  { id: "year_2027_complete", name: "2027年制覇", desc: "2027年、全日全習慣達成", icon: "🎊", category: "completion" },

  // Special achievements
  { id: "triple_threat", name: "トリプルスレット", desc: "同時に3つの習慣をチェック", icon: "3️⃣", category: "special" },
  { id: "five_star", name: "ファイブスター", desc: "同時に5つの習慣をチェック", icon: "5️⃣", category: "special" },
  { id: "ten_power", name: "テンパワー", desc: "同時に10個の習慣をチェック", icon: "🔟", category: "special" },

  // Time-based
  { id: "morning_routine", name: "朝のルーティン", desc: "朝7時前に7日連続チェック", icon: "☕", category: "special" },
  { id: "lunch_warrior", name: "ランチタイム", desc: "昼12-13時に7日連続チェック", icon: "🍱", category: "special" },
  { id: "evening_ritual", name: "夕方の儀式", desc: "夕方17-19時に7日連続チェック", icon: "🌆", category: "special" },
  { id: "night_routine", name: "夜のルーティン", desc: "夜21-23時に7日連続チェック", icon: "🌃", category: "special" },

  // XP milestones
  { id: "xp_100", name: "XP 100", desc: "経験値100獲得", icon: "💠", category: "level" },
  { id: "xp_500", name: "XP 500", desc: "経験値500獲得", icon: "💎", category: "level" },
  { id: "xp_1000", name: "XP 1000", desc: "経験値1000獲得", icon: "💍", category: "level" },
  { id: "xp_5000", name: "XP 5000", desc: "経験値5000獲得", icon: "👑", category: "level" },
  { id: "xp_10000", name: "XP 10000", desc: "経験値10000獲得", icon: "🏰", category: "level" },

  // Consistency
  { id: "consistency_master", name: "継続の達人", desc: "30日間、毎日最低1つチェック", icon: "🎯", category: "streak" },
  { id: "dedication", name: "献身", desc: "60日間、毎日最低1つチェック", icon: "🙏", category: "streak" },
  { id: "commitment", name: "コミットメント", desc: "90日間、毎日最低1つチェック", icon: "🤝", category: "streak" },

  // Recovery
  { id: "bouncer", name: "復活", desc: "ストリークを3回途切れさせても諦めない", icon: "🔄", category: "special" },
  { id: "phoenix", name: "不死鳥", desc: "ストリークを5回途切れさせても諦めない", icon: "🦅", category: "special" },

  // Speed
  { id: "speed_demon", name: "スピード達成", desc: "朝6時台に全習慣チェック", icon: "⚡", category: "special" },
  { id: "quick_start", name: "クイックスタート", desc: "起床後1時間以内に全習慣チェック", icon: "🏃", category: "special" },

  // Social (future)
  { id: "team_player", name: "チームプレイヤー", desc: "友達を招待", icon: "👥", category: "special" },
  { id: "mentor", name: "メンター", desc: "3人の友達を招待", icon: "👨‍🏫", category: "special" },

  // Perfection
  { id: "perfectionist", name: "完璧主義者", desc: "14日連続で全習慣達成", icon: "💯", category: "completion" },
  { id: "flawless", name: "完全無欠", desc: "21日連続で全習慣達成", icon: "✨", category: "completion" },
  { id: "unstoppable", name: "無敵", desc: "30日連続で全習慣達成", icon: "🛡️", category: "completion" },

  // Variety
  { id: "variety_seeker", name: "バラエティ", desc: "5種類の習慣を作成", icon: "🎨", category: "habit" },
  { id: "jack_of_all", name: "万能", desc: "10種類の習慣を作成", icon: "🎭", category: "habit" },

  // Long term
  { id: "marathon_runner", name: "マラソンランナー", desc: "180日連続記録", icon: "🏃‍♂️", category: "streak" },
  { id: "iron_will", name: "鋼の意志", desc: "250日連続記録", icon: "🗡️", category: "streak" },
  { id: "legendary", name: "レジェンド", desc: "500日連続記録", icon: "🦁", category: "streak" },
  { id: "immortal", name: "不滅", desc: "730日連続記録", icon: "♾️", category: "streak" },
]

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id)
}

export function getBadgesByCategory(category: Badge["category"]): Badge[] {
  return BADGES.filter((b) => b.category === category)
}

// Badge evaluation logic
export interface EvaluationContext {
  habits: Array<{ id: string; name: string; isActive: boolean }>
  checkins: Array<{ date: string; habitId: string; done: boolean }>
  level: number
  xp: number
  streak: number
  currentUnlockedIds: string[]
}

export function evaluateBadges(context: EvaluationContext): string[] {
  const newBadgeIds: string[] = []
  const { habits, checkins, level, xp, streak, currentUnlockedIds } = context

  const isUnlocked = (id: string) => currentUnlockedIds.includes(id)
  const unlock = (id: string) => {
    if (!isUnlocked(id)) {
      newBadgeIds.push(id)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = formatDate(today)
  const activeHabits = habits.filter((h) => h.isActive)
  const totalChecks = checkins.filter((c) => c.done).length

  // first_checkin: 初めてチェックを付けた
  if (totalChecks >= 1) {
    unlock("first_checkin")
  }

  // day_complete: 今日、全習慣達成
  if (activeHabits.length > 0) {
    const todayChecks = checkins.filter((c) => c.date === todayStr && c.done)
    const todayCompleteCount = activeHabits.filter((h) =>
      todayChecks.some((c) => c.habitId === h.id)
    ).length
    if (todayCompleteCount === activeHabits.length) {
      unlock("day_complete")
    }
  }

  // create_3_habits: 習慣が3つ以上
  if (habits.length >= 3) {
    unlock("create_3_habits")
  }

  // level_2+: レベル到達
  if (level >= 2) unlock("level_2")
  if (level >= 5) unlock("level_5")
  if (level >= 10) unlock("level_10")
  if (level >= 15) unlock("level_15")
  if (level >= 20) unlock("level_20")
  if (level >= 25) unlock("level_25")
  if (level >= 30) unlock("level_30")
  if (level >= 50) unlock("level_50")
  if (level >= 75) unlock("level_75")
  if (level >= 100) unlock("level_100")

  // Streak badges
  if (streak >= 3) unlock("streak_3")
  if (streak >= 7) unlock("streak_7")
  if (streak >= 14) unlock("streak_14")
  if (streak >= 30) unlock("streak_30")
  if (streak >= 50) unlock("streak_50")
  if (streak >= 100) unlock("streak_100")
  if (streak >= 200) unlock("streak_200")
  if (streak >= 365) unlock("streak_365")
  if (streak >= 500) unlock("streak_500")
  if (streak >= 1000) unlock("streak_1000")
  if (streak >= 180) unlock("marathon_runner")
  if (streak >= 250) unlock("iron_will")
  if (streak >= 730) unlock("immortal")

  // Check count badges
  if (totalChecks >= 10) unlock("check_10")
  if (totalChecks >= 50) unlock("check_50")
  if (totalChecks >= 100) unlock("check_100")
  if (totalChecks >= 250) unlock("check_250")
  if (totalChecks >= 500) unlock("check_500")
  if (totalChecks >= 1000) unlock("check_1000")
  if (totalChecks >= 2000) unlock("check_2000")
  if (totalChecks >= 5000) unlock("check_5000")

  // Habit count badges
  if (habits.length >= 5) unlock("habit_5")
  if (habits.length >= 10) unlock("habit_10")
  if (habits.length >= 15) unlock("habit_15")
  if (habits.length >= 20) unlock("habit_20")

  // XP milestones
  if (xp >= 100) unlock("xp_100")
  if (xp >= 500) unlock("xp_500")
  if (xp >= 1000) unlock("xp_1000")
  if (xp >= 5000) unlock("xp_5000")
  if (xp >= 10000) unlock("xp_10000")

  // Perfect day streaks
  const perfectDayStreak = calculatePerfectDayStreak(habits, checkins)
  if (perfectDayStreak >= 7) unlock("perfect_7")
  if (perfectDayStreak >= 14) unlock("perfectionist")
  if (perfectDayStreak >= 21) unlock("flawless")
  if (perfectDayStreak >= 30) {
    unlock("perfect_30")
    unlock("unstoppable")
  }
  if (perfectDayStreak >= 100) unlock("perfect_100")

  // Day of week completion
  const dayOfWeek = today.getDay()
  if (todayCompleteCount === activeHabits.length && activeHabits.length > 0) {
    if (dayOfWeek === 1) unlock("monday_complete")
    if (dayOfWeek === 5) unlock("friday_complete")
    if (dayOfWeek === 0 || dayOfWeek === 6) unlock("weekend_warrior")
  }

  // Consistency badges (毎日最低1つチェック)
  const dailyStreak = calculateDailyStreak(checkins)
  if (dailyStreak >= 30) unlock("consistency_master")
  if (dailyStreak >= 60) unlock("dedication")
  if (dailyStreak >= 90) unlock("commitment")

  // Triple threat and more (同時チェック)
  if (activeHabits.length >= 3 && todayCompleteCount >= 3) unlock("triple_threat")
  if (activeHabits.length >= 5 && todayCompleteCount >= 5) unlock("five_star")
  if (activeHabits.length >= 10 && todayCompleteCount >= 10) unlock("ten_power")

  return newBadgeIds
}

// 完璧な日の連続記録を計算
function calculatePerfectDayStreak(
  habits: Array<{ id: string; isActive: boolean }>,
  checkins: Array<{ date: string; habitId: string; done: boolean }>
): number {
  const activeHabits = habits.filter((h) => h.isActive)
  if (activeHabits.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streak = 0
  let checkDate = new Date(today)

  while (true) {
    const dateStr = formatDate(checkDate)
    const dayChecks = checkins.filter((c) => c.date === dateStr && c.done)
    const completedHabits = activeHabits.filter((h) => dayChecks.some((c) => c.habitId === h.id))

    if (completedHabits.length === activeHabits.length) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      // 今日完了してない場合は昨日から計算
      if (streak === 0 && dateStr === formatDate(today)) {
        checkDate.setDate(checkDate.getDate() - 1)
        continue
      }
      break
    }
  }

  return streak
}

// 毎日最低1つチェックの連続記録
function calculateDailyStreak(checkins: Array<{ date: string; done: boolean }>): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streak = 0
  let checkDate = new Date(today)

  while (true) {
    const dateStr = formatDate(checkDate)
    const hasCheckin = checkins.some((c) => c.date === dateStr && c.done)

    if (hasCheckin) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      if (streak === 0 && dateStr === formatDate(today)) {
        checkDate.setDate(checkDate.getDate() - 1)
        continue
      }
      break
    }
  }

  return streak
}
