import * as krisarRepo from '../../../repo/speak/krisar/krisar_repo.js';

class KrisarService {
    async findAllKrisar() {
        return await krisarRepo.krisarRepo.getAllKrisar();
    }
    async findKrisarById(id) {
        return await krisarRepo.krisarRepo.getKrisarById(id);
    }
    async createKrisar(data) {
        const { user_id, critique, suggestion } = data;
        if (!user_id || !critique || !suggestion) {
            throw new Error('Missing required fields: user_id, critique, suggestion');
        }
        const existingKrisar = await krisarRepo.krisarRepo.getKrisarById(data.id);
        if (existingKrisar) {
            throw new Error('Krisar entry already exists with this ID');
        }
        
        return await krisarRepo.krisarRepo.createKrisar(data);
    }
    async updateKrisar(id, data) {
        // Assuming the repo has a method to update an existing Krisar entry
        return await krisarRepo.krisarRepo.updateKrisar(id, data);
    }
    async deleteKrisar(id) {
        // Assuming the repo has a method to delete a Krisar entry
        return await krisarRepo.krisarRepo.deleteKrisar(id);
    }
}
export default new KrisarService();
//