'use client';

import { api } from '@/lib/api';
import {
  ApiError,
  ServiceResponseDTO,
} from '@/lib/types';
import { useEffect, useRef, useState } from 'react';

import { useProtectedPage } from '@/hooks/useProtectedPage';
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/providers/LoadingProvider';
import { FiltersBar } from './_components/FiltersBar';
import { ServiceFormModal, ServiceFormState } from './_components/ServiceFormModal';
import { ServicesTable } from './_components/ServicesTable';

type Field =
  | 'name';

type Errors = Partial<Record<Field, string>>;
function handleApiErrors(
  err: unknown,
  setErrors: React.Dispatch<React.SetStateAction<Errors>>,
  fallback: (msg: string) => void,
) {
  const apiErr = err as ApiError;

  if (!apiErr || !apiErr.data) {
    fallback(
      'Ocorreu um erro inesperado. Por favor, tente novamente em alguns instantes.',
    );
    return;
  }

  const backendMsg = apiErr.data.message?.trim();
  if (!backendMsg) {
    fallback(
      apiErr.raw ||
      'Não foi possível completar a ação. Verifique sua conexão ou tente novamente.',
    );
    return;
  }

  const parts = backendMsg
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);
  const next: Errors = {};

  parts.forEach((p) => {
    const [field, ...rest] = p.split(':');
    if (field && rest.length) {
      const f = field.trim() as Field;
      let msg = rest.join(':').trim();

      next[f] = msg.charAt(0).toUpperCase() + msg.slice(1);
    }
  });

  if (Object.keys(next).length > 0) {
    setErrors(next);
    return;
  }

  const possibleFields: Field[] = [
    'name',
  ];

  const lowerMsg = backendMsg.toLowerCase();
  const matchedField = possibleFields.find((f) =>
    lowerMsg.includes(f.toLowerCase()),
  );

  if (matchedField) {
    setErrors({
      [matchedField]: backendMsg.charAt(0).toUpperCase() + backendMsg.slice(1),
    });
    return;
  }

  fallback(backendMsg.charAt(0).toUpperCase() + backendMsg.slice(1));
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceResponseDTO[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const { error, warning } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const loadingShown = useRef(false);

  const { isLoading, userInfo, hasAccess } = useProtectedPage({
    requiredRole: 'ROLE_USER',
  });

  const [form, setForm] = useState<ServiceFormState>({
    name: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (isLoading) {
      showLoading('Verificando autenticação...');
      if (!loadingShown.current) {
        loadingShown.current = true;
      }
    } else {
      setTimeout(() => {
        hideLoading();
      }, 1000);
    }
  }, [isLoading, showLoading, hideLoading, warning]);

  function validateField(field: Field, value: string, snapshot = form): string {
    switch (field) {
      case 'name':
      default:
        return '';
    }
  }

  function validateOnSubmit(): boolean {
    const next: Errors = {
      name: validateField('name', form.name),
    };
    setErrors(next);
    const ok = Object.values(next).every((v) => !v);
    if (!ok) {
      warning('Corrija os campos destacados!');
    }
    return ok;
  }

  const canClickSave = isEdit
    ? !!form.name.trim() : !!form.name.trim();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [s] = await Promise.all([
          api.getAllServices(),
        ]);
        if (!mounted) return;
        setServices(s);
      } catch (e) {
        console.error(e);
        error('Falha ao carregar dados');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const showPagination = services.length > 10;

  const openCreate = () => {
    setIsEdit(false);
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    setIsCreateOpen(false);
    setIsEdit(false);
    setForm({
      name: '',
    });
    setErrors({});
  };

  const onDelete = async (id: string) => {
    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
      setErrors({});
    } catch (err) {
      const apiErr = err as ApiError;
      const errorMessage = apiErr?.data?.message || apiErr?.raw || '';

      if (errorMessage.includes('foreign key constraint') || 
          errorMessage.includes('fk_servico') ||
          errorMessage.includes('still referenced')) {
        error('Não é possível excluir um serviço pertencente a algum usuário');
      } else {
        error('Falha ao deletar o serviço');
      }
    }
  };

  const onSave = async () => {
    if (!validateOnSubmit()) return;
    const payload = {
      name: form.name.trim(),
    };
    try {
      const created = await api.createService(payload);
      setServices((prev) => [created, ...prev]);
      closeCreate();
    } catch (err) {
      console.error(err);
      handleApiErrors(err as ApiError, setErrors, error);
      error('Não foi possível adicionar o serviço');
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
        <div className="text-base sm:text-lg">Carregando...</div>
      </div>
    );
  }

  if (!hasAccess || !userInfo) {
    return null;
  }

  return (
    <main className="mx-auto mt-16 sm:mt-20 w-full flex-1 px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-4 sm:mb-5 ml-0 sm:ml-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-0">Serviços</h1>
      </div>

      <FiltersBar
        onCreateAction={openCreate}
      />

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 text-gray-700 text-sm sm:text-base">
          Carregando...
        </div>
      ) : (
        <ServicesTable
          rows={services}
          showPagination={showPagination}
          onDeleteAction={onDelete}
        />
      )}

      <ServiceFormModal
        isOpen={isCreateOpen}
        isEdit={isEdit}
        form={form}
        errors={errors}
        canClickSave={canClickSave}
        onCloseAction={closeCreate}
        onSaveAction={onSave}
        onUpdateAction={onUpdate}
      />
    </main>
  );
}