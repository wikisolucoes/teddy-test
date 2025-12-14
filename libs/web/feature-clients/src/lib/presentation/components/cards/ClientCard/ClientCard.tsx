/**
 * ClientCard Component - Card individual de cliente
 * Seguindo design-prompt.md: Nome, Salário, Empresa e Ações
 */

import { Card, CardContent, Button } from '@teddy-monorepo/web/shared';
import { formatCurrency } from '@teddy-monorepo/web/shared';
import { Plus, Pencil, Trash, Minus } from 'lucide-react';
import type { ClientResponseDto } from '../../../application/dtos/client.dto';

interface ClientCardProps {
  client: ClientResponseDto;
  onEdit: (client: ClientResponseDto) => void;
  onDelete: (id: string) => void;
  onToggleSelect: (client: ClientResponseDto) => void;
  isSelected: boolean;
  variant?: 'normal' | 'selected';
}

/**
 * Card de cliente com informações e ações
 */
export function ClientCard({
  client,
  onEdit,
  onDelete,
  onToggleSelect,
  isSelected,
  variant = 'normal',
}: ClientCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Nome */}
          <h3 className="font-semibold text-lg">{client.name}</h3>

          {/* Informações */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Salário: {formatCurrency(client.salary)}
            </p>
            <p className="text-sm text-muted-foreground">
              Empresa: {formatCurrency(client.companyValuation)}
            </p>
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-2">
            {variant === 'normal' ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleSelect(client)}
                  title={isSelected ? 'Remover da seleção' : 'Adicionar à seleção'}
                >
                  <Plus className={isSelected ? 'text-orange-500' : ''} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(client)}
                  title="Editar cliente"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(client.id)}
                  title="Excluir cliente"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleSelect(client)}
                title="Remover da seleção"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
