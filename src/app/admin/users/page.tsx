'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import {
  CityResponseDTO,
  ServiceResponseDTO,
  UserResponseDTO,
  UserUpdateDTO,
} from '@/lib/types';

import { FiltersBar } from './_components/FiltersBar';
import { UsersTable } from './_components/UsersTable';
import { UserFormModal, UserFormState } from './_components/UserFormModal';
import { ConfirmToggleModal } from './_components/ConfirmToggleModal';
import { useProtectedPage } from '@/hooks/useProtectedPage';

type Field =
  | 'name'
  | 'cpf'
  | 'email'
  | 'phone'
  | 'password'
  | 'confirm'
  | 'serviceId'
  | 'cityId';

type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CPF_RE = /^[0-9.\-]{11,14}$/;

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [services, setServices] = useState<ServiceResponseDTO[]>([]);
  const [cities, setCities] = useState<CityResponseDTO[]>([]);

  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<UserResponseDTO | null>(
    null,
  );
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { isLoading, userInfo, hasAccess, logout } = useProtectedPage({
    requiredRole: 'ROLE_USER',
  });

  const [form, setForm] = useState<UserFormState>({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    serviceId: '',
    cityId: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  const serviceNames = services.map((s) => s.name);
  const cityNames = cities.map((c) => c.name);

  const serviceNameById = (id: string) =>
    services.find((s) => s.id === id)?.name ?? null;
  const cityNameById = (id: string) =>
    cities.find((c) => c.id === id)?.name ?? null;

  const setServiceByName = (name: string) => {
    const id = services.find((s) => s.name === name)?.id ?? '';
    setForm((f) => ({ ...f, serviceId: id }));
    if (errors.serviceId) setErrors((e) => ({ ...e, serviceId: undefined }));
  };

  const setCityByName = (name: string) => {
    const id = cities.find((c) => c.name === name)?.id ?? '';
    setForm((f) => ({ ...f, cityId: id }));
    if (errors.cityId) setErrors((e) => ({ ...e, cityId: undefined }));
  };

  function validateField(field: Field, value: string, snapshot = form): string {
    switch (field) {
      case 'name':
      case 'phone':
        return value.trim() ? '' : 'Obrigatório';
      case 'email':
        return EMAIL_RE.test(value.trim()) ? '' : 'E-mail inválido';
      case 'cpf':
        return CPF_RE.test(value.trim())
          ? ''
          : 'CPF inválido (ex.: 000.000.000-00)';
      case 'password':
        if (isEdit && !value) return '';
        return value.length >= 6 && value.length <= 100
          ? ''
          : 'Senha deve ter 6–100 caracteres';
      case 'confirm':
        if (isEdit && !snapshot.password && !value) return '';
        return value && value === snapshot.password
          ? ''
          : 'As senhas não coincidem';
      case 'serviceId':
        return value ? '' : 'Selecione um serviço';
      case 'cityId':
        return value ? '' : 'Selecione uma cidade';
      default:
        return '';
    }
  }

  function validateOnSubmit(): boolean {
    const next: Errors = {
      name: validateField('name', form.name),
      cpf: validateField('cpf', form.cpf),
      email: validateField('email', form.email),
      phone: validateField('phone', form.phone),
      password: validateField('password', form.password),
      confirm: validateField('confirm', form.confirm, form),
      serviceId: validateField('serviceId', form.serviceId),
      cityId: validateField('cityId', form.cityId),
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  const canClickSave = isEdit
    ? !!form.name.trim() &&
      !!form.cpf.trim() &&
      !!form.email.trim() &&
      !!form.phone.trim() &&
      !!form.serviceId &&
      !!form.cityId
    : !!form.name.trim() &&
      !!form.cpf.trim() &&
      !!form.email.trim() &&
      !!form.phone.trim() &&
      !!form.password.trim() &&
      !!form.confirm.trim() &&
      !!form.serviceId &&
      !!form.cityId;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [u, s, c] = await Promise.all([
          api.getUsers(),
          api.getAllServices(),
          api.getAllCities(),
        ]);
        if (!mounted) return;
        setUsers(u);
        setServices(s);
        setCities(c);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const byService = serviceFilter
        ? (u.service?.name ?? '').toLowerCase() === serviceFilter.toLowerCase()
        : true;
      const byCity = cityFilter
        ? (u.city?.name ?? '').toLowerCase() === cityFilter.toLowerCase()
        : true;
      return byService && byCity;
    });
  }, [users, serviceFilter, cityFilter]);

  const showPagination = filtered.length > 10;

  const openCreate = () => {
    setIsEdit(false);
    setEditingId(null);
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    setIsCreateOpen(false);
    setIsEdit(false);
    setEditingId(null);
    setForm({
      name: '',
      cpf: '',
      email: '',
      phone: '',
      password: '',
      confirm: '',
      serviceId: '',
      cityId: '',
    });
    setErrors({});
  };

  const onEdit = async (id: string) => {
    try {
      const u = await api.getUser(id);
      setIsEdit(true);
      setEditingId(u.id);
      setForm({
        name: u.name ?? '',
        cpf: u.cpf ?? '',
        email: u.email ?? '',
        phone: u.phone ?? '',
        password: '',
        confirm: '',
        serviceId: u.service?.id ?? '',
        cityId: u.city?.id ?? '',
      });
      setErrors({});
      setIsCreateOpen(true);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Falha ao carregar o usuário.',
      );
    }
  };

  const askToggleStatus = (u: UserResponseDTO) => {
    setConfirmTarget(u);
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmTarget(null);
    setConfirmLoading(false);
  };
  const confirmToggle = async () => {
    if (!confirmTarget) return;
    try {
      setConfirmLoading(true);
      if (confirmTarget.accountStatus) {
        await api.disableUser(confirmTarget.id);
      } else {
        await api.enableUser(confirmTarget.id);
      }
      setUsers((prev) =>
        prev.map((x) =>
          x.id === confirmTarget.id
            ? { ...x, accountStatus: !confirmTarget.accountStatus }
            : x,
        ),
      );
      closeConfirm();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Falha ao alterar o status do usuário.',
      );
      setConfirmLoading(false);
    }
  };

  const onSave = async () => {
    if (!validateOnSubmit()) return;

    if (isEdit && editingId) {
      const payload: UserUpdateDTO = {
        name: form.name.trim(),
        cpf: form.cpf.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        serviceId: form.serviceId,
        cityId: form.cityId,
        ...(form.password ? { password: form.password } : {}),
      };
      try {
        const updated = await api.editUser(editingId, payload);
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u)),
        );
        closeCreate();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Não foi possível editar.');
      }
    } else {
      const payload = {
        name: form.name.trim(),
        cpf: form.cpf.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        serviceId: form.serviceId,
        cityId: form.cityId,
      };
      try {
        const created = await api.createUser(payload);
        setUsers((prev) => [created, ...prev]);
        closeCreate();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Não foi possível criar.');
      }
    }
  };

  const onUpdate = (field: Field, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      const msg = validateField(field, value, { ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: msg || undefined }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!hasAccess || !userInfo) {
    return null;
  }

  return (
    <main className="mx-auto mt-20 w-full px-6 py-6">
      <div className="mb-5 ml-5 flex items-center justify-between">
        <h1 className="mb-5 text-3xl font-bold">Usuários</h1>
      </div>

      <FiltersBar
        serviceNames={serviceNames}
        cityNames={cityNames}
        onSelectService={(v) => setServiceFilter(v)}
        onSelectCity={(v) => setCityFilter(v)}
        onCreate={openCreate}
      />

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-700">
          Carregando...
        </div>
      ) : (
        <UsersTable
          rows={filtered}
          showPagination={showPagination}
          onEdit={onEdit}
          onToggleAsk={askToggleStatus}
        />
      )}

      <UserFormModal
        isOpen={isCreateOpen}
        isEdit={isEdit}
        form={form}
        errors={errors}
        canClickSave={canClickSave}
        serviceNames={serviceNames}
        cityNames={cityNames}
        valueServiceName={serviceNameById(form.serviceId)}
        valueCityName={cityNameById(form.cityId)}
        onClose={closeCreate}
        onSave={onSave}
        onUpdate={onUpdate}
        onSelectServiceByName={setServiceByName}
        onSelectCityByName={setCityByName}
      />

      <ConfirmToggleModal
        open={confirmOpen}
        loading={confirmLoading}
        isActive={confirmTarget?.accountStatus}
        onConfirm={confirmToggle}
        onClose={closeConfirm}
      />
    </main>
  );
}
