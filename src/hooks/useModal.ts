import { useEffect, useRef, RefObject } from 'react';

interface UseModalOptions {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Se true, foca automaticamente no primeiro elemento focável quando o modal abre
   * @default true
   */
  autoFocus?: boolean;
  /**
   * Se true, fecha o modal ao pressionar ESC
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Se true, ativa o trap de foco (mantém o foco dentro do modal)
   * @default true
   */
  trapFocus?: boolean;
  /**
   * Seletor customizado para elementos focáveis
   * @default 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
   */
  focusableSelector?: string;
}

interface UseModalReturn {
  modalRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hook customizado para gerenciar comportamentos de acessibilidade em modais
 *
 * Funcionalidades:
 * - Fecha o modal ao pressionar ESC
 * - Trap de foco (mantém o foco dentro do modal)
 * - Foco automático no primeiro elemento focável
 * - Previne scroll do body quando modal está aberto
 *
 * @example
 * ```tsx
 * const { modalRef } = useModal({ isOpen, onClose });
 *
 * return (
 *   <div ref={modalRef} role="dialog" aria-modal="true">
 *     {children}
 *   </div>
 * );
 * ```
 */
export function useModal({
  isOpen,
  onClose,
  autoFocus = true,
  closeOnEscape = true,
  trapFocus = true,
  focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
}: UseModalOptions): UseModalReturn {
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar com ESC
  useEffect(() => {
    if (!closeOnEscape) return;

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
  }, [isOpen, onClose, closeOnEscape]);

  // Trap de foco e auto-foco
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    if (!trapFocus && !autoFocus) return;

    const focusableElements =
      modalRef.current.querySelectorAll<HTMLElement>(focusableSelector);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Auto-foco no primeiro elemento
    if (autoFocus) {
      setTimeout(() => firstElement?.focus(), 100);
    }

    // Trap de foco
    if (!trapFocus) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const currentModal = modalRef.current;
    currentModal.addEventListener('keydown', handleKeyDown);

    return () => {
      currentModal?.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, autoFocus, trapFocus, focusableSelector]);

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  return { modalRef };
}
