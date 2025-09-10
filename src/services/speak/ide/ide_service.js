import * as fromIdeRepo from '../../../repo/speak/ide/ide_repo.js';
import { getDepartmentName } from '../../../helper/find_data.js';

class IdeService {
    async findAllIde(userId, userRole) {
        return await fromIdeRepo.ideRepo.getAllIde(userId, userRole);
    }
    async findIdeById(id, userRole, userId) {
        const ide = await fromIdeRepo.ideRepo.getIdeById(id, userRole, userId);
        if (!ide) throw new Error('Idea not found');
        return ide;
    }
    async createIde(ide) {
        return await fromIdeRepo.ideRepo.createIde(ide);
    }
    async updateIde(id, data, userId, userRole) {
        // Cari ID dari nama departemen
        const depId = await getDepartmentName({ departmentName: data.department });
        if (!depId) {
            throw new Error(`Department "${data.department}" not found`);
        }
        const cekIde = await fromIdeRepo.ideRepo.getIdeById(id, userRole, userId);
        if (!cekIde) {
            throw new Error('Idea not found or you do not have permission to delete it');
        }
        const updateIde = {
            ...data,
            department: depId
        };
        return await fromIdeRepo.ideRepo.updateIde(id, updateIde);
    }
    async deleteIde(id, userId, userRole) {
        // Cek apakah ide ada dan user memiliki hak untuk menghapusnya
        const cekIde = await fromIdeRepo.ideRepo.getIdeById(id, userRole, userId);
        if (!cekIde) {
            throw new Error('Idea not found or you do not have permission to delete it');
        }
        const result = await fromIdeRepo.ideRepo.deleteIdeById(id);
        return result.rowCount > 0;
    }



}

export default new IdeService();
