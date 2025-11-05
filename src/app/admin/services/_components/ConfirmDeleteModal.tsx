'use client';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Check, X, AlertTriangle } from 'lucide-react';

type ConfirmDeleteModalProps = {
  open: boolean;
  loading: boolean;
  serviceName?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDeleteModal({
  open,
  loading,
  serviceName,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Confirmar Exclusão"
      size="sm"
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            onClick={onConfirm}
            disabled={loading}
            variant="danger"
            leftIcon={<Check />}
          >
            {loading ? 'Excluindo...' : 'Confirmar'}
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
        <AlertTriangle className="h-7 w-7 text-red-600" />
        <div className="text-center">
          <p className="text-sm text-gray-900">
            Tem certeza que deseja excluir o serviço{' '}
            {serviceName && (
              <span className="font-semibold">{serviceName}</span>
            )}
            ?
          </p>
        </div>
      </div>
    </Modal>
  );
}
