export type UserResponseDTO = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  service: ServiceSummaryDTO | null;
  city: CitySummaryDTO | null;
  accountStatus: boolean;
};

export type UserRequestDTO = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  serviceId?: string;
  cityId?: string;
};

export type ServiceSummaryDTO = { id: string; name: string };
export type CitySummaryDTO = { id: string; name: string; state: string };

export type ServiceResponseDTO = ServiceSummaryDTO;
export type CityResponseDTO = CitySummaryDTO;

export type TaskSummaryDTO = { 
  id: string; 
  description: string; 
  phase: string; 
  lastUpdatedDate: Date; 
  service: ServiceSummaryDTO | null 
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
  description: string;
  origin: string;
  city: CityResponseDTO;
  cobrade: CobradeResponseDTO;
  tasks: TaskSummaryDTO;
  parameters: ParameterSummaryDTO;
};

export type UserUpdateDTO = Partial<{
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  serviceId: string | null;
  cityId: string | null;
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

export type TaskResponseDTO = {
  id: string;
  description: string;
  phase: 'ANTES' | 'DURANTE' | 'DEPOIS';
  lastUpdateDate: string; // ISO 8601
  service: ServiceSummaryDTO | null;
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

export type ParameterResponseDTO = {
  id: string;
  description: string;
  action: string;
  phase: 'ANTES' | 'DURANTE' | 'DEPOIS';
};

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

export type ScenarioResponseDTO = {
  id: string;
  description: string | null;
  origin: string;
  city: CitySummaryDTO;
  cobrade: CobradeDTO;
  tasks: TaskResponseDTO[];
  parameters: ParameterResponseDTO[];
};

export type ScenarioRequestDTO = {
  description?: string | null;
  origin: string;
  cityId: string;
  cobradeId: string;
  tasks?: TaskRequestDTO[];
  parameters?: ParameterRequestDTO[];
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
