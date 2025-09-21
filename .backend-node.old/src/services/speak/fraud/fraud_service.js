import * as fraudRepo from "../../../repo/speak/fraud/fraud_repo.js";

class FraudService {
  async findAllFraud() {
    return await fraudRepo.fraudRepo.getAllFraud();
  }

  async findFraudById(id) {
    return await fraudRepo.fraudRepo.getFraudById(id);
  }

  async createFraud(data) {
    const { user_id, fraud_message, types } = data;
    if (!user_id || !fraud_message || !types) {
      throw new Error(
        "Missing required fields: user_id, fraud_type, description"
      );
    }
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
