import React, { ComponentProps, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const buttonStyles = cva(
  'inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
  {
    variants: {
      // 1. Variações de Estilo (variant)
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary:
          'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
      // 2. Variações de Tamanho (size)
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      // 3. Variações de Estado (disabled)
      // As classes `disabled:` do Tailwind são aplicadas automaticamente quando o atributo `disabled` está no botão.
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    // Valores padrão
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

// --- Definição dos Ícones e Spinner ---

// Um componente simples para o spinner de loading
const Spinner = () => (
  <svg
    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// --- Definição das Props do Componente ---

// Usamos `extends` para incluir todas as props de um botão HTML padrão (como `type`, `name`, etc.)
export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonStyles> {
  isLoading?: boolean;
  icon?: ReactNode; // Aceita qualquer elemento React como ícone
}

// --- O Componente Button ---

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      disabled = false,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    // O estado de desabilitado é verdadeiro se `isLoading` ou `disabled` for verdadeiro.
    const isDisabled = isLoading || disabled;

    return (
      <button
        ref={ref}
        className={buttonStyles({
          variant,
          size,
          disabled: isDisabled,
          className,
        })}
        disabled={isDisabled}
        {...props}
      >
        {/* Renderiza o Spinner se isLoading for true */}
        {isLoading && <Spinner />}

        {/* Renderiza o ícone se não estiver em loading e se o ícone for passado */}
        {!isLoading && icon && <span className="mr-2">{icon}</span>}

        {/* Renderiza o texto do botão */}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
