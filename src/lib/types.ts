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

// ===============================================
// DTOS PARA PLANOS DE CONTINGÊNCIA
// ===============================================

/**
 * @description Objeto de resposta da API para um Plano de Contingência.
 * Usado para exibir os planos na tabela e em detalhes.
 */
export type PlanResponseDTO = {
  id: string;
  cobrade: string;
  lastUpdated: string; // Recomenda-se usar o formato ISO 8601 (ex: "2025-08-11T20:55:36Z")
  service: ServiceSummaryDTO | null;
  city: CitySummaryDTO | null;
  fileUrl: string; // URL para o download do arquivo do plano
};

/**
 * @description Objeto enviado para a API para criar um novo Plano de Contingência.
 */
export type PlanRequestDTO = {
  cobrade: string;
  serviceId: string;
  cityId: string;
  // O arquivo em si (PDF) geralmente é enviado como FormData, não no JSON do DTO.
  // Opcionalmente, pode-se incluir metadados do arquivo se necessário.
  fileName?: string;
};

/**
 * @description Objeto para atualizar um Plano de Contingência existente.
 * Todos os campos são opcionais, permitindo a atualização parcial.
 */
export type PlanUpdateDTO = Partial<{
  cobrade: string;
  serviceId: string | null;
  cityId: string | null;
}>;
