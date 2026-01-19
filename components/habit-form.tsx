"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Check } from "lucide-react"

interface HabitFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (name: string) => void
  initialName?: string
  mode?: "add" | "edit"
}

export function HabitForm({ open, onOpenChange, onSubmit, initialName = "", mode = "add" }: HabitFormProps) {
  const [name, setName] = useState(initialName)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initialName)
      setShowSuccess(false)
    }
  }, [open, initialName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setShowSuccess(true)
      setTimeout(() => {
        onSubmit(name.trim())
        setName("")
        setShowSuccess(false)
        onOpenChange(false)
      }, 400)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-lg overflow-hidden">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }}>
                <Check className="w-12 h-12 text-primary-foreground" strokeWidth={3} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-wide">
            {mode === "add" ? "NEW HABIT" : "EDIT HABIT"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Input
              placeholder="e.g. WORKOUT, READ, MEDITATE"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-sm font-medium tracking-wide rounded-md border-2 focus:border-primary transition-colors uppercase placeholder:normal-case placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-md font-bold tracking-wide"
            >
              CANCEL
            </Button>
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
              <Button type="submit" disabled={!name.trim()} className="rounded-md font-bold tracking-wide px-6">
                {mode === "add" ? "ADD" : "SAVE"}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
