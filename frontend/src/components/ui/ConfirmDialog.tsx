import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Smazat',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600">{message}</p>
          <div className="flex gap-3 mt-5 justify-end">
            <button className="btn-secondary" onClick={onClose} disabled={isLoading}>
              Zrušit
            </button>
            <button className="btn-danger" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? 'Mazání...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
