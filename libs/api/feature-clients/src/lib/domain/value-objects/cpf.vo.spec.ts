import { BadRequestException } from '@nestjs/common';
import { CPF } from './cpf.vo.js';

describe('CPF Value Object', () => {
  describe('Valid CPFs', () => {
    it('should accept valid CPF with formatting', () => {
      const cpf = new CPF('123.456.789-09');
      expect(cpf.getValue()).toBe('12345678909');
      expect(cpf.getFormattedValue()).toBe('123.456.789-09');
    });

    it('should accept valid CPF without formatting', () => {
      const cpf = new CPF('12345678909');
      expect(cpf.getValue()).toBe('12345678909');
      expect(cpf.getFormattedValue()).toBe('123.456.789-09');
    });

    it('should accept valid CPF with mixed characters', () => {
      const cpf = new CPF('123-456-789/09');
      expect(cpf.getValue()).toBe('12345678909');
    });

    it('should accept another valid CPF', () => {
      const cpf = new CPF('111.444.777-35');
      expect(cpf.getValue()).toBe('11144477735');
      expect(cpf.getFormattedValue()).toBe('111.444.777-35');
    });
  });

  describe('Invalid CPFs', () => {
    it('should reject CPF with wrong checksum', () => {
      expect(() => new CPF('12345678900')).toThrow(BadRequestException);
      expect(() => new CPF('12345678900')).toThrow('Invalid CPF');
    });

    it('should reject sequential numbers (111.111.111-11)', () => {
      expect(() => new CPF('11111111111')).toThrow(BadRequestException);
      expect(() => new CPF('111.111.111-11')).toThrow('Invalid CPF');
    });

    it('should reject all zeros', () => {
      expect(() => new CPF('00000000000')).toThrow(BadRequestException);
    });

    it('should reject all nines', () => {
      expect(() => new CPF('99999999999')).toThrow(BadRequestException);
    });

    it('should reject CPF with less than 11 digits', () => {
      expect(() => new CPF('123456789')).toThrow(BadRequestException);
      expect(() => new CPF('123456789')).toThrow('Invalid CPF');
    });

    it('should reject CPF with more than 11 digits', () => {
      expect(() => new CPF('123456789012')).toThrow(BadRequestException);
    });

    it('should reject empty CPF', () => {
      expect(() => new CPF('')).toThrow(BadRequestException);
    });

    it('should reject CPF with only special characters', () => {
      expect(() => new CPF('...-')).toThrow(BadRequestException);
    });

    it('should reject CPF with letters', () => {
      expect(() => new CPF('123.456.789-0A')).toThrow(BadRequestException);
    });
  });

  describe('Formatting', () => {
    it('should format valid CPF correctly', () => {
      const cpf = new CPF('12345678909');
      expect(cpf.getFormattedValue()).toBe('123.456.789-09');
    });

    it('should keep internal value unformatted', () => {
      const cpf = new CPF('123.456.789-09');
      expect(cpf.getValue()).toBe('12345678909');
      expect(cpf.getValue()).not.toContain('.');
      expect(cpf.getValue()).not.toContain('-');
    });
  });

  describe('Edge Cases', () => {
    it('should handle CPF with spaces', () => {
      const cpf = new CPF('123 456 789 09');
      expect(cpf.getValue()).toBe('12345678909');
    });

    it('should handle CPF with multiple special characters', () => {
      const cpf = new CPF('123...456...789---09');
      expect(cpf.getValue()).toBe('12345678909');
    });
  });

  describe('Immutability (DDD)', () => {
    it('should be immutable - value cannot be changed externally', () => {
      const cpf = new CPF('123.456.789-09');
      const value1 = cpf.getValue();
      const value2 = cpf.getValue();
      
      expect(value1).toBe(value2);
      expect(value1).toBe('12345678909');
    });

    it('should return same formatted value on multiple calls', () => {
      const cpf = new CPF('12345678909');
      const formatted1 = cpf.getFormattedValue();
      const formatted2 = cpf.getFormattedValue();
      
      expect(formatted1).toBe(formatted2);
      expect(formatted1).toBe('123.456.789-09');
    });
  });
});  
