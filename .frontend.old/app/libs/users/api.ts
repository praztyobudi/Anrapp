export const getUsers = async () => {
  const res = await fetch("https://app.prazelab.my.id/api/users", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const getUserById = async (id: number) => {
  const res = await fetch(`https://app.prazelab.my.id/api/users/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const createUser = async (data: any) => {
  const res = await fetch("https://app.prazelab.my.id/api/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetch(`https://app.prazelab.my.id/api/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok || result.status !== "success") {
    throw new Error(result.message || "Gagal menghapus user");
  }
};

export const updateUser = async (id: number, data: any) => {
  const res = await fetch(`https://app.prazelab.my.id/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Username already exists");
  return res.json();
};

export const me = async () => {
  const res = await fetch("https://app.prazelab.my.id/api/me", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}
