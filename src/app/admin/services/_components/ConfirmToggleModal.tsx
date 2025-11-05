'use client';
import { Modal } from '@/components/Modal';
import { Check, X } from 'lucide-react';

type ConfirmToggleModalProps = {
  open: boolean;
  loading: boolean;
  isActive?: boolean;
  onConfirmAction: () => void;
  onCloseAction: () => void;
};

export function ConfirmToggleModal({
  open,
  loading,
  isActive,
  onConfirmAction,
  onCloseAction,
}: ConfirmToggleModalProps) {
  return (
    <Modal
      isOpen={open}
      onClose={onCloseAction}
      title=""
      size="sm"
      hideCloseIcon
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <button
            onClick={onConfirmAction}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-black bg-black px-5 py-2 text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span>{isActive ? 'Desativar' : 'Ativar'}</span>
          </button>
          <button
            onClick={onCloseAction}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-red-600 bg-red-600 px-5 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </button>
        </div>
      }
    ></Modal>
  );
}
