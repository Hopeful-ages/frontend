// hooks/useAccessibility.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para gerenciar recursos de acessibilidade
 *
 * Funcionalidades:
 * - Anúncios para leitores de tela
 * - Gerenciamento de foco
 * - Trap de foco em modais
 * - Fechar com ESC
 */
export function useAccessibility() {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  // Cria região ARIA live quando o componente monta
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verifica se já existe
    let liveRegion = document.getElementById(
      'a11y-live-region',
    ) as HTMLDivElement;

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(liveRegion);
    }

    liveRegionRef.current = liveRegion;

    return () => {
      // Não remove na desmontagem para permitir reutilização
    };
  }, []);

  /**
   * Anuncia mensagem para leitores de tela
   */
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!liveRegionRef.current) return;

      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = '';

      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = message;
        }
      }, 100);
    },
    [],
  );

  /**
   * Define foco em elemento específico
   */
  const setFocus = useCallback(
    (
      element: HTMLElement | null,
      options?: { scrollIntoView?: boolean; delay?: number },
    ) => {
      if (!element) return;

      const { scrollIntoView = false, delay = 100 } = options || {};

      setTimeout(() => {
        element.focus();
        if (scrollIntoView) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, delay);
    },
    [],
  );

  /**
   * Trap de foco dentro de um container (útil para modais)
   */
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

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

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    // Retorna função de cleanup
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /**
   * Adiciona listener para fechar com ESC
   */
  const onEscape = useCallback((callback: () => void) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    announce,
    setFocus,
    trapFocus,
    onEscape,
  };
}
