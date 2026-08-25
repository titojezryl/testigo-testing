import * as React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "~/lib/utils";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  onErrorClear?: () => void;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, label, error, id, required, inputClassName, wrapperClassName, onChange, onErrorClear, ...props }, ref) => {
    const generatedId = id || React.useId();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Notify parent to clear error when user starts typing
      if (error && e.target.value && onErrorClear) {
        onErrorClear();
      }
      onChange?.(e);
    };

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {label && (
          <Label htmlFor={generatedId}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={generatedId}
          className={cn(
            error && "border-red-500 focus:ring-red-500 mb-0",
            inputClassName,
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${generatedId}-error` : undefined}
          onChange={handleChange}
          {...props}
        />
        {error && (
          <p id={`${generatedId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
