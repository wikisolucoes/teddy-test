import { BadRequestException } from '@nestjs/common';
import { Phone } from './phone.vo.js';

describe('Phone Value Object', () => {
  describe('Valid Mobile Phones', () => {
    it('should accept valid mobile phone with formatting', () => {
      const phone = new Phone('(11) 98765-4321');
      expect(phone.getValue()).toBe('11987654321');
      expect(phone.getFormattedValue()).toBe('(11) 98765-4321');
    });

    it('should accept valid mobile phone without formatting', () => {
      const phone = new Phone('11987654321');
      expect(phone.getValue()).toBe('11987654321');
      expect(phone.getFormattedValue()).toBe('(11) 98765-4321');
    });

    it('should accept mobile phone with country code', () => {
      const phone = new Phone('5511987654321');
      expect(phone.getValue()).toBe('11987654321'); // getValue() strips country code for storage
      expect(phone.getFormattedValue()).toBe('+55 (11) 98765-4321'); // getFormattedValue() preserves country code for display
    });

    it('should accept mobile phone from different DDD', () => {
      const phone = new Phone('21999887766');
      expect(phone.getValue()).toBe('21999887766');
      expect(phone.getFormattedValue()).toBe('(21) 99988-7766');
    });

    it('should accept mobile phone with mixed characters', () => {
      const phone = new Phone('11-98765-4321');
      expect(phone.getValue()).toBe('11987654321');
    });
  });

  describe('Valid Landline Phones', () => {
    it('should accept valid landline phone with formatting', () => {
      const phone = new Phone('(11) 3456-7890');
      expect(phone.getValue()).toBe('1134567890');
      expect(phone.getFormattedValue()).toBe('(11) 3456-7890');
    });

    it('should accept valid landline phone without formatting', () => {
      const phone = new Phone('1134567890');
      expect(phone.getValue()).toBe('1134567890');
      expect(phone.getFormattedValue()).toBe('(11) 3456-7890');
    });

    it('should accept landline phone from different DDD', () => {
      const phone = new Phone('2133334444');
      expect(phone.getValue()).toBe('2133334444');
      expect(phone.getFormattedValue()).toBe('(21) 3333-4444');
    });
  });

  describe('Invalid Phones', () => {
    it('should reject phone with invalid DDD (< 11)', () => {
      expect(() => new Phone('1098765432')).toThrow(BadRequestException);
      expect(() => new Phone('1098765432')).toThrow('Invalid phone number');
    });

    it('should reject phone with invalid DDD (> 99)', () => {
      expect(() => new Phone('991234567890')).toThrow(BadRequestException);
    });

    it('should reject phone with DDD 00', () => {
      expect(() => new Phone('0034567890')).toThrow(BadRequestException);
    });

    it('should reject phone with less than 10 digits', () => {
      expect(() => new Phone('119876543')).toThrow(BadRequestException);
    });

    it('should reject phone with more than 11 digits', () => {
      expect(() => new Phone('119876543210')).toThrow(BadRequestException);
    });

    it('should reject mobile phone not starting with 9', () => {
      expect(() => new Phone('11887654321')).toThrow(BadRequestException);
      expect(() => new Phone('11787654321')).toThrow(BadRequestException);
    });

    it('should reject empty phone', () => {
      expect(() => new Phone('')).toThrow(BadRequestException);
    });

    it('should reject phone with only special characters', () => {
      expect(() => new Phone('() -')).toThrow(BadRequestException);
    });

    it('should reject phone with letters', () => {
      expect(() => new Phone('11-9876-543A')).toThrow(BadRequestException);
    });
  });

  describe('Formatting', () => {
    it('should format mobile phone correctly', () => {
      const phone = new Phone('11987654321');
      expect(phone.getFormattedValue()).toBe('(11) 98765-4321');
    });

    it('should format landline phone correctly', () => {
      const phone = new Phone('1134567890');
      expect(phone.getFormattedValue()).toBe('(11) 3456-7890');
    });

    it('should keep internal value unformatted', () => {
      const phone = new Phone('(11) 98765-4321');
      expect(phone.getValue()).toBe('11987654321');
      expect(phone.getValue()).not.toContain('(');
      expect(phone.getValue()).not.toContain(')');
      expect(phone.getValue()).not.toContain(' ');
      expect(phone.getValue()).not.toContain('-');
    });
  });

  describe('Edge Cases', () => {
    it('should handle phone with spaces', () => {
      const phone = new Phone('11 98765 4321');
      expect(phone.getValue()).toBe('11987654321');
    });

    it('should handle phone with multiple special characters', () => {
      const phone = new Phone('11...987...654...321');
      expect(phone.getValue()).toBe('11987654321');
    });

    it('should strip country code from mobile and validate correctly', () => {
      const phone = new Phone('+55 11 98765-4321');
      // getValue() returns without country code (for storage)
      expect(phone.getValue()).toBe('11987654321');
      expect(phone.getValue()).toHaveLength(11);
      // getFormattedValue() preserves country code (for display)
      expect(phone.getFormattedValue()).toBe('+55 (11) 98765-4321');
    });

    it('should strip country code from landline and validate correctly', () => {
      const phone = new Phone('55 11 3456-7890');
      // getValue() returns without country code (for storage)
      expect(phone.getValue()).toBe('1134567890');
      expect(phone.getValue()).toHaveLength(10);
      // getFormattedValue() preserves country code (for display)
      expect(phone.getFormattedValue()).toBe('+55 (11) 3456-7890');
    });
  });

  describe('DDD Validation', () => {
    it('should accept all valid Brazilian DDDs (11-99)', () => {
      const validDDDs = [11, 21, 27, 31, 47, 51, 61, 85, 99];
      
      validDDDs.forEach(ddd => {
        const phone = new Phone(`${ddd}987654321`);
        expect(phone.getValue()).toBe(`${ddd}987654321`);
      });
    });

    it('should reject DDD 10', () => {
      expect(() => new Phone('10987654321')).toThrow(BadRequestException);
    });

    it('should reject three-digit DDD', () => {
      expect(() => new Phone('100987654321')).toThrow(BadRequestException);
    });
  });

  describe('Immutability (DDD)', () => {
    it('should be immutable - value cannot be changed externally', () => {
      const phone = new Phone('(11) 98765-4321');
      const value1 = phone.getValue();
      const value2 = phone.getValue();
      
      expect(value1).toBe(value2);
      expect(value1).toBe('11987654321');
    });

    it('should return same formatted value on multiple calls', () => {
      const phone = new Phone('11987654321');
      const formatted1 = phone.getFormattedValue();
      const formatted2 = phone.getFormattedValue();
      
      expect(formatted1).toBe(formatted2);
      expect(formatted1).toBe('(11) 98765-4321');
    });
  });
});
