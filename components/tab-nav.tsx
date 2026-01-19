"use client"

import { motion } from "framer-motion"
import { Home, ListTodo, User } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "home" | "habits" | "profile"

interface TabNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const tabs = [
    { id: "home" as Tab, label: "HOME", icon: Home },
    { id: "habits" as Tab, label: "HABITS", icon: ListTodo },
    { id: "profile" as Tab, label: "PROFILE", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 w-20 py-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              aria-label={tab.label}
            >
              {isActive && (
                <motion.div
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary"
                  layoutId="activeTab"
                  transition={{ duration: 0.2 }}
                />
              )}

              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold tracking-wider">{tab.label}</span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
