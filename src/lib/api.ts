import Cookies from 'js-cookie';
import { decodeJWT } from './jwt';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = {
  login: async (email: string, password: string) => {
    console.log('API URL:', BASE_URL);
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    if (!res.ok) throw new Error('Falha no login');

    const data = await res.json();

    Cookies.set('token', data.token, { expires: 1, sameSite: 'strict' });

    const userInfo = decodeJWT(data.token);
    if (userInfo) {
      Cookies.set('user', JSON.stringify(userInfo), {
        expires: 1,
        sameSite: 'strict',
      });

      if (userInfo.roles.includes('ROLE_ADMIN')) {
        data.redirectTo = '/admin';
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
};
