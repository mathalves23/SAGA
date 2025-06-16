// src/components/ui/select.tsx
import React, { useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione uma opção',
  className = '',
  label,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary mb-1">
          {label}
        </label>
      )}
      
      <div 
        className={`flex items-center justify-between h-10 w-full search-input px-3 py-2 text-sm cursor-pointer ${error ? 'border-red-500' : ''} ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${!selectedOption ? 'search-icon' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={`h-4 w-4 search-icon transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#2c2c2e] border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white ${option.value === value ? 'bg-blue-50 dark:bg-blue-900/20 font-medium' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
