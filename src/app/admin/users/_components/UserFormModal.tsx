'use client';
import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import {
  Check,
  Hammer,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  X,
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
  function formatCPF(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? titleWhenEdit : 'Cadastro de Usuários'}
      size="auto"
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            onClick={onSave}
            disabled={!canClickSave}
            variant="secondary"
            leftIcon={<Check />}
          >
            Salvar
          </Button>

          <Button onClick={onClose} variant="danger" leftIcon={<X />}>
            Cancelar
          </Button>
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
          onChange={(e) => onUpdate('cpf', formatCPF(e.target.value))}
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
          onChange={(e) => onUpdate('phone', formatPhone(e.target.value))}
          placeholder="Telefone"
          icon={<Phone className="h-4 w-4" />}
          error={errors.phone}
          maxLength={15}
        />
      </div>
    </Modal>
  );
}
