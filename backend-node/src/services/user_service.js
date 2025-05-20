import bcrypt from 'bcrypt';
import * as userRepo from '../repo/user_repo.js'

export class UserService {
  async findAllUsers() {
    return await userRepo.getAllUsers();
  }

  async findUserById(id) {
    const user = await userRepo.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  }
  async createUser(name, password, username, department) {
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(password, saltRounds);
    const userAdd = await userRepo.createUser(name, hashPass, username, department);
    const getNameDept = await userRepo.getDepartmentName({ userId: userAdd.id });
    return getNameDept;
  }
  async updateUser(id, data) {
    const departmentId = await userRepo.getDepartmentName({ departmentName: data.department });

    if (!departmentId) {
      throw new Error(`Department "${data.department}" not found`);
    }

    const updatedUser = {
      ...data,
      department: departmentId
    };
    if (data.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      updatedUser.password = hashedPassword;
    }
    return await userRepo.updateUser(id, updatedUser);
  }
  async deleteUserById(id) {
    // opsional: cek user dulu
    const user = await userRepo.getUserById(id);
    if (!user) return null;

    const deleted = await userRepo.deleteUserById(id);
    if (!deleted) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
export const userService = new UserService();