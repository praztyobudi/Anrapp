// utils/auth.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export interface UserPayload {
  id: number;
  name: string;
  role: string;
  department: string;
}

export function getToken(): string | null {
  return Cookies.get("token") || null;
}
export function decodedToken(token: string): UserPayload | null {
  try {
    const decoded = jwtDecode<UserPayload>(token);
    return decoded;
  } catch (err) { 
    console.error("Failed to decode token", err);
    return null;
  }
}

export function getIdToken(): number | null {
  const token = getToken();
  if (!token) return null;

  const decoded = decodedToken(token);
  return decoded?.id ?? null;
}
