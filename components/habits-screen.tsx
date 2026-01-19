"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HabitForm } from "@/components/habit-form"
import { DeleteConfirm } from "@/components/delete-confirm"
import type { Habit } from "@/lib/habit-store"

interface HabitsScreenProps {
  habits: Habit[]
  onAdd: (name: string) => void
  onEdit: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function HabitsScreen({ habits, onAdd, onEdit, onDelete }: HabitsScreenProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  const handleEditClick = (habit: Habit) => {
    setSelectedHabit(habit)
    setEditOpen(true)
  }

  const handleDeleteClick = (habit: Habit) => {
    setSelectedHabit(habit)
    setDeleteOpen(true)
  }

  const handleEdit = (name: string) => {
    if (selectedHabit) {
      onEdit(selectedHabit.id, name)
      setSelectedHabit(null)
    }
  }

  const handleDelete = () => {
    if (selectedHabit) {
      onDelete(selectedHabit.id)
      setSelectedHabit(null)
      setDeleteOpen(false)
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tighter">HABITS</h1>
            <Button size="sm" onClick={() => setAddOpen(true)} className="font-bold tracking-wide">
              <Plus className="w-4 h-4 mr-1" />
              ADD
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-2">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/30 rounded-lg mb-6" />
            <h3 className="text-xl font-bold tracking-tight mb-2">NO HABITS</h3>
            <p className="text-muted-foreground text-sm tracking-wide mb-6">START BUILDING YOUR ROUTINE</p>
            <Button onClick={() => setAddOpen(true)} className="font-bold tracking-wide">
              <Plus className="w-4 h-4 mr-2" />
              ADD HABIT
            </Button>
          </div>
        ) : (
          habits.map((habit) => (
            <motion.div key={habit.id} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
              <Card className="p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold tracking-wide uppercase">{habit.name}</h3>
                    <p className="text-[10px] text-muted-foreground tracking-wider">
                      {habit.createdAt.toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditClick(habit)}
                      aria-label={`${habit.name}を編集`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(habit)}
                      aria-label={`${habit.name}を削除`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </main>

      {/* Dialogs */}
      <HabitForm open={addOpen} onOpenChange={setAddOpen} onSubmit={onAdd} mode="add" />

      <HabitForm
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        initialName={selectedHabit?.name || ""}
        mode="edit"
      />

      <DeleteConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        habitName={selectedHabit?.name || ""}
      />
    </div>
  )
}
