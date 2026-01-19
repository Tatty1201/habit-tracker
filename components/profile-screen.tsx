"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XPBar } from "@/components/xp-bar"
import { BADGES, getBadgeById } from "@/lib/badges"
import { cn } from "@/lib/utils"

interface ProfileScreenProps {
  xp: number
  level: number
  streak: number
  unlockedBadgeIds: string[]
  equippedTitleBadgeId: string | null
  onEquipTitle: (badgeId: string | null) => void
}

export function ProfileScreen({
  xp,
  level,
  streak,
  unlockedBadgeIds,
  equippedTitleBadgeId,
  onEquipTitle,
}: ProfileScreenProps) {

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-black tracking-tighter">PROFILE</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* XP Card */}
        <Card className="p-6 rounded-lg">
          <XPBar xp={xp} level={level} size="lg" />
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <motion.div
            className="p-5 rounded-lg bg-card border border-border"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
          >
            <div className="text-xs text-muted-foreground font-bold tracking-widest mb-1">CHECKS</div>
            <div className="text-4xl font-black">{Math.floor(xp / 10)}</div>
          </motion.div>
          <motion.div
            className="p-5 rounded-lg bg-card border border-border"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
          >
            <div className="text-xs text-muted-foreground font-bold tracking-widest mb-1">STREAK</div>
            <div className="text-4xl font-black">{streak}</div>
          </motion.div>
        </div>

        {/* Badges */}
        <Card className="p-5 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-muted-foreground font-bold tracking-widest">
              BADGES ({unlockedBadgeIds.length}/{BADGES.length})
            </div>
          </div>
          {unlockedBadgeIds.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">バッジを獲得しましょう！</p>
              <p className="text-xs text-muted-foreground mt-2">習慣をチェックして実績を解除</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto">
              {unlockedBadgeIds.map((badgeId) => {
                const badge = getBadgeById(badgeId)
                if (!badge) return null
                const isEquipped = equippedTitleBadgeId === badgeId

                return (
                  <motion.div
                    key={badgeId}
                    className={cn(
                      "relative aspect-square rounded-lg flex flex-col items-center justify-center p-2 cursor-pointer transition-all",
                      "bg-gradient-to-br from-primary/20 to-primary/10 border-2",
                      isEquipped ? "border-primary ring-2 ring-primary/50" : "border-primary/30 hover:border-primary/50"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEquipTitle(isEquipped ? null : badgeId)}
                    title={`${badge.name}: ${badge.desc}`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    {isEquipped && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
          {unlockedBadgeIds.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                💡 バッジをタップして称号として装備できます
                {equippedTitleBadgeId && " | 🟢 装備中"}
              </p>
              {equippedTitleBadgeId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs"
                  onClick={() => onEquipTitle(null)}
                >
                  称号を外す
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Locked Badges Preview */}
        {BADGES.length - unlockedBadgeIds.length > 0 && (
          <Card className="p-5 rounded-lg">
            <div className="text-xs text-muted-foreground font-bold tracking-widest mb-4">
              未獲得バッジ
            </div>
            <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
              {BADGES.filter((b) => !unlockedBadgeIds.includes(b.id))
                .slice(0, 30)
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="aspect-square rounded-md bg-secondary/30 flex items-center justify-center opacity-40"
                    title={`${badge.name}: ${badge.desc}`}
                  >
                    <div className="text-lg grayscale">{badge.icon}</div>
                  </div>
                ))}
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">
                まだ {BADGES.length - unlockedBadgeIds.length} 個のバッジが獲得可能
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
