'use client';

import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import Header, { Role } from '@/components/Header';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import Table from '@/components/Table';
import { citiesApi } from '@/lib/city';
import { servicesApi } from '@/lib/service';
import { usersApi } from '@/lib/user';
import { City } from '@/types/city';
import { Service } from '@/types/service';
import { RegisterUserPassword, UserType } from '@/types/user';
import {
  Hammer,
  IdCard,
  Lock,
  MapPinPen,
  PenLine,
  Phone,
  Save,
  Trash2,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [newUser, setNewUser] = useState<RegisterUserPassword>({
    name: '',
    cpf: '',
    phone: '',
    password: '',
    confirmPassword: '',
    service: { id: 0, name: '' },
    city: { id: 0, name: '', state: '' },
    accountStatus: true,
  });
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await usersApi.getAll();
        setUsers(data);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await servicesApi.getAll();
        setServices(data);
        console.log(data);
      } catch (err) {
        console.error('Erro ao buscar serviços:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const data = await citiesApi.getAll();
        setCities(data);
        console.log(data);
      } catch (err) {
        console.error('Erro ao buscar serviços:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleAddUser = () => setIsCreateModalOpen(true);

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveNewUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (newUser.password !== newUser.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }

      const createdUser = await usersApi.create(newUser);
      setUsers((prev) => [...prev, createdUser]);
      setIsCreateModalOpen(false);

      setNewUser({
        name: '',
        cpf: '',
        phone: '',
        password: '',
        confirmPassword: '',
        service: { id: 0, name: '' },
        city: { id: 0, name: '', state: '' },
        accountStatus: true,
      });
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      alert('Erro ao cadastrar usuário');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header role={Role.ADMIN} />
      <div className="mt-28 ml-6 flex flex-col gap-6 px-6">
        <h1 className="text-3xl font-bold">Usuários</h1>

        <div className="flex w-full items-center justify-between">
          <div className="flex flex-row gap-6">
            <Dropdown
              label="Serviço"
              items={services.map((service) => service.name)}
              onSelect={(item) => console.log('Selecionou', item)}
            />
            <Dropdown
              label="Cidade"
              items={cities.map((city) => city.name)}
              onSelect={(item) => console.log('Selecionou', item)}
            />
          </div>

          <Button onClick={handleAddUser} variant="ghost">
            <UserPlus size={20} />
          </Button>
        </div>
      </div>

      <div className="mt-15">
        {loading ? (
          <p>Carregando usuários...</p>
        ) : (
          <Table<UserType>
            rows={users}
            pageSize={10}
            defaultSort={{ accessor: 'name', dir: 'asc' }}
          >
            <Table.Header plain>
              <Table.Row>
                <Table.Heading<UserType>
                  accessor="name"
                  sortable
                  width="45%"
                  decorate={({ value }) => (
                    <span className="inline-flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{String(value ?? '')}</span>
                    </span>
                  )}
                >
                  Nome
                </Table.Heading>

                <Table.Heading<UserType>
                  accessor="service.name"
                  sortable
                  width="25%"
                >
                  Serviço
                </Table.Heading>
                <Table.Heading<UserType>
                  accessor="city.name"
                  sortable
                  width="20%"
                >
                  Cidade
                </Table.Heading>
                <Table.Heading width="5%" align="center">
                  Editar
                </Table.Heading>
                <Table.Heading width="5%" align="center">
                  Remover
                </Table.Heading>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Rows<UserType>>
                {(row) => (
                  <Table.Row<UserType> key={row.id} row={row}>
                    <Table.Cell field="name" />
                    <Table.Cell field="service.name" />
                    <Table.Cell field="city.name" />
                    <Table.Cell align="center">
                      <button
                        className="rounded p-1 hover:bg-gray-200/70"
                        aria-label="Editar"
                        onClick={() => handleEditUser(row)}
                      >
                        <PenLine className="h-4 w-4" />
                      </button>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <button
                        className="rounded p-1 hover:bg-gray-200/70"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Rows>
            </Table.Body>
          </Table>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Adicionar Usuário"
        size="auto"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={handleSaveNewUser}
              leftIcon={<Save />}
              type="submit"
              form="create-user-form"
            >
              Salvar
            </Button>
            <Button
              variant="danger"
              onClick={() => setIsCreateModalOpen(false)}
              leftIcon={<X />}
            >
              Cancelar
            </Button>
          </>
        }
      >
        <form
          id="create-user-form"
          onSubmit={handleSaveNewUser}
          className="grid grid-cols-2 gap-4"
        >
          <Input
            type="text"
            placeholder="Nome"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            icon={<User className="h-4 w-4" />}
          />
          <Input
            type="text"
            placeholder="CPF"
            value={newUser.cpf}
            onChange={(e) => setNewUser({ ...newUser, cpf: e.target.value })}
            icon={<IdCard className="h-4 w-4" />}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            icon={<Lock className="h-4 w-4" />}
          />
          <Input
            type="text"
            placeholder="Telefone"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            icon={<Phone className="h-4 w-4" />}
          />
          <Input
            type="password"
            placeholder="Confirmar Senha"
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({ ...newUser, confirmPassword: e.target.value })
            }
            icon={<Lock className="h-4 w-4" />}
          />
          <Dropdown
            label="Selecione Estado"
            items={cities.map((city) => city.state)}
            onSelect={(state) =>
              setNewUser({ ...newUser, city: { ...newUser.city, state } })
            }
            icon={<MapPinPen className="h-4 w-4" />}
          />
          <Dropdown
            label="Selecione Serviço"
            items={services.map((service) => service.name)}
            onSelect={(name) =>
              setNewUser({ ...newUser, service: { ...newUser.service, name } })
            }
            icon={<Hammer className="h-4 w-4" />}
          />
          <Dropdown
            label="Selecione Cidade"
            items={cities.map((city) => city.name)}
            onSelect={(name) =>
              setNewUser({ ...newUser, city: { ...newUser.city, name } })
            }
            icon={<MapPinPen className="h-4 w-4" />}
          />
        </form>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Usuário"
        size="auto"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => console.log('Salvar alterações de', editingUser)}
              leftIcon={<Save />}
            >
              Salvar
            </Button>
            <Button
              variant="danger"
              onClick={() => setIsEditModalOpen(false)}
              leftIcon={<X />}
            >
              Cancelar
            </Button>
          </>
        }
      >
        {editingUser && (
          <form className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Nome"
              className="rounded border border-gray-300 px-3 py-2"
              defaultValue={editingUser.name}
              icon={<User className="h-4 w-4" />}
            />
            <Input
              type="text"
              placeholder="CPF"
              className="rounded border border-gray-300 px-3 py-2"
              defaultValue={editingUser.cpf}
              icon={<IdCard className="h-4 w-4" />}
            />
            <Input
              type="text"
              placeholder="Telefone"
              className="rounded border border-gray-300 px-3 py-2"
              defaultValue={editingUser.phone}
              icon={<Phone className="h-4 w-4" />}
            />
            <Dropdown
              label="Selecione Estado"
              items={cities.map((city) => city.state)}
              onSelect={(item) => console.log('Selecionou', item)}
              icon={<MapPinPen className="h-4 w-4" />}
            />
            <Dropdown
              label="Selecione Serviço"
              items={services.map((service) => service.name)}
              onSelect={(item) => console.log('Selecionou', item)}
              icon={<Hammer className="h-4 w-4" />}
            />
            <Dropdown
              label="Selecione Cidade"
              items={cities.map((city) => city.name)}
              onSelect={(item) => console.log('Selecionou', item)}
              icon={<MapPinPen className="h-4 w-4" />}
            />
          </form>
        )}
      </Modal>
    </div>
  );
}
