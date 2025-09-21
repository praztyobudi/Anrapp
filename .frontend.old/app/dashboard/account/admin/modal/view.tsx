import Modal from '../../../../components/modal';

export const UserDetailModal = ({ showModal, setShowModal, selectedUser }) => {
    const formatDeviceInfo = (device) => {
        if (!device || typeof device !== 'object') {
            return 'Unknown device';
        }

        const os = device.os ?? '';
        const browser = device.browser ?? '';
        const devType = device.device ?? '';
        const model = device.model ?? '';
        const vendor = device.vendor ?? '';
        const parts = [os, browser, devType, model, vendor].filter(Boolean);
        return parts.length ? parts.join(', ') : 'Unknown device';
    };

    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <h2 className="text-xl font-bold text-center mb-4">Detail User</h2>
            <div className="border-b-2"></div>
            {selectedUser ? (
                <table className="w-full text-sm text-left text-gray-800 border border-gray-200 rounded-xl overflow-hidden">
                    <tbody className="bg-white">
                        <tr className="border-b">
                            <th className="px-4 py-2 text-gray-500 font-normal">NP</th>
                            <td className="px-4 py-2 font-medium">{selectedUser.np}</td>
                        </tr>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-gray-500 font-normal">Name</th>
                            <td className="px-4 py-2 font-medium">{selectedUser.name}</td>
                        </tr>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-gray-500 font-normal">Username</th>
                            <td className="px-4 py-2 font-medium">{selectedUser.username}</td>
                        </tr>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-gray-500 font-normal">Department</th>
                            <td className="px-4 py-2 font-medium">{selectedUser.department}</td>
                        </tr>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-gray-500 font-normal">Location</th>
                            <td className="px-4 py-2 font-medium">{selectedUser.location}</td>
                        </tr>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-gray-500 font-normal">Role</th>
                            <td className="px-4 py-2 font-medium">{selectedUser.role}</td>
                        </tr>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-gray-500 font-normal">Last Login</th>
                            <td className="px-4 py-2 font-medium">
                                {selectedUser.last_login
                                    ? new Date(selectedUser.last_login).toLocaleString('id-ID', {
                                        timeZone: 'Asia/Jakarta',
                                        dateStyle: 'medium',
                                        timeStyle: 'medium',
                                    })
                                    : 'Not detected'}
                            </td>
                        </tr>
                        <tr>
                            <th className="px-4 py-2 text-gray-500 font-normal">Last Device</th>
                            <td className="px-4 py-2 font-medium">{formatDeviceInfo(selectedUser.last_device)}</td>
                        </tr>
                    </tbody>
                </table>

            ) : (
                <p>User tidak ditemukan.</p>
            )}
        </Modal>
    )
};
