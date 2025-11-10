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
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

type Field =
  | 'name'
  | 'cpf'
  | 'email'
  | 'phone'
  | 'password'
  | 'confirm'
  | 'departmentId'
  | 'cityId'
  | 'roleId';

export type UserFormState = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  departmentId: string;
  cityId: string;
  roleId: string;
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
  roleNames: string[];
  valueServiceName: string | null;
  valueCityName: string | null;
  valueRoleName: string | null;
  onClose: () => void;
  onSave: () => void;
  onUpdate: (field: Field, value: string) => void;
  onSelectServiceByName: (name: string) => void;
  onSelectCityByName: (name: string) => void;
  onSelectRoleByName: (name: string) => void;
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
  roleNames,
  valueServiceName,
  valueCityName,
  valueRoleName,
  onClose,
  onSave,
  onUpdate,
  onSelectServiceByName,
  onSelectCityByName,
  onSelectRoleByName,
}: UserFormModalProps) {
  const title = useMemo(
    () => (isEdit ? titleWhenEdit : 'Cadastro de Usuários'),
    [isEdit, titleWhenEdit],
  );

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

  const desktop = (
    <div className="hidden md:block">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
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
              useAutoComplete={true}
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
            {errors.departmentId && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {errors.departmentId}
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

          <div className="w-full">
            <Dropdown
              label="Selecione a Função"
              items={roleNames}
              onSelect={onSelectRoleByName}
              size="medium"
              bgColor="white"
              border="gray"
              textColor="gray"
              textSize="sm"
              roundedBorder="lg"
              maxItemsVisible={3}
              fullWidth
              value={valueRoleName}
            />
            {errors.roleId && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {errors.roleId}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );

  const mobile = (
    <div className="md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="mx-auto w-full max-w-[90%] rounded-2xl bg-white shadow-xl sm:max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: '72vh',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
            >
              <div className="mt-2 mb-5 flex items-center justify-between px-5 pt-5 pb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 transition hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 px-5 pb-8">
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

                <Dropdown
                  label="Selecione Cidade"
                  items={cityNames}
                  onSelect={onSelectCityByName}
                  fullWidth
                  size="long"
                  useAutoComplete
                  icon={<MapPin className="h-4 w-4" />}
                  value={valueCityName}
                  bgColor="white"
                  border="gray"
                  textColor="gray"
                  textSize="sm"
                  roundedBorder="lg"
                  maxItemsVisible={3}
                />
                {errors.cityId && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.cityId}
                  </p>
                )}

                <Dropdown
                  label="Selecione o Serviço"
                  items={serviceNames}
                  onSelect={onSelectServiceByName}
                  fullWidth
                  size="long"
                  icon={<Hammer className="h-4 w-4" />}
                  value={valueServiceName}
                  bgColor="white"
                  border="gray"
                  textColor="gray"
                  textSize="sm"
                  roundedBorder="lg"
                  maxItemsVisible={3}
                />
                {errors.departmentId && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.departmentId}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-4">
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
                </div>

                <Input
                  value={form.email}
                  onChange={(e) => onUpdate('email', e.target.value)}
                  placeholder="Email"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email}
                />

                <Input
                  value={form.phone}
                  onChange={(e) =>
                    onUpdate('phone', formatPhone(e.target.value))
                  }
                  placeholder="Telefone"
                  icon={<Phone className="h-4 w-4" />}
                  error={errors.phone}
                  maxLength={15}
                />

                <Dropdown
                  label="Selecione a Função"
                  items={roleNames}
                  onSelect={onSelectRoleByName}
                  fullWidth
                  size="long"
                  value={valueRoleName}
                  bgColor="white"
                  border="gray"
                  textColor="gray"
                  textSize="sm"
                  roundedBorder="lg"
                  maxItemsVisible={3}
                />
                {errors.roleId && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.roleId}
                  </p>
                )}

                <div className="mt-4 mb-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onSave}
                    disabled={!canClickSave}
                    className="flex-1 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {desktop}
      {mobile}
    </>
  );
}
