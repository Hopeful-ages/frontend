'use client';

import { Dropdown } from '@/components/Dropdown';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { AlertTriangle, Check, Hammer, MapPin, X } from 'lucide-react';

type Field = 'cityId' | 'serviceId' | 'cobrade';

export type PlanFormState = {
  cityId: string;
  serviceId: string;
  cobrade: string;
};

type Errors = Partial<Record<Field, string>>;

type PlanFormModalProps = {
  isOpen: boolean;
  isEdit: boolean;
  form: PlanFormState;
  errors: Errors;
  canClickSave: boolean;
  cityNames: string[];
  serviceNames: string[];
  valueCityName: string | null;
  valueServiceName: string | null;
  onClose: () => void;
  onSave: () => void;
  onUpdate: (field: Field, value: string) => void;
  onSelectCityByName: (name: string) => void;
  onSelectServiceByName: (name: string) => void;
};

export function PlanFormModal({
  isOpen,
  isEdit,
  form,
  errors,
  canClickSave,
  cityNames,
  serviceNames,
  valueCityName,
  valueServiceName,
  onClose,
  onSave,
  onUpdate,
  onSelectCityByName,
  onSelectServiceByName,
}: PlanFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Plano de Contingência' : 'Cadastro de Plano'}
      size="lg"
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <button
            onClick={onSave}
            disabled={!canClickSave}
            className="inline-flex items-center gap-2 rounded-md border border-black bg-black px-5 py-2 text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span>Salvar</span>
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-md border border-red-600 bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </button>
        </div>
      }
    >
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="w-full">
          <Dropdown
            label="Selecione a Cidade"
            items={cityNames}
            onSelect={onSelectCityByName}
            size="medium"
            bgColor="white"
            border="gray"
            icon={<MapPin className="h-4 w-4" />}
            fullWidth
            value={valueCityName}
          />
          {errors.cityId && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.cityId}
            </p>
          )}
        </div>

        <div className="w-full">
          <Dropdown
            label="Selecione o Serviço"
            items={serviceNames}
            onSelect={onSelectServiceByName}
            size="medium"
            bgColor="white"
            border="gray"
            icon={<Hammer className="h-4 w-4" />}
            fullWidth
            value={valueServiceName}
          />
          {errors.serviceId && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.serviceId}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Input
            value={form.cobrade}
            onChange={(e) => onUpdate('cobrade', e.target.value)}
            placeholder="Cobrade (Ex: Alagamento, Deslizamento de Terra)"
            icon={<AlertTriangle className="h-4 w-4" />}
            error={errors.cobrade}
          />
        </div>
      </div>
    </Modal>
  );
}
