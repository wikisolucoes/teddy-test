import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Label,
  clientFormSchema,
  type ClientFormData,
} from '@teddy-monorepo/web/shared';
import { maskCPF, maskPhone } from '@teddy-monorepo/web/shared';
import { useState } from 'react';
import type {
  ClientResponseDto,
  CreateClientDto,
  UpdateClientDto,
} from '../../../application/dtos/client.dto';

interface ClientFormProps {
  initialData?: ClientResponseDto;
  onSubmit: (data: CreateClientDto | UpdateClientDto) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function ClientForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
  isSubmitting = false,
}: ClientFormProps) {
  const [cpfDisplay, setCpfDisplay] = useState(
    initialData ? maskCPF(initialData.cpf) : ''
  );
  const [phoneDisplay, setPhoneDisplay] = useState(
    initialData ? maskPhone(initialData.phone) : ''
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          cpf: initialData.cpf,
          phone: initialData.phone,
        }
      : undefined,
  });

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskCPF(e.target.value);
    setCpfDisplay(formatted);
    setValue('cpf', formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskPhone(e.target.value);
    setPhoneDisplay(formatted);
    setValue('phone', formatted);
  };

  const onFormSubmit = async (data: ClientFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Digite o nome"
          {...register('name')}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Digite o email"
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          placeholder="XXX.XXX.XXX-XX"
          value={cpfDisplay}
          onChange={handleCpfChange}
          disabled={isSubmitting}
        />
        {errors.cpf && (
          <p className="text-sm text-red-500">{errors.cpf.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="(XX) XXXXX-XXXX"
          value={phoneDisplay}
          onChange={handlePhoneChange}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          className="flex-1 bg-orange-500 hover:bg-orange-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
