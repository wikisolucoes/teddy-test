import { BadRequestException } from '@nestjs/common';

export class Phone {
  private readonly value: string;
  private readonly hasCountryCode: boolean;

  constructor(phone: string) {
    const cleaned = this.clean(phone);
    
    this.hasCountryCode = cleaned.startsWith('55') && cleaned.length > 11;
    
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
    if (this.hasCountryCode) {
      return this.value.substring(2); // Remove '55' prefix
    }
    return this.value;
  }

  getFormattedValue(): string {
    const phoneDigits = this.hasCountryCode ? this.value.substring(2) : this.value;
    
    if (phoneDigits.length === 11) {
      const formatted = phoneDigits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      return this.hasCountryCode ? `+55 ${formatted}` : formatted;
    } else {
      const formatted = phoneDigits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      return this.hasCountryCode ? `+55 ${formatted}` : formatted;
    }
  }
}
