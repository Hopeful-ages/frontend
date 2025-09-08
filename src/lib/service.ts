import { Service } from '@/types/service';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const token =
      'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImVtYWlsIjoiYWJuZXJAbmFvaW5mb21hZG8uY29tIiwiaWF0IjoxNzU3MzAxNDg5LCJleHAiOjE3NTczODc4ODl9.regCLHzKoisxVZUgW0GPFKaJY4OfieTUbRbx85joRGhbPtM1mBsvqNH3SWsi_j9aeEDa3xLll-Y-y9zinn-gGVq9QSeM7x8yGS_HrMm4VDj0RKBlRTpIvBGMojY9w8DJcuKzlkYNuImrEMmu14KZsti12Ox6Idp80_gFAxdfzEmh4laRw2aszO_ru5JMz__-J8CZeCoF_6DRz_vMrP76ODUnM0ri7X36wtaYXGOyfNl4nh7u3or7aXS2zWNfGXk2MDRv73V8KeUwXwj5qR-9XifIdTeE-XT01w6GkMB6Js9wJKyW8RaQhNk_gnC7bXlT1ERTrX-oq6JiDhYMN5fzFg';

    const res = await fetch(`${BASE_URL}/api/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Erro ao buscar serviços');
    return res.json();
  },
};
