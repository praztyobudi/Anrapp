import bcrypt from 'bcrypt';
import * as userRepo from '../repo/user_repo.js'
import * as findDepartment from '../helper/find_data.js';

export class UserService {
  async findAllUsers() {
    return await userRepo.getAllUsers();
  }

  async findUserById(id) {
    const user = await userRepo.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  }
  async createUser(name, password, username, department, role) {
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(password, saltRounds);
    const userAdd = await userRepo.createUser(name, hashPass, username, department, role);
    // const getNameDept = await findDepartment.getDepartmentName({ userId: userAdd.id });
    return userAdd;
  }
  async updateUser(id, data) {
    const existingUser = await userRepo.getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    const departmentId = await findDepartment.getDepartmentName({ departmentName: data.department });
    const roleId = await findDepartment.getRoleName(data.role);
    if (!departmentId) {
      throw new Error(`Department "${data.department}" not found`);
    }
    if (data.username && data.username !== existingUser.username) {
      const isTaken = await userRepo.findUserByUsername(data.username);
      if (isTaken) {
        throw new Error(`Username "${data.username}" already exists`);
      }
    }
    const updatedUser = {
      ...data,
      department: departmentId,
      role: roleId
    };
    if (data.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      updatedUser.password = hashedPassword;
    } else {
      updatedUser.password = existingUser.password; 
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

  async getProfile(id) {
    const user = await userRepo.getUserById(id);
    if (!user) throw new Error('User not found');
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      department: user.department,
      role: user.role,
    };
  }
}
export const userService = new UserService();