'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'terciary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'save';

// add an explicit 'icon' variant for small circular/icon-only buttons (e.g. back button)
// this keeps the style consistent across the app without inline class overrides
export type ButtonVariantExtended = ButtonVariant | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonClasses> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

const buttonClasses = cva(
  'inline-flex rounded-lg items-center justify-center gap-2 font-medium transition-colors select-none whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
  {
    variants: {
      variant: {
        icon: 'bg-black text-white hover:bg-black active:bg-black focus-visible:outline-none focus-visible:ring-0',
        primary:
          'bg-blue-600 text-white hover:bg-blue-900 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-0',
        secondary:
          'bg-[var(--foreground)] text-[var(--background)] hover:brightness-90 active:brightness-75 focus-visible:outline-none focus-visible:ring-0',
        terciary:
          'bg-gray-300 text-black hover:bg-gray-500 active:bg-gray-400 focus-visible:outline-none focus-visible:ring-0',

        outline:
          'border border-gray-300 bg-[var(--background)] text-[var(--foreground)]  focus-visible:outline-none focus-visible:ring-0 hover:text-gray-400',
        ghost:
          'border border-gray-200 bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-none focus-visible:ring-0',
        danger:
          'bg-red-600 text-white hover:bg-red-900 active:bg-red-900 focus-visible:outline-none focus-visible:ring-0',
        save: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus-visible:outline-none focus-visible:ring-0',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-[8px] min-w-[100px]',
        md: 'h-10 px-4 text-sm rounded-[8px] min-w-[120px]',
        lg: 'h-12 px-6 text-base rounded-[8px] min-w-[140px]',
        xl: 'h-14 px-8 text-lg rounded-[8px] min-w-[180px]',
        icon: 'h-10 w-10 p-2 rounded-full min-w-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

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
      size = 'sm',
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
        className={cn(buttonClasses({ variant, size }), className)}
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
