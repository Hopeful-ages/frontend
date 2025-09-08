'use client';
import React from 'react';
import { Modal } from '@/app/components/Modal';
import { Input } from '@/app/components/Input';
import { Dropdown } from '@/app/components/Dropdown';
import {
  Check,
  X,
  User as UserIcon,
  IdCard,
  Lock,
  Mail,
  Phone,
  MapPin,
  Hammer,
} from 'lucide-react';

type Field =
  | 'name'
  | 'cpf'
  | 'email'
  | 'phone'
  | 'password'
  | 'confirm'
  | 'serviceId'
  | 'cityId';

export type UserFormState = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  serviceId: string;
  cityId: string;
};

type Errors = Partial<Record<Field, string>>;

type UserFormModalProps = {
  isOpen: boolean;
  isEdit: boolean;
  titleWhenEdit?: string;
  form: UserFormState;
  errors: Errors;
  canClickSave: boolean;
  serviceNames: string[];
  cityNames: string[];
  valueServiceName: string | null;
  valueCityName: string | null;
  onClose: () => void;
  onSave: () => void;
  onUpdate: (field: Field, value: string) => void;
  onSelectServiceByName: (name: string) => void;
  onSelectCityByName: (name: string) => void;
};

export function UserFormModal({
  isOpen,
  isEdit,
  titleWhenEdit = 'Editar Usuário',
  form,
  errors,
  canClickSave,
  serviceNames,
  cityNames,
  valueServiceName,
  valueCityName,
  onClose,
  onSave,
  onUpdate,
  onSelectServiceByName,
  onSelectCityByName,
}: UserFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? titleWhenEdit : 'Cadastro de Usuários'}
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
        <Input
          value={form.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          placeholder="Nome"
          icon={<UserIcon className="h-4 w-4" />}
          error={errors.name}
        />

        <Input
          value={form.cpf}
          onChange={(e) => onUpdate('cpf', e.target.value)}
          placeholder="CPF"
          icon={<IdCard className="h-4 w-4" />}
          error={errors.cpf}
          maxLength={14}
        />

        <div className="w-full">
          <Dropdown
            label="Selecione Cidade"
            items={cityNames}
            onSelect={onSelectCityByName}
            size="medium"
            bgColor="white"
            border="gray"
            textColor="gray"
            textSize="sm"
            roundedBorder="lg"
            maxItemsVisible={3}
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
            textColor="gray"
            textSize="sm"
            roundedBorder="lg"
            maxItemsVisible={3}
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

        <Input
          type="password"
          value={form.password}
          onChange={(e) => onUpdate('password', e.target.value)}
          placeholder="Senha"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password}
        />

        <Input
          type="password"
          value={form.confirm}
          onChange={(e) => onUpdate('confirm', e.target.value)}
          placeholder="Confirmar Senha"
          icon={<Lock className="h-4 w-4" />}
          error={errors.confirm}
        />

        <Input
          value={form.email}
          onChange={(e) => onUpdate('email', e.target.value)}
          placeholder="Email"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email}
        />

        <Input
          value={form.phone}
          onChange={(e) => onUpdate('phone', e.target.value)}
          placeholder="Telefone"
          icon={<Phone className="h-4 w-4" />}
          error={errors.phone}
        />
      </div>
    </Modal>
  );
}
