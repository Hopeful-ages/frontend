'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Save, Hammer, X } from 'lucide-react';
import { Dropdown } from '@/components/Dropdown';
import { useToast } from '@/hooks/useToast';

type CreateTaskProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    service: string;
    description: string;
    phase: string;
    id?: string;
  }) => void;
  serviceNames: string[];
  currentPhase: string;
  editingTask?: {
    id: string;
    description: string;
    service?: string;
  } | null;
};

export function CreateTask({
  isOpen,
  onClose,
  onSave,
  serviceNames,
  currentPhase,
  editingTask = null,
}: CreateTaskProps) {
  const { warning } = useToast();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [task, setTask] = useState('');

  // Atualiza os campos quando editingTask muda
  useEffect(() => {
    if (editingTask) {
      setSelectedService(editingTask.service || null);
      setTask(editingTask.description || '');
    } else {
      setSelectedService(null);
      setTask('');
    }
  }, [editingTask, isOpen]);

  const handleSave = () => {
    console.log('handleSave chamado');
    console.log('selectedService:', selectedService);
    console.log('task:', task);
    console.log('currentPhase:', currentPhase);

    if (!selectedService || !task.trim()) {
      warning('Selecione um serviço e digite a tarefa!');
      return;
    }

    const taskData = {
      service: selectedService.trim(),
      description: task.trim(),
      phase: currentPhase,
      ...(editingTask && { id: editingTask.id }),
    };

    console.log('taskData:', taskData);
    onSave(taskData);
    setSelectedService(null);
    setTask('');
    onClose();
  };

  const handleClose = () => {
    setSelectedService(null);
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
          <Dropdown
            label="Selecione o Serviço"
            items={serviceNames}
            onSelect={(v) => {
              setSelectedService(v);
            }}
            size="medium"
            bgColor="white"
            border="gray"
            textColor="gray"
            textSize="sm"
            roundedBorder="lg"
            maxItemsVisible={3}
            icon={<Hammer className="h-4 w-4" />}
            fullWidth
            value={selectedService || ''}
            useAutoComplete
          />
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
