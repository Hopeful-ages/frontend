'use client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import {
  Check,
  Hammer,
  X,
} from 'lucide-react';

type Field =
  | 'name'
;

export type ServiceFormState = {
  name: string;
};

type Errors = Partial<Record<Field, string>>;

type ServiceFormModalProps = {
  isOpen: boolean;
  isEdit: boolean;
  titleWhenEdit?: string;
  form: ServiceFormState;
  errors: Errors;
  canClickSave: boolean;
  onCloseAction: () => void;
  onSaveAction: () => void;
  onUpdateAction: (field: Field, value: string) => void;
};

export function ServiceFormModal({
  isOpen,
  form,
  errors,
  canClickSave,
  onCloseAction,
  onSaveAction,
  onUpdateAction,
}: ServiceFormModalProps) {

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseAction}
      title={'Adicionar Serviço'}
      size="auto"
      footer={
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={onSaveAction}
            disabled={!canClickSave}
            variant="secondary"
            leftIcon={<Check />}
            className="w-full sm:w-auto"
          >
            Salvar
          </Button>

          <Button 
            onClick={onCloseAction} 
            variant="danger" 
            leftIcon={<X />}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <div className="flex w-full items-center justify-center px-4 sm:px-0">
        <Input
          value={form.name}
          onChange={(e) => onUpdateAction('name', e.target.value)}
          placeholder="Nome do serviço"
          icon={<Hammer className="h-4 w-4" />}
          error={errors.name}
          className="w-full"
        />
      </div>

    </Modal>
  );
}
