import KrisarService from "../../../services/speak/krisar/krisar_service.js";
import {
  successResponse,
  errorResponse,
} from "../../../helper/response_status.js";

export const getAllKrisar = async (req, res) => {
  try {
    const data = await KrisarService.findAllKrisar();
    return successResponse(
      res,
      "Success get all critiques and suggestions",
      data
    );
  } catch (error) {
    console.error("Error in getAllKrisar:", error);
    return errorResponse(res, "Failed to get critiques and suggestions");
  }
};
export const getKrisarById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await KrisarService.findKrisarById(id);
    if (!result) {
      return errorResponse(res, "Critique or suggestion not found", null, 404);
    }
    return successResponse(res, "Success found critique or suggestion", result);
  } catch (error) {
    console.error("Error in getKrisarById:", error);
    return errorResponse(res, "Failed to get critique or suggestion by ID");
  }
};
export const createKrisar = async (req, res) => {
  try {
    const { critique, suggestion } = req.body;
    const user_id = req.user?.id;
    if (!user_id || !critique || !suggestion) {
      return errorResponse(res, "Missing required fields");
    }
    const result = await KrisarService.createKrisar({
      user_id,
      critique,
      suggestion,
    });
    return successResponse(
      res,
      "Critique or suggestion created successfully",
      result,
      201
    );
  } catch (error) {
    console.error("Error in createKrisar:", error);
    return errorResponse(res, "Failed to create critique or suggestion");
  }
};
export const updateKrisar = async (req, res) => {
  try {
    const id = req.params.id;
    const { critique, suggestion } = req.body;
    if (!critique || !suggestion) {
      return errorResponse(res, "Missing required fields");
    }
    const result = await KrisarService.updateKrisar(id, req.body);
    return successResponse(
      res,
      "Critique or suggestion updated successfully",
      result
    );
  } catch (error) {
    console.error("Error in updateKrisar:", error);
    return errorResponse(res, "Failed to update critique or suggestion");
  }
};
export const deleteKrisar = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await KrisarService.deleteKrisar(id);
    if (!result) {
      return errorResponse(res, "Critique or suggestion not found", null, 404);
    }
    return successResponse(
      res,
      "Critique or suggestion deleted successfully",
      result
    );
  } catch (error) {
    console.error("Error in deleteKrisar:", error);
    return errorResponse(res, "Failed to delete critique or suggestion");
  }
};
