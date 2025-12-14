/**
 * ConfirmDeleteDialog Component - Modal de confirmação de exclusão
 * Seguindo design-prompt.md
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Button,
} from '@teddy-monorepo/web/shared';
import { X } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

/**
 * Modal de confirmação para exclusão de cliente
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  clientName,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Excluir cliente:</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <p className="text-sm text-muted-foreground">
            Você está prestes a excluir o cliente: <span className="font-semibold">{clientName}</span>
          </p>
          <Button
            onClick={handleConfirm}
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir cliente'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
