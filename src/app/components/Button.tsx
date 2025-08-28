'use client';
import React, { forwardRef } from 'react';

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'safe';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
  xl: 'h-14 px-8 text-lg rounded-2xl',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-700 cursor-pointer ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ring-offset-2 ring-offset-white cursor-pointer ' +
    'dark:ring-offset-gray-900',
  secondary:
    'bg-gray-900 text-white shadow-sm hover:bg-gray-800 active:bg-gray-800 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ring-offset-2 ring-offset-white cursor-pointer ' +
    'dark:ring-offset-gray-900',
  outline:
    'border border-gray-300 text-gray-900 hover:bg-gray-50 active:bg-gray-100 ' +
    'dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-800 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ring-offset-2 ring-offset-white cursor-pointer ' +
    'dark:ring-offset-gray-900 cursor-pointer',
  ghost:
    'bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 cursor-pointer ' +
    'dark:ring-offset-gray-900 cursor-pointer',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-700 cursor-pointer ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ring-offset-2 ring-offset-white cursor-pointer ' +
    'dark:ring-offset-gray-900',
  safe:
    'bg-green-600 text-white shadow-sm hover:bg-green-700 active:bg-green-700  cursor-pointer ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ring-offset-2 ring-offset-white cursor-pointer ' +
    'dark:ring-offset-gray-900',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium transition-colors select-none whitespace-nowrap ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

export const Spinner: React.FC<{ className?: string; srLabel?: string }> = ({
  className,
  srLabel = 'Carregando…',
}) => (
  <span role="status" aria-live="polite" className="inline-flex items-center">
    <svg
      className={cn('animate-spin', className || 'h-4 w-4')}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <span className="sr-only">{srLabel}</span>
  </span>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      onClick,
      type,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = rest.disabled || loading;

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant])}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        onClick={(e) => {
          if (isDisabled) return;
          onClick?.(e);
        }}
        {...rest}
      >
        {loading ? (
          <Spinner className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
        ) : leftIcon ? (
          <span
            className={cn(
              size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
              'inline-flex items-center justify-center',
            )}
          >
            {leftIcon}
          </span>
        ) : null}

        <span>{children}</span>
      </button>
    );
  },
);
Button.displayName = 'Button';
