'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef, ReactNode, useId } from 'react';

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

const inputClasses = cva(
  'w-full flex rounded-lg border bg-white text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 text-black',
  {
    variants: {
      variant: {
        default: 'border-gray-400 focus:border-blue-500',
        error: 'border-red-500 text-red-700 focus:border-red-600',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'variant'>,
    VariantProps<typeof inputClasses> {
  icon?: ReactNode;
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, icon, error, label, ...props }, ref) => {
    const inputVariant = error ? 'error' : variant;
    const errorId = useId();
    const labelId = useId();

    return (
      <div className="w-full">
        {label && (
          <label
            id={labelId}
            htmlFor={props.id}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          {icon && (
            <div
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              aria-hidden="true"
            >
              <span className={cn('text-gray-400', error && 'text-red-500')}>
                {icon}
              </span>
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              inputClasses({ variant: inputVariant, size }),
              icon ? 'pl-10' : '',
              className,
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            aria-labelledby={label ? labelId : undefined}
            {...props}
          />
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="mt-1.5 text-xs font-medium text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
