import React from 'react';

// Tipos para validação
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Regras de validação pré-definidas
export const ValidationRules = {
  // Email
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    custom: (value: string) => {
      if (value && !ValidationRules.email.pattern.test(value)) {
        return 'Digite um email válido';
      }
      return null;
    }
  },

  // Senha
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      const errors: string[] = [];
      
      if (value.length < 8) {
        errors.push('Mínimo 8 caracteres');
      }
      
      if (!/[A-Z]/.test(value)) {
        errors.push('Pelo menos 1 letra maiúscula');
      }
      
      if (!/[a-z]/.test(value)) {
        errors.push('Pelo menos 1 letra minúscula');
      }
      
      if (!/\d/.test(value)) {
        errors.push('Pelo menos 1 número');
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.push('Pelo menos 1 caractere especial');
      }
      
      return errors.length > 0 ? errors.join(', ') : null;
    }
  },

  // Nome
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
    custom: (value: string) => {
      if (value && !/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) {
        return 'Nome deve conter apenas letras';
      }
      if (value && value.trim().length < 2) {
        return 'Nome deve ter pelo menos 2 caracteres';
      }
      return null;
    }
  },

  // Telefone
  phone: {
    pattern: /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
    custom: (value: string) => {
      if (value && !ValidationRules.phone.pattern.test(value)) {
        return 'Digite um telefone válido (11) 99999-9999';
      }
      return null;
    }
  },

  // Peso
  weight: {
    custom: (value: number | string) => {
      const num = Number(value);
      if (isNaN(num) || num <= 0) {
        return 'Digite um peso válido';
      }
      if (num > 500) {
        return 'Peso muito alto (máx. 500kg)';
      }
      return null;
    }
  },

  // Altura
  height: {
    custom: (value: number | string) => {
      const num = Number(value);
      if (isNaN(num) || num <= 0) {
        return 'Digite uma altura válida';
      }
      if (num < 50 || num > 250) {
        return 'Altura deve estar entre 50cm e 250cm';
      }
      return null;
    }
  },

  // Idade
  age: {
    custom: (value: number | string) => {
      const num = Number(value);
      if (isNaN(num) || num <= 0) {
        return 'Digite uma idade válida';
      }
      if (num < 13 || num > 120) {
        return 'Idade deve estar entre 13 e 120 anos';
      }
      return null;
    }
  }
};

// Função para validar um campo específico
export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  // Required
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push('Este campo é obrigatório');
    return { isValid: false, errors };
  }

  // Se não tem valor e não é required, é válido
  // Mas cuidado com valores como 0 que são falsy mas válidos
  if ((value === null || value === undefined || value === '') && !rules.required) {
    return { isValid: true, errors: [] };
  }

  // MinLength
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    errors.push(`Mínimo ${rules.minLength} caracteres`);
  }

  // MaxLength
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    errors.push(`Máximo ${rules.maxLength} caracteres`);
  }

  // Pattern
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    errors.push('Formato inválido');
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Função para validar um formulário completo
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): FormValidationResult => {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const fieldResult = validateField(data[field], rules[field]);
    if (!fieldResult.isValid) {
      errors[field] = fieldResult.errors;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Hook para usar validação em tempo real
export const useValidation = (initialData: Record<string, any>, rules: Record<string, ValidationRule>) => {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateSingleField = (field: string, value: any): boolean => {
    if (rules[field]) {
      const result = validateField(value, rules[field]);
      setErrors(prev => ({
        ...prev,
        [field]: result.errors
      }));
      return result.isValid;
    }
    return true;
  };

  const handleChange = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Validar apenas se o campo já foi touched
    if (touched[field]) {
      validateSingleField(field, value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateSingleField(field, data[field]);
  };

  const validate = () => {
    const result = validateForm(data, rules);
    setErrors(result.errors);
    
    // Marcar todos os campos como touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(rules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    return result.isValid;
  };

  const reset = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every(err => err.length === 0)
  };
};

// Utilitários para validação específica
export const isValidEmail = (email: string): boolean => {
  return ValidationRules.email.pattern.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  const result = validateField(password, ValidationRules.password);
  return result.isValid;
};

export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  const strength = {
    0: { label: 'Muito Fraca', color: 'text-red-500' },
    1: { label: 'Fraca', color: 'text-red-400' },
    2: { label: 'Regular', color: 'text-yellow-500' },
    3: { label: 'Boa', color: 'text-blue-500' },
    4: { label: 'Forte', color: 'text-green-500' },
    5: { label: 'Muito Forte', color: 'text-green-400' }
  };
  
  return {
    score,
    label: strength[score as keyof typeof strength].label,
    color: strength[score as keyof typeof strength].color
  };
};

export default {
  ValidationRules,
  validateField,
  validateForm,
  useValidation,
  isValidEmail,
  isStrongPassword,
  getPasswordStrength
}; 