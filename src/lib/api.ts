import Cookies from 'js-cookie';
import { decodeJWT } from './jwt';
import {
  CityResponseDTO,
  ScenarioRequestDTO,
  ScenarioResponseDTO,
  ScenarioUpdateDTO,
  ServiceResponseDTO,
  UserRequestDTO,
  UserResponseDTO,
  UserUpdateDTO,
  CobradeDTO,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    let data: unknown = undefined;
    try {
      data = txt ? JSON.parse(txt) : undefined;
    } catch {}
    throw { status: res.status, data, raw: txt };
  }

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return null as unknown;
  return res.json();
}

async function fetchWithAuth(input: string, init?: RequestInit) {
  const token = Cookies.get('token');
  const headers = new Headers(init?.headers || {});
  if (!headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${input}`, {
    ...init,
    headers,
    credentials: 'omit',
  });

  return handleResponse(res);
}

async function fetchWithAuthVoid(
  input: string,
  init?: RequestInit,
): Promise<void> {
  const token = Cookies.get('token');
  const headers = new Headers(init?.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${input}`, {
    ...init,
    headers,
    credentials: 'omit',
  });

  await handleResponse(res);
}

async function fetchPublic(input: string, init?: RequestInit) {
  const headers = new Headers(init?.headers || {});
  if (!headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json');

  const res = await fetch(`${BASE_URL}${input}`, {
    ...init,
    headers,
    credentials: 'omit',
  });

  return handleResponse(res);
}

export const api = {
  login: async (email: string, password: string) => {
    console.log('API URL:', BASE_URL);
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await handleResponse(res);

    Cookies.set('token', data.token, { expires: 1, sameSite: 'strict' });

    const userInfo = decodeJWT(data.token);
    if (userInfo) {
      Cookies.set('user', JSON.stringify(userInfo), {
        expires: 1,
        sameSite: 'strict',
      });

      if (userInfo.roles.includes('ROLE_ADMIN')) {
        data.redirectTo = '/admin/users';
      } else if (userInfo.roles.includes('ROLE_USER')) {
        data.redirectTo = '/user';
      }
    }

    return data;
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },

  post: <T = unknown>(url: string, body: unknown) =>
    fetchPublic(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }) as Promise<T>,

  getUsers: (status?: 'active' | 'inactive') =>
    fetchWithAuth(`/api/users${status ? `?status=${status}` : ''}`) as Promise<
      UserResponseDTO[]
    >,

  getAllServices: () =>
    fetchWithAuth('/api/services') as Promise<ServiceResponseDTO[]>,
  getAllCobrades: () => fetchWithAuth('/api/cobrades') as Promise<CobradeDTO[]>,
  getCobradeById: (id: string) =>
    fetchWithAuth(`/api/cobrades/${id}`) as Promise<CobradeDTO>,

  getAllCities: () => fetchWithAuth('/api/city') as Promise<CityResponseDTO[]>,

  createUser: (payload: UserRequestDTO) =>
    fetchWithAuth('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }) as Promise<UserResponseDTO>,

  getUser: (id: string) =>
    fetchWithAuth(`/api/users/${id}`) as Promise<UserResponseDTO>,

  editUser: (id: string, payload: UserUpdateDTO) =>
    fetchWithAuth(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }) as Promise<UserResponseDTO>,

  disableUser: (id: string) =>
    fetchWithAuthVoid(`/api/users/disable/${id}`, { method: 'PATCH' }),

  enableUser: (id: string) =>
    fetchWithAuthVoid(`/api/users/enable/${id}`, {
      method: 'PATCH',
    }),

  getScenarios: () =>
    fetchWithAuth('/api/scenarios') as Promise<ScenarioResponseDTO[]>,

  getScenario: (id: string) =>
    fetchWithAuth(`/api/scenarios/${id}`) as Promise<ScenarioResponseDTO>,

  createScenario: (payload: ScenarioRequestDTO) =>
    fetchWithAuth('/api/scenarios', {
      method: 'POST',
      body: JSON.stringify(payload),
    }) as Promise<ScenarioResponseDTO>,

  updateScenario: (id: string, payload: ScenarioRequestDTO) =>
    fetchWithAuth(`/api/scenarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }) as Promise<ScenarioResponseDTO>,

  getAllScenarios: () =>
    fetchWithAuth('/api/scenarios') as Promise<ScenarioResponseDTO[]>,

  getScenarioByIdAndCobrade: (cityId: string, cobradeId: string) =>
    fetchWithAuth(
      `/api/scenarios/by-city-cobrade?cityId=${encodeURIComponent(cityId)}&cobradeId=${encodeURIComponent(cobradeId)}`,
    ) as Promise<ScenarioResponseDTO>,

  searchScenariosByCityAndCobrade: (
    cityId: string | null,
    cobradeId: string | null,
  ) => {
    const params = new URLSearchParams();
    if (cityId) params.append('cityId', cityId);
    if (cobradeId) params.append('cobradeId', cobradeId);
    const queryString = params.toString();
    return fetchPublic(
      `/api/scenarios/search/by-city-cobrade${queryString ? `?${queryString}` : ''}`,
    ) as Promise<ScenarioResponseDTO[]>;
  },

  downloadScenarioPdf: async (scenarioId: string) => {
    const token = Cookies.get('token');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(
      `${BASE_URL}/api/scenarios/pdf/${scenarioId}/scenarios-by-subgroup`,
      {
        method: 'GET',
        headers,
        credentials: 'omit',
      },
    );

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Erro ao baixar PDF: ${res.status} ${txt}`);
    }
    return res;
  },

  publishScenario: (id: string) =>
    fetchWithAuth(`/api/scenarios/${id}/publish`, {
      method: 'PATCH',
    }) as Promise<ScenarioResponseDTO>,
};
