// src/components/ui/input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  className = '',
  error,
  ...props
}) => {
  const baseStyles = "flex h-10 w-full search-input px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50";
  
  const errorStyles = error ? "border-red-500 focus-visible:ring-red-500" : "";
  
  const combinedClassName = `${baseStyles} ${errorStyles} ${className}`;
  
  return (
    <div className="w-full">
      <input 
        className={combinedClassName}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
