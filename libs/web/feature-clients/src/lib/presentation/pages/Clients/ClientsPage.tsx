import { useState } from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Alert,
  useToast,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@teddy-monorepo/web/shared';
import { Header } from '@teddy-monorepo/web/shared';
import { useAuth } from '@teddy-monorepo/web/feature-auth';
import { ClientCard } from '../../components/cards/ClientCard';
import { ClientFormDialog } from '../../components/modals/ClientFormDialog';
import { ConfirmDeleteDialog } from '../../components/modals/ConfirmDeleteDialog';
import { useClients } from '../../hooks/useClients';
import { useSelectedClients } from '../../hooks/useSelectedClients';
import type {
  ClientResponseDto,
  CreateClientDto,
  UpdateClientDto,
} from '../../../application/dtos/client.dto';

export function ClientsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const {
    clients,
    loading,
    error,
    page,
    limit,
    totalPages,
    total,
    setPage,
    setLimit,
    createClient,
    updateClient,
    deleteClient,
    refetch,
  } = useClients();

  const { addClient, removeClient, isSelected } = useSelectedClients();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingClient, setEditingClient] = useState<ClientResponseDto | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState<ClientResponseDto | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setFormMode('create');
    setEditingClient(undefined);
    setFormDialogOpen(true);
  };

  const handleEdit = (client: ClientResponseDto) => {
    setFormMode('edit');
    setEditingClient(client);
    setFormDialogOpen(true);
  };

  const handleDelete = (client: ClientResponseDto) => {
    setDeletingClient(client);
    setDeleteDialogOpen(true);
  };

  const handleToggleSelect = (client: ClientResponseDto) => {
    if (isSelected(client.id)) {
      removeClient(client.id);
      toast({ title: 'Cliente removido da seleção' });
    } else {
      addClient(client);
      toast({ title: 'Cliente adicionado à seleção' });
    }
  };

  const handleFormSubmit = async (data: CreateClientDto | UpdateClientDto) => {
    setIsSubmitting(true);
    try {
      if (formMode === 'create') {
        await createClient(data as CreateClientDto);
        toast({ title: 'Cliente criado com sucesso!' });
      } else if (editingClient) {
        await updateClient(editingClient.id, data);
        toast({ title: 'Cliente atualizado com sucesso!' });
      }
    } catch (error) {
      toast({
        title: 'Erro ao salvar cliente',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingClient) return;

    setIsSubmitting(true);
    try {
      await deleteClient(deletingClient.id);
      toast({ title: 'Cliente excluído com sucesso!' });
    } catch (error) {
      toast({
        title: 'Erro ao excluir cliente',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPagination = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (page > 3) {
        pages.push('ellipsis');
      }
      
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      pages.push(totalPages);
    }

    return pages;
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header userName={user?.name} onLogout={logout} />
        <div className="container mx-auto px-4 py-6">
          <Alert variant="destructive">
            <p className="font-semibold">Erro ao carregar clientes</p>
            <p className="text-sm mt-1">{error}</p>
          </Alert>
          <Button onClick={refetch} variant="outline" className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header userName={user?.name} onLogout={logout} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-medium">
            {total} clientes encontrados:
          </p>
          <Select
            value={limit.toString()}
            onValueChange={(v) => setLimit(Number(v))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Clientes por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de clientes */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={handleEdit}
                onDelete={() => handleDelete(client)}
                onToggleSelect={handleToggleSelect}
                isSelected={isSelected(client.id)}
              />
            ))}
          </div>
        )}

        {/* Botão criar cliente */}
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
            onClick={handleCreate}
          >
            Criar cliente
          </Button>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {renderPagination().map((p, i) =>
                  p === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        onClick={() => setPage(p)}
                        isActive={page === p}
                        className={page === p ? 'bg-orange-500 text-white hover:bg-orange-600' : 'cursor-pointer'}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modais */}
      <ClientFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        mode={formMode}
        client={editingClient}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        clientName={deletingClient?.name || ''}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
