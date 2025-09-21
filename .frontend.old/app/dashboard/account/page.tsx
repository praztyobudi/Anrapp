"use client"

import AdminPage from "./admin/page";
import { useEffect, useState } from "react";
import UserPage from "./user/page";
import { UserPayload } from "../../utils/jwtdecode";
import { me } from "../../libs/users/api";

export default function autentikasiUser() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [useRole, setUseRole] = useState(false);
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await me();
        if (!res) return;
        setUser(res);
        setUseRole(res.data.role === "admin");
      } catch (err) {
        setUser(null);
        setUseRole(false);
      }
    };

    fetchMe();
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
