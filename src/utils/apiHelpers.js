import axios from 'axios';

export const deleteDevice = async (id) => {
    if (!id) {
        console.error("ID không hợp lệ!");
        return false;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thiết bị này?");
    if (!confirmDelete) return false;

    try {        
        // Gọi API để xóa
        await axios.delete(`http://192.168.10.87:1337/api/devices/${id}`);
        console.log("Thiết bị đã được xóa thành công!");
        return true;
    } catch (error) {
        console.error("Lỗi khi xóa thiết bị:", error);
        alert("Không thể xóa thiết bị. Vui lòng thử lại sau!");
        return false;
    }
};
export const addDeviceApi = async (deviceData) => {
    return axios.post(
      'http://192.168.10.87:1337/api/devices',
      {
        data: deviceData,
      }
    );
  };