import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Trash2, AlertTriangle } from "lucide-react"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  fileName: string
  fileSize: string
}

export function DeleteDialog({ open, onOpenChange, onConfirm, fileName, fileSize }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-clover-border-card bg-clover-bg-card sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clover-cat-video/10 text-clover-cat-video">
            <AlertTriangle size={24} />
          </div>
          <div>
            <DialogTitle className="font-syne text-xl font-bold text-clover-text-primary">
              Mover para a Lixeira?
            </DialogTitle>
            <DialogDescription className="mt-2 font-syne text-clover-text-muted">
              Você está prestes a apagar <span className="text-clover-text-primary font-bold">{fileName}</span> ({fileSize}). 
              Essa ação pode ser desfeita na Lixeira do macOS.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-3 sm:justify-center">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 font-syne text-clover-text-muted hover:bg-clover-bg-hover hover:text-clover-text-primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="flex-1 bg-clover-cat-video font-syne font-bold text-white hover:bg-clover-cat-video/80"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Apagar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
