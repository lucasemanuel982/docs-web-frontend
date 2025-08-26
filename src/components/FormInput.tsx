import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  icon?: LucideIcon;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  register: UseFormRegister<any>;
  error?: FieldError;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  type,
  placeholder,
  icon: Icon,
  required = false,
  autoComplete,
  className = '',
  disabled = false,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword = false,
  register,
  error
}) => {
  const baseInputClass = "form-input-custom appearance-none relative block w-full pl-10 pr-3 py-2 border placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm";
  const errorInputClass = "border-red-500 focus:border-red-500";
  const normalInputClass = "border-gray-600 focus:border-primary";

  const inputClass = `${baseInputClass} ${error ? errorInputClass : normalInputClass} ${className}`;

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div className="flex items-center">
        {Icon && (
          <div className={`input-icon text-white ${error ? 'input-icon-error' : ''}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          id={id}
          {...register(name)}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className={inputClass}
          placeholder={placeholder}
          disabled={disabled}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormInput; 