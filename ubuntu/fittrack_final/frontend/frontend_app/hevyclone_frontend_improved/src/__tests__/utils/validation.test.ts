import { describe, it, expect } from 'vitest';
import {
  validateField,
  validateForm,
  ValidationRules,
  isValidEmail,
  isStrongPassword,
  getPasswordStrength,
  ValidationRule,
} from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const rule: ValidationRule = { required: true };

      // Valid cases
      expect(validateField('test', rule)).toEqual({ isValid: true, errors: [] });
      expect(validateField('a', rule)).toEqual({ isValid: true, errors: [] });

      // Invalid cases
      expect(validateField('', rule)).toEqual({ 
        isValid: false, 
        errors: ['Este campo é obrigatório'] 
      });
      expect(validateField('   ', rule)).toEqual({ 
        isValid: false, 
        errors: ['Este campo é obrigatório'] 
      });
      expect(validateField(null, rule)).toEqual({ 
        isValid: false, 
        errors: ['Este campo é obrigatório'] 
      });
      expect(validateField(undefined, rule)).toEqual({ 
        isValid: false, 
        errors: ['Este campo é obrigatório'] 
      });
    });

    it('should validate minLength', () => {
      const rule: ValidationRule = { minLength: 3 };

      // Valid cases
      expect(validateField('abc', rule)).toEqual({ isValid: true, errors: [] });
      expect(validateField('abcd', rule)).toEqual({ isValid: true, errors: [] });

      // Invalid cases
      expect(validateField('ab', rule)).toEqual({ 
        isValid: false, 
        errors: ['Mínimo 3 caracteres'] 
      });
      expect(validateField('a', rule)).toEqual({ 
        isValid: false, 
        errors: ['Mínimo 3 caracteres'] 
      });
    });

    it('should validate maxLength', () => {
      const rule: ValidationRule = { maxLength: 5 };

      // Valid cases
      expect(validateField('abc', rule)).toEqual({ isValid: true, errors: [] });
      expect(validateField('abcde', rule)).toEqual({ isValid: true, errors: [] });

      // Invalid cases
      expect(validateField('abcdef', rule)).toEqual({ 
        isValid: false, 
        errors: ['Máximo 5 caracteres'] 
      });
    });

    it('should validate pattern', () => {
      const rule: ValidationRule = { pattern: /^[0-9]+$/ };

      // Valid cases
      expect(validateField('123', rule)).toEqual({ isValid: true, errors: [] });
      expect(validateField('0', rule)).toEqual({ isValid: true, errors: [] });

      // Invalid cases
      expect(validateField('abc', rule)).toEqual({ 
        isValid: false, 
        errors: ['Formato inválido'] 
      });
      expect(validateField('123abc', rule)).toEqual({ 
        isValid: false, 
        errors: ['Formato inválido'] 
      });
    });

    it('should validate custom rules', () => {
      const rule: ValidationRule = {
        custom: (value: string) => {
          if (value === 'forbidden') {
            return 'Valor não permitido';
          }
          return null;
        }
      };

      // Valid cases
      expect(validateField('allowed', rule)).toEqual({ isValid: true, errors: [] });

      // Invalid cases
      expect(validateField('forbidden', rule)).toEqual({ 
        isValid: false, 
        errors: ['Valor não permitido'] 
      });
    });

    it('should combine multiple validation rules', () => {
      const rule: ValidationRule = {
        required: true,
        minLength: 3,
        maxLength: 10,
        pattern: /^[a-zA-Z]+$/,
        custom: (value: string) => {
          if (value === 'badword') {
            return 'Palavra não permitida';
          }
          return null;
        }
      };

      // Valid case
      expect(validateField('hello', rule)).toEqual({ isValid: true, errors: [] });

      // Invalid cases - multiple errors
      expect(validateField('', rule)).toEqual({ 
        isValid: false, 
        errors: ['Este campo é obrigatório'] 
      });

      expect(validateField('ab', rule)).toEqual({ 
        isValid: false, 
        errors: ['Mínimo 3 caracteres'] 
      });

      expect(validateField('verylongtext', rule)).toEqual({ 
        isValid: false, 
        errors: ['Máximo 10 caracteres'] 
      });

      expect(validateField('hello123', rule)).toEqual({ 
        isValid: false, 
        errors: ['Formato inválido'] 
      });

      expect(validateField('badword', rule)).toEqual({ 
        isValid: false, 
        errors: ['Palavra não permitida'] 
      });
    });

    it('should handle non-required empty fields', () => {
      const rule: ValidationRule = { minLength: 3 };

      expect(validateField('', rule)).toEqual({ isValid: true, errors: [] });
      expect(validateField(null, rule)).toEqual({ isValid: true, errors: [] });
      expect(validateField(undefined, rule)).toEqual({ isValid: true, errors: [] });
    });
  });

  describe('validateForm', () => {
    it('should validate entire form', () => {
      const data = {
        name: 'John',
        email: 'john@example.com',
        age: 25
      };

      const rules = {
        name: { required: true, minLength: 2 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        age: { required: true }
      };

      const result = validateForm(data, rules);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for invalid form', () => {
      const data = {
        name: 'J',
        email: 'invalid-email',
        age: ''
      };

      const rules = {
        name: { required: true, minLength: 2 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        age: { required: true }
      };

      const result = validateForm(data, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual({
        name: ['Mínimo 2 caracteres'],
        email: ['Formato inválido'],
        age: ['Este campo é obrigatório']
      });
    });
  });

  describe('ValidationRules', () => {
    describe('email', () => {
      it('should validate email addresses', () => {
        const rule = ValidationRules.email;

        // Valid emails
        expect(validateField('test@example.com', rule)).toEqual({ isValid: true, errors: [] });
        expect(validateField('user.name@domain.co.uk', rule)).toEqual({ isValid: true, errors: [] });

        // Invalid emails
        expect(validateField('invalid-email', rule).isValid).toBe(false);
        expect(validateField('@domain.com', rule).isValid).toBe(false);
        expect(validateField('user@', rule).isValid).toBe(false);
      });
    });

    describe('password', () => {
      it('should validate strong passwords', () => {
        const rule = ValidationRules.password;

        // Valid password
        expect(validateField('StrongPass123!', rule)).toEqual({ isValid: true, errors: [] });

        // Invalid passwords
        expect(validateField('weak', rule).isValid).toBe(false);
        expect(validateField('nouppercase123!', rule).isValid).toBe(false);
        expect(validateField('NOLOWERCASE123!', rule).isValid).toBe(false);
        expect(validateField('NoNumbers!', rule).isValid).toBe(false);
        expect(validateField('NoSpecialChar123', rule).isValid).toBe(false);
      });
    });

    describe('name', () => {
      it('should validate names', () => {
        const rule = ValidationRules.name;

        // Valid names
        expect(validateField('João Silva', rule)).toEqual({ isValid: true, errors: [] });
        expect(validateField('Maria José', rule)).toEqual({ isValid: true, errors: [] });

        // Invalid names
        expect(validateField('J', rule).isValid).toBe(false);
        expect(validateField('João123', rule).isValid).toBe(false);
        expect(validateField('João@Silva', rule).isValid).toBe(false);
      });
    });

    describe('phone', () => {
      it('should validate phone numbers', () => {
        const rule = ValidationRules.phone;

        // Valid phones
        expect(validateField('(11) 99999-9999', rule)).toEqual({ isValid: true, errors: [] });
        expect(validateField('11999999999', rule)).toEqual({ isValid: true, errors: [] });
        expect(validateField('11 99999-9999', rule)).toEqual({ isValid: true, errors: [] });

        // Invalid phones
        expect(validateField('123', rule).isValid).toBe(false);
        expect(validateField('abc', rule).isValid).toBe(false);
      });
    });

    describe('weight', () => {
      it('should validate weight values', () => {
        const rule = ValidationRules.weight;

        // Valid weights
        expect(validateField(70, rule).isValid).toBe(true);
        expect(validateField(50.5, rule).isValid).toBe(true);
        expect(validateField('75', rule).isValid).toBe(true);
        expect(validateField(500, rule).isValid).toBe(true); // Máximo permitido

        // Invalid weights
        expect(validateField(0, rule).isValid).toBe(false);
        expect(validateField(-10, rule).isValid).toBe(false);
        expect(validateField(501, rule).isValid).toBe(false); // Acima do máximo
        expect(validateField('abc', rule).isValid).toBe(false);
      });
    });

    describe('height', () => {
      it('should validate height values', () => {
        const rule = ValidationRules.height;

        // Valid heights
        expect(validateField(170, rule)).toEqual({ isValid: true, errors: [] });
        expect(validateField('180.5', rule)).toEqual({ isValid: true, errors: [] });

        // Invalid heights
        expect(validateField(30, rule).isValid).toBe(false);
        expect(validateField(300, rule).isValid).toBe(false);
        expect(validateField('abc', rule).isValid).toBe(false);
      });
    });

    describe('age', () => {
      it('should validate age values', () => {
        const rule = ValidationRules.age;

        // Valid ages
        expect(validateField(25, rule)).toEqual({ isValid: true, errors: [] });
        expect(validateField('30', rule)).toEqual({ isValid: true, errors: [] });

        // Invalid ages
        expect(validateField(10, rule).isValid).toBe(false);
        expect(validateField(150, rule).isValid).toBe(false);
        expect(validateField('abc', rule).isValid).toBe(false);
      });
    });
  });

  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should validate password strength', () => {
      expect(isStrongPassword('StrongPass123!')).toBe(true);
      expect(isStrongPassword('weak')).toBe(false);
      expect(isStrongPassword('nouppercase123!')).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('should return password strength score and label', () => {
      const weak = getPasswordStrength('123');
      expect(weak.score).toBe(1);
      expect(weak.label).toBe('Fraca');

      const strong = getPasswordStrength('StrongP@ssw0rd!');
      expect(strong.score).toBe(5);
      expect(strong.label).toBe('Muito Forte');
    });

    it('should return appropriate colors for different strengths', () => {
      const weak = getPasswordStrength('123');
      expect(weak.color).toBe('text-red-400');

      const medium = getPasswordStrength('Medium8'); // Score 3: comprimento + maiúscula + minúscula + número
      expect(medium.color).toBe('text-blue-500');

      const strong = getPasswordStrength('StrongP@ssw0rd!');
      expect(strong.color).toBe('text-green-400');
    });
  });
}); 