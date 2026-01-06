import * as fraudRepo from "../../../repo/speak/fraud/fraud_repo.js";
import fs from "fs/promises";
import path from "path";

class FraudService {
  async findAllFraud(userId, userRole) {
    return await fraudRepo.fraudRepo.getAllFraud(userId, userRole);
  }

  async findFraudById(id, userId, userRole) {
    return await fraudRepo.fraudRepo.getFraudById(id, userId, userRole);
  }

  async createFraud(data) {
    return await fraudRepo.fraudRepo.createFraud(data);
  }

  async updateFraud(id, data) {
    return await fraudRepo.fraudRepo.updateFraud(id, data);
  }

  // async deleteFraud(id) {
  //   return await fraudRepo.fraudRepo.deleteFraud(id);
  // }
  async deleteFraud(id) {
    const fraudId = await fraudRepo.fraudRepo.getFraudById_del(id);
    if (!fraudId) return null;
    const pathImg = fraudId.img ? fraudId.img : null;
    const deleted = await fraudRepo.fraudRepo.deleteFraud(id);
    if (pathImg) {
      const fullPath = path.join(process.cwd(), 'src', pathImg);
      try {
        await fs.unlink(fullPath);
        console.log("File deleted:", fullPath);
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    }
    return deleted;
  }

}
export default new FraudService();
