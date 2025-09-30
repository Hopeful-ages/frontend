'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Save, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

type CreateUserTaskProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    service: string;
    description: string;
    phase: string;
    id?: string;
  }) => void;
  userServiceName: string;
  currentPhase: string;
  editingTask?: {
    id: string;
    description: string;
  } | null;
};

export function CreateUserTask({
  isOpen,
  onClose,
  onSave,
  userServiceName,
  currentPhase,
  editingTask = null,
}: CreateUserTaskProps) {
  const [task, setTask] = useState('');
  const { warning } = useToast();

  // Atualiza os campos quando editingTask muda
  useEffect(() => {
    if (editingTask) {
      setTask(editingTask.description || '');
    } else {
      setTask('');
    }
  }, [editingTask, isOpen]);

  const handleSave = () => {
    if (!task.trim()) {
      warning('Digite a descrição da tarefa!');
      return;
    }

    const taskData = {
      service: userServiceName,
      description: task.trim(),
      phase: currentPhase,
      ...(editingTask && { id: editingTask.id }),
    };

    onSave(taskData);
    setTask('');
    onClose();
  };

  const handleClose = () => {
    setTask('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingTask ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}
      size="md"
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            onClick={handleSave}
            variant="secondary"
            leftIcon={<Save size={16} />}
          >
            Salvar
          </Button>
          <Button
            onClick={handleClose}
            variant="danger"
            leftIcon={<X size={16} />}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <div className="mt-6 w-full space-y-6">
        <div className="w-full">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Serviço
            </label>
            <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
              {userServiceName}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Este é o seu serviço atual e não pode ser alterado
            </p>
          </div>
        </div>
        <Input
          name="task"
          placeholder="Digite a descrição da tarefa"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full"
          variant={'default'}
        />
      </div>
    </Modal>
  );
}
