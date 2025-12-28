import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface FormStatusProps {
  form: UseFormReturn<any>;
  isSubmitting?: boolean;
  isDirty?: boolean;
  isValid?: boolean;
  lastSaved?: Date;
}

export const FormStatus: React.FC<FormStatusProps> = ({
  form,
  isSubmitting = false,
  isDirty = false,
  isValid = true,
  lastSaved,
}) => {
  const { formState } = form;
  const { errors, isDirty: formIsDirty, isValid: formIsValid } = formState;
  const errorCount = Object.keys(errors).length;
  const isFormDirty = isDirty || formIsDirty;
  const isFormValid = isValid && formIsValid;

  return (
    <div className="bg-surface-elevated rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-text-secondary">Form Status</h4>
        <div className="flex items-center space-x-2">
          {isSubmitting && (
            <div className="flex items-center space-x-2 text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Saving...</span>
            </div>
          )}
          {!isSubmitting && isFormDirty && (
            <div className="flex items-center space-x-2 text-warning">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
          {!isSubmitting && !isFormDirty && isFormValid && (
            <div className="flex items-center space-x-2 text-success">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">All saved</span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Summary */}
      {errorCount > 0 && (
        <div className="bg-error/20 border border-error/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-error mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {errorCount} validation error{errorCount !== 1 ? 's' : ''}
            </span>
          </div>
          <ul className="text-sm text-error space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="flex items-start space-x-2">
                <span className="text-error">•</span>
                <span>
                  <span className="font-medium capitalize">
                    {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  : {error?.message as string}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Last Saved Info */}
      {lastSaved && !isFormDirty && (
        <div className="flex items-center space-x-2 text-text-muted text-sm">
          <Info className="w-4 h-4" />
          <span>Last saved: {lastSaved.toLocaleString()}</span>
        </div>
      )}

      {/* Form Tips */}
      {isFormDirty && (
        <div className="bg-primary/20 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-primary mb-2">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">Form Tips</span>
          </div>
          <ul className="text-sm text-primary-hover space-y-1">
            <li>• Required fields are marked with a red asterisk (*)</li>
            <li>• Click "Save" to persist your changes</li>
            <li>• Use "Cancel" to discard unsaved changes</li>
          </ul>
        </div>
      )}
    </div>
  );
};

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  totalSteps,
  stepNames,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="w-full bg-surface-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-text-secondary font-medium">
          {stepNames[currentStep - 1]}
        </span>
      </div>

      {/* Step Dots */}
      <div className="flex items-center justify-center space-x-2">
        {stepNames.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${index < currentStep
              ? 'bg-primary'
              : index === currentStep - 1
                ? 'bg-primary-hover'
                : 'bg-border-muted'
              }`}
          />
        ))}
      </div>
    </div>
  );
};