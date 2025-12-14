/**
 * ClientForm Component - Formulário de cliente
 * Usa react-hook-form + Zod para validação
 * Inclui máscaras de moeda
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Label,
  clientFormSchema,
  type ClientFormData,
} from '@teddy-monorepo/web/shared';
import { maskCurrency, unformatCurrency } from '@teddy-monorepo/web/shared';
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

/**
 * Formulário de cliente com validação e máscaras
 */
export function ClientForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
  isSubmitting = false,
}: ClientFormProps) {
  const [salaryDisplay, setSalaryDisplay] = useState(
    initialData ? maskCurrency(initialData.salary.toString()) : ''
  );
  const [companyDisplay, setCompanyDisplay] = useState(
    initialData ? maskCurrency(initialData.companyValuation.toString()) : ''
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
          salary: initialData.salary,
          companyValuation: initialData.companyValuation,
        }
      : undefined,
  });

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskCurrency(e.target.value);
    setSalaryDisplay(formatted);
    setValue('salary', unformatCurrency(formatted));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskCurrency(e.target.value);
    setCompanyDisplay(formatted);
    setValue('companyValuation', unformatCurrency(formatted));
  };

  const onFormSubmit = async (data: ClientFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Nome */}
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

      {/* Salário */}
      <div className="space-y-2">
        <Label htmlFor="salary">Salário</Label>
        <Input
          id="salary"
          placeholder="Digite o salário"
          value={salaryDisplay}
          onChange={handleSalaryChange}
          disabled={isSubmitting}
        />
        {errors.salary && (
          <p className="text-sm text-red-500">{errors.salary.message}</p>
        )}
      </div>

      {/* Valor da empresa */}
      <div className="space-y-2">
        <Label htmlFor="companyValuation">Valor da empresa</Label>
        <Input
          id="companyValuation"
          placeholder="Digite o valor da empresa"
          value={companyDisplay}
          onChange={handleCompanyChange}
          disabled={isSubmitting}
        />
        {errors.companyValuation && (
          <p className="text-sm text-red-500">
            {errors.companyValuation.message}
          </p>
        )}
      </div>

      {/* Botões */}
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
