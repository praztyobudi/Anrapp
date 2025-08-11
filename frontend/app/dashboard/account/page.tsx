"use client"

import AdminPage from "./admin/page";
import { useEffect, useState } from "react";
import UserPage from "./user/page";
import { decodedToken, getToken, UserPayload } from "../../utils/jwtdecode";

export default function autentikasiUser() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [useRole, setUseRole] = useState(false);
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    try {
      const decode = decodedToken(token);
      setUser(decode);
      setUseRole(decode.role === 'admin')
    } catch {
      setUser(null)
      setUseRole(false)
    }
  }, []);
  return (<div>
    {
      useRole ? (
        <AdminPage />
      ) : (
        <UserPage />
      )
    }
  </div>);
}
