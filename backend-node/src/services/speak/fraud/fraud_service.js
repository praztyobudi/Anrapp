  import * as fraudRepo from "../../../repo/speak/fraud/fraud_repo.js";

class FraudService {
  async findAllFraud(userId, userRole) {
    return await fraudRepo.fraudRepo.getAllFraud(userId, userRole);
  }

  async   findFraudById(id, userId, userRole) {
    return await fraudRepo.fraudRepo.getFraudById(id, userId, userRole);
  }

  async createFraud(data) {
    return await fraudRepo.fraudRepo.createFraud(data);
  }

  async updateFraud(id, data) {
    return await fraudRepo.fraudRepo.updateFraud(id, data);
  }

  async deleteFraud(id) {
    return await fraudRepo.fraudRepo.deleteFraud(id);
  }
}
export default new FraudService();
