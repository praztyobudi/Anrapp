export const getUsers = async () => {
    const res = await fetch('app.prazelab.my.id/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  };
  
  export const createUser = async (data: any) => {
    const res = await fetch('app.prazelab.my.id/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  };
  