// utils/auth.ts
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export function getUserToken(): number | null {
  const token = Cookies.get('token');
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return  decoded.user_id ?? decoded.id ?? null; // atau decoded.id, sesuaikan isi JWT kamu
  } catch (err) {
    console.error('Failed to decode token', err);
    return null;
  }
}
