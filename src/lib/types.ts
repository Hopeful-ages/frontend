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

export type CobradeResponseDTO = {
  id: string;
  code: string;
  description: string;
  subgroup: string;
  type: string;
  subType: string | null;
};

export type ApiError = {
  status: number;
  data?: {
    error?: string;
    message?: string;
  };
  raw?: string;
};
