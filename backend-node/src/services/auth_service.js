import bcrypt from 'bcrypt';
import * as user_repo from '../repo/user_repo.js';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import dotenv from 'dotenv';
import { userAgent } from '../helper/useragent.js';
dotenv.config();

class AuthService {
  async login(username, password, uAgent) {
    const user = await user_repo.findUserByUsername(username);
    if (!user) {
      throw new Error('incorrect username');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('incorrect password');
    }
    const lastLogin = await user_repo.lastLogin(user.id);
    const loginTime = new Date(lastLogin).toLocaleString("id-ID", { timeZone: 'Asia/Jakarta' });
    console.log(`User ${user.username} last login at: ${loginTime}`);


    // Optional: bisa generate JWT di sini
    const payload = {
      id: user.id,
      name: user.name,
      department: user.department,
      role: user.role,
      // username: user.username,
    };

    // parsing device info
    const deviceInfo = userAgent(uAgent);
    await user_repo.lastDevice(user.id, deviceInfo);

    //Generate Token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Refresh token
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    // Simpan refresh token di Redis
    await redisClient.set(`refresh_token:${user.id}`, refreshToken, {
      // EX: 7 * 24 * 60 * 60 // expire 7 hari
      EX: parseInt(process.env.REDIS_EXPIRES_IN),
    });
    console.log('Refresh token saved in Redis');

    // Return data yang dibutuhkan aja
    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        department: user.department,
        role: user.role,
      },
      token,
      refreshToken,
      loginTime,
      deviceInfo,
    };
  }
}

export default new AuthService();
