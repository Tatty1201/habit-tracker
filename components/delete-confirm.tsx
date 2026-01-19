"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  habitName: string
}

export function DeleteConfirm({ open, onOpenChange, onConfirm, habitName }: DeleteConfirmProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold tracking-wide">DELETE HABIT?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Deleting "{habitName.toUpperCase()}" will remove all check-in history. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-bold tracking-wide">CANCEL</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold tracking-wide"
          >
            DELETE
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
