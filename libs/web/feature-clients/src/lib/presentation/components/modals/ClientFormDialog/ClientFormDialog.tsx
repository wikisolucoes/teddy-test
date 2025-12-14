/**
 * ClientFormDialog Component - Modal reutilizável para criar/editar cliente
 * Seguindo design-prompt.md
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@teddy-monorepo/web/shared';
import { ClientForm } from '../../forms/ClientForm';
import type {
  ClientResponseDto,
  CreateClientDto,
  UpdateClientDto,
} from '../../../../application/dtos/client.dto';

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  client?: ClientResponseDto;
  onSubmit: (data: CreateClientDto | UpdateClientDto) => Promise<void>;
  isSubmitting?: boolean;
}

/**
 * Modal para criar ou editar cliente
 */
export function ClientFormDialog({
  open,
  onOpenChange,
  mode,
  client,
  onSubmit,
  isSubmitting = false,
}: ClientFormDialogProps) {
  const title = mode === 'create' ? 'Criar cliente' : 'Editar cliente';
  const submitLabel = mode === 'create' ? 'Criar cliente' : 'Editar cliente';

  const handleSubmit = async (data: CreateClientDto | UpdateClientDto) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ClientForm
            initialData={client}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            submitLabel={submitLabel}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
