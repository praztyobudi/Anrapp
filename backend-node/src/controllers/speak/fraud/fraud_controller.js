import {
  successResponse,
  errorResponse,
} from "../../../helper/response_status.js";
import FraudService from "../../../services/speak/fraud/fraud_service.js";

export const getAllFraud = async (req, res) => {
  try {
    const data = await FraudService.findAllFraud();
    return successResponse(res, "Success get all fraud reports", data);
  } catch (error) {
    console.error("Error in getAllFraud:", error);
    return errorResponse(res, "Failed to get fraud reports");
  }
};
export const getFraudById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await FraudService.findFraudById(id);
    if (!result) {
      return errorResponse(res, "Fraud report not found", null, 404);
    }
    return successResponse(res, "Success found fraud report", result);
  } catch (error) {
    console.error("Error in getFraudById:", error);
    return errorResponse(res, "Failed to get fraud report by ID");
  }
};
export const createFraud = async (req, res) => {
  try {
    const { type_id, fraud_message } = req.body;
    const user_id = req.user?.id;
    if (!user_id || !type_id || !fraud_message) {
      return errorResponse(res, "Missing required fields");
    }
    const result = await FraudService.createFraud({
      user_id,
      type_id,
      fraud_message,
    });
    return successResponse(
      res,
      "Fraud report created successfully",
      result,
      201
    );
  } catch (error) {
    console.error("Error in createFraud:", error);
    return errorResponse(res, "Failed to create fraud report");
  }
};
export const updateFraud = async (req, res) => {
  try {
    const id = req.params.id;
    const { fraud_message, type_id } = req.body;
    if (!fraud_message || !type_id) {
      return errorResponse(res, "Missing required fields");
    }
    const result = await FraudService.updateFraud(id, req.body);
    return successResponse(res, "Fraud report updated successfully", result);
  } catch (error) {
    console.error("Error in updateFraud:", error);
    return errorResponse(res, "Failed to update fraud report");
  }
};
export const deleteFraud = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await FraudService.deleteFraud(id);
    console.log("result", result);
    if (!result) {
      return errorResponse(res, "Fraud report not found", null, 404);
    }
    return successResponse(res, "Fraud report deleted successfully", result);
  } catch (error) {
    console.error("Error in deleteFraud:", error);
    return errorResponse(res, "Failed to delete fraud report");
  }
};
