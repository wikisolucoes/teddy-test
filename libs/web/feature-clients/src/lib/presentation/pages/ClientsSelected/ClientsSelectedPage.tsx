/**
 * ClientsSelectedPage - Tela de clientes selecionados
 * Permite visualizar e remover clientes da seleção
 */

import { Button, useToast } from '@teddy-monorepo/web/shared';
import { Header } from '../../components/layout/Header';
import { ClientCard } from '../../components/cards/ClientCard';
import { useSelectedClients } from '../../hooks/useSelectedClients';
import { Trash2 } from 'lucide-react';

/**
 * Página de clientes selecionados
 * Mostra clientes salvos no localStorage com opção de remover
 */
export function ClientsSelectedPage() {
  const { toast } = useToast();
  const { selectedClients, removeClient, clearAll, isSelected } = useSelectedClients();

  const handleRemove = (id: string) => {
    removeClient(id);
    toast({ title: 'Cliente removido da seleção' });
  };

  const handleClearAll = () => {
    clearAll();
    toast({ title: 'Todos os clientes foram removidos da seleção' });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Clientes selecionados</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedClients.length}{' '}
              {selectedClients.length === 1 ? 'cliente selecionado' : 'clientes selecionados'}
            </p>
          </div>

          {selectedClients.length > 0 && (
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              onClick={handleClearAll}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar clientes selecionados
            </Button>
          )}
        </div>

        {/* Grid de clientes selecionados */}
        {selectedClients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum cliente selecionado</p>
            <p className="text-sm text-muted-foreground mt-2">
              Volte para a página de clientes e clique no ícone "+" para adicionar clientes à seleção
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={() => undefined} // Não permite editar direto da página de selecionados
                onDelete={() => undefined} // Não permite deletar direto da página de selecionados
                onToggleSelect={handleRemove}
                isSelected={isSelected(client.id)}
                variant="selected"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
