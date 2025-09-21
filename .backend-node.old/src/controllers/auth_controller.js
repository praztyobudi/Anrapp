import authService from '../services/auth_service.js';
import { successResponse, errorResponse } from '../helper/response_status.js';
import redisClient from '../config/redis.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'];
    const { username, password } = req.body;
    if (!username || !password) {
      return errorResponse(res, 'Username and password are required', 400);
    }
    const { user, token, refreshToken, loginTime } = await authService.login(username, password, userAgent);
    // Set cookies
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None", // Wajib kalau frontend beda origin
        // maxAge: 24 * 60 * 60 * 1000, // 1 hari
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      });

    // Kirim data user tanpa token (token sudah tersimpan di cookie)
    return successResponse(res, 'Login successful', {
      id: user.id,
      name: user.name,
      username: user.username,
      department: user.department,
      role: user.role,
      token,
      refreshToken,
      lastLogin: loginTime,
      lastDevice: userAgent,
    });

  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};


export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const username = req.user.username;
    // await redisClient.del(`refresh_token:${userId}`);
    // console.log('User logged out:', username + ' success, at ' + new Date().toLocaleDateString());
    const deleted = await redisClient.del(`refresh_token:${userId}`);
    // console.log(`Refresh_token user ${username} [${deleted ? '✅ removed' : '❌ not found'}] at ${new Date().toISOString()}`);
    res
      .clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None" })
      .clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });
    return successResponse(res, 'Logout successful');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token is missing in cookies', 400);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const savedToken = await redisClient.get(`refresh_token:${decoded.id}`);
    if (!savedToken || savedToken !== refreshToken) {
      return errorResponse(res, 'Invalid or expired refresh token', 403);
    }

    // Buat token baru
    const newToken = jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        department: decoded.department,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    await redisClient.set(`refresh_token:${decoded.id}`, newToken, 'EX', 7 * 24 * 60 * 60);

    // Kirim token baru lewat cookie
    res.cookie("accessToken", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 60 * 1000, // 15 menit
    });

    return res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
    });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, "Refresh token expired, please login again", 401);
    }
    return errorResponse(res, "Invalid refresh token", 401);
  }
};

// export const refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return errorResponse(res, 'Refresh token is required', 400);
//     }

//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const savedToken = await redisClient.get(`refresh_token:${decoded.id}`);
//     if (savedToken !== refreshToken) {
//       return errorResponse(res, 'Expired refresh token', 401);
//     }
//     if (!savedToken) {
//       return errorResponse(res, 'Refresh token not found', 404);
//     }
//     const newTokens = jwt.sign(
//       {
//         id: decoded.id,
//         username: decoded.username,
//         department: decoded.department,
//         role: decoded.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );
//     console.log('User refreshed token:', decoded.username + ' success, at ' + new Date().toISOString());
//     return successResponse(res, 'Token refreshed successfully', {
//       token: newTokens,
//       id: decoded.id,
//       username: decoded.username,
//       department: decoded.department,
//     });
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return errorResponse(res, 'Refresh token expired, please login again', 401);
//     }
//     return errorResponse(res, 'Invalid refresh token', 401);
//   }
// };

