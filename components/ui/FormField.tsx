import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import { AlertCircle, Info } from 'lucide-react';

interface FormFieldProps {
  label?: string;
  name: string;
  error?: FieldError;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  required = false,
  children,
  description,
  className = '',
}) => {
  const hasError = !!error;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {children}

        {/* Status Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {hasError && (
            <AlertCircle className="w-5 h-5 text-error" />
          )}
        </div>
      </div>

      {/* Description */}
      {description && !hasError && (
        <div className="flex items-start space-x-2 text-sm text-text-muted">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{description}</p>
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <div className="flex items-start space-x-2 text-sm text-error">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  label?: string;
  description?: string;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(({
  error,
  label,
  name,
  description,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <FormField
      label={label}
      name={name || ''}
      error={error}
      required={required}
      description={description}
    >
      <input
        ref={ref}
        {...props}
        name={name}
        className={`w-full px-4 py-3 bg-surface-muted border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${error
          ? 'border-error focus:ring-error'
          : 'border-border-muted focus:border-primary'
          } ${className}`}
      />
    </FormField>
  );
});

FormInput.displayName = 'FormInput';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError;
  label: string;
  description?: string;
  required?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  error,
  label,
  name,
  description,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <FormField
      label={label}
      name={name || ''}
      error={error}
      required={required}
      description={description}
    >
      <textarea
        ref={ref}
        {...props}
        name={name}
        className={`w-full px-4 py-3 bg-surface-muted border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-colors duration-200 ${error
          ? 'border-error focus:ring-error'
          : 'border-border-muted focus:border-primary'
          } ${className}`}
      />
    </FormField>
  );
});

FormTextarea.displayName = 'FormTextarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: FieldError;
  label: string;
  description?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, SelectProps>(({
  error,
  label,
  name,
  description,
  required = false,
  options,
  className = '',
  ...props
}, ref) => {
  return (
    <FormField
      label={label}
      name={name || ''}
      error={error}
      required={required}
      description={description}
    >
      <select
        ref={ref}
        {...props}
        name={name}
        className={`w-full px-4 py-3 bg-surface-muted border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${error
          ? 'border-error focus:ring-error'
          : 'border-border-muted focus:border-primary'
          } ${className}`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
});

FormSelect.displayName = 'FormSelect';