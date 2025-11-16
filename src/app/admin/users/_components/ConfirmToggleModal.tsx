'use client';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Check, X, AlertTriangle } from 'lucide-react';

type ConfirmToggleModalProps = {
  open: boolean;
  loading: boolean;
  isActive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmToggleModal({
  open,
  loading,
  isActive,
  onConfirm,
  onClose,
}: ConfirmToggleModalProps) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={isActive ? 'Desativar Usuário' : 'Ativar Usuário'}
      size="sm"
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            onClick={onConfirm}
            disabled={loading}
            variant={isActive ? 'danger' : 'secondary'}
            leftIcon={<Check />}
          >
            {loading
              ? isActive
                ? 'Desativando...'
                : 'Ativando...'
              : isActive
                ? 'Desativar'
                : 'Ativar'}
          </Button>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outline"
            leftIcon={<X />}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-3 py-2">
        <AlertTriangle className="h-7 w-7 text-yellow-600" />
        <div className="text-center">
          <p className="text-sm text-gray-900">
            {isActive
              ? 'Tem certeza que deseja desativar este usuário?'
              : 'Tem certeza que deseja ativar este usuário?'}
          </p>
        </div>
      </div>
    </Modal>
  );
}
