'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

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
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
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

  // Trap de foco
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modalRef.current.addEventListener('keydown', handleKeyDown);

    // Foco automático no primeiro elemento
    setTimeout(() => firstElement?.focus(), 100);

    return () => {
      modalRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-[500px] h-[300px]',
    md: 'w-[583px] h-[380px]',
    lg: 'w-[700px] h-[500px]',
    xl: 'w-[813px] h-[547px]',
    auto: 'max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={clsx(
          'relative flex flex-col rounded-[8px] bg-white shadow-lg',
          'max-h-[90vh]',
          sizeClasses[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="relative mt-3 flex justify-center px-4 py-3">
            <h2
              id="modal-title"
              className="text-center text-lg font-semibold text-black"
            >
              {title}
            </h2>
            {!hideCloseIcon && (
              <button
                onClick={onClose}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded p-1 text-black transition hover:text-red-500 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="mr-3 ml-3 flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>

        {footer && (
          <div className="mb-3 flex justify-center gap-2 px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
