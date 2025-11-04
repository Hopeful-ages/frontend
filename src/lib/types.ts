export type UserResponseDTO = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  department: DepartmentSummaryDTO | null;
  city: CitySummaryDTO | null;
  accountStatus: boolean;
  role: RoleSummaryDTO | null;
};

export type UserRequestDTO = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  departmentId?: string;
  cityId?: string;
  roleId?: string;
};

export type DepartmentSummaryDTO = { id: string; name: string };
export type CitySummaryDTO = { id: string; name: string; state: string };
export type RoleSummaryDTO = { id: string; name: string };

export type DepartmentRequestDTO = { name: string };
export type DepartmentResponseDTO = DepartmentSummaryDTO;

export type CityResponseDTO = CitySummaryDTO;

export type RoleRequestDTO = { name: string };
export type RoleResponseDTO = RoleSummaryDTO;

export type TaskSummaryDTO = {
  id: string;
  description: string;
  phase: string;
  lastUpdateDate: string;
  department: DepartmentSummaryDTO | null;
};

export type TaskResponseDTO = TaskSummaryDTO;

export type ParameterSummaryDTO = {
  id: string;
  description: string;
  action: string;
  phase: string;
};

export type ParameterResponseDTO = ParameterSummaryDTO;

export type ScenarioResponseDTO = {
  id: string;
  description: string | null;
  origin: string;
  city: CityResponseDTO;
  cobrade: CobradeDTO;
  tasks: TaskSummaryDTO[];
  parameters: ParameterSummaryDTO[];
  published?: boolean;
};

export type UserUpdateDTO = Partial<{
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  departmentId: string | null;
  cityId: string | null;
  roleId: string | null;
  accountStatus: boolean;
}>;

export type CobradeDTO = {
  id: string;
  code: string;
  description: string;
  subgroup: string;
  type: string | null;
  subType: string | null;
};

export type TaskRequestDTO = {
  description: string;
  phase: 'ANTES' | 'DURANTE' | 'DEPOIS';
  serviceId?: string | null;
};

export type TaskUpdateDTO = Partial<{
  description: string;
  phase: 'ANTES' | 'DURANTE' | 'DEPOIS';
  lastUpdateDate: string;
  serviceId: string | null;
}>;

export type ParameterRequestDTO = {
  description: string;
  action: string;
  phase: 'ANTES' | 'DURANTE' | 'DEPOIS';
};

export type ParameterUpdateDTO = Partial<{
  description: string;
  action: string;
  phase: 'ANTES' | 'DURANTE' | 'DEPOIS';
}>;

export type ScenarioRequestDTO = {
  description?: string | null;
  origin: string;
  cityId: string;
  cobradeId: string;
  tasks?: TaskRequestDTO[];
  parameters?: ParameterRequestDTO[];
  published?: boolean;
};

export type ScenarioUpdateDTO = Partial<{
  description: string | null;
  origin: string;
  cityId: string;
  cobradeId: string;
  tasks: TaskUpdateDTO[];
  parameters: ParameterUpdateDTO[];
}>;
export type ApiError = {
  status: number;
  data?: {
    error?: string;
    message?: string;
  };
  raw?: string;
};
