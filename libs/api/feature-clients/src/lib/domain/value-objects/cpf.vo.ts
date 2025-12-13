import { BadRequestException } from '@nestjs/common';

export class CPF {
  private readonly value: string;

  constructor(cpf: string) {
    const cleaned = this.clean(cpf);
    
    if (!this.isValid(cleaned)) {
      throw new BadRequestException('Invalid CPF');
    }
    
    this.value = cleaned;
  }

  private clean(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  private isValid(cpf: string): boolean {
    if (cpf.length !== 11) {
      return false;
    }

    const invalidCPFs = [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999',
    ];

    if (invalidCPFs.includes(cpf)) {
      return false;
    }

    // Validate first verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) {
      return false;
    }

    // Validate second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) {
      return false;
    }

    return true;
  }

  getValue(): string {
    return this.value;
  }

  getFormattedValue(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
