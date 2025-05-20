import bcrypt from 'bcrypt';
import * as auth_repo from '../repo/auth_repo.js';

class AuthService {
  async login(username, password) {
    const user = await auth_repo.findUserByUsername(username);

    if (!user) {
      throw new Error('incorrect username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('incorrect username or password');
    }

    // Optional: bisa generate JWT di sini

    // Return data yang dibutuhkan aja
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      department: user.department
    };
  }
}

export default new AuthService();
