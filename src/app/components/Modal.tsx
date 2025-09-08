'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  children?: React.ReactNode;
  footer: React.ReactNode;
  hideCloseIcon?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  hideCloseIcon = false,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-[500px] h-[250px]',
    md: 'w-[583px] h-[342px]',
    lg: 'w-[720px] h-[500px]',
    xl: 'w-[813px] h-[547px]',
    auto: 'max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={clsx(
          'relative flex flex-col rounded-[8px] border border-black bg-white shadow-lg',
          'max-h-[90vh]',
          sizeClasses[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="relative mt-6 flex justify-center px-4 py-3">
            <h2 className="text-center text-lg font-semibold text-black">
              {title}
            </h2>
            {!hideCloseIcon && (
              <button
                onClick={onClose}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer p-1 text-black transition hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="mr-4 ml-4 flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>

        {footer && (
          <div className="mb-6 flex justify-center gap-2 px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
