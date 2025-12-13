import { BadRequestException } from '@nestjs/common';

export class Phone {
  private readonly value: string;

  constructor(phone: string) {
    const cleaned = this.clean(phone);
    
    if (!this.isValid(cleaned)) {
      throw new BadRequestException('Invalid phone number');
    }
    
    this.value = cleaned;
  }

  private clean(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  /**
   * Validate Brazilian phone number
   */
  private isValid(phone: string): boolean {
    // Remove country code if present (55)
    let phoneDigits = phone;
    if (phone.startsWith('55') && phone.length > 11) {
      phoneDigits = phone.substring(2);
    }

    if (phoneDigits.length !== 10 && phoneDigits.length !== 11) {
      return false;
    }

    const ddd = parseInt(phoneDigits.substring(0, 2));
    
    // Valid Brazilian DDDs (11-99)
    if (ddd < 11 || ddd > 99) {
      return false;
    }

    // Mobile numbers must have 11 digits and start with 9
    if (phoneDigits.length === 11) {
      const firstDigit = phoneDigits.charAt(2);
      if (firstDigit !== '9') {
        return false;
      }
    }

    return true;
  }

  getValue(): string {
    return this.value;
  }

  getFormattedValue(): string {
    if (this.value.length === 11) {
      return this.value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'); // Mobile: (XX) XXXXX-XXXX
    } else {
      return this.value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'); // Landline: (XX) XXXX-XXXX
    }
  }
}
