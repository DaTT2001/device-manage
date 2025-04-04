import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Pagination,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
// import { useDevices } from '../context/DeviceContext'; // Import custom hook
import DeviceTableBody from './DeviceTableBody';
import { useNavigate } from 'react-router-dom';
import { useDevices } from '../context/DeviceContext';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
// import { Navigate } from 'react-router-dom';

const DeviceList = () => {
    const navigate = useNavigate();
    const { allDevices, loading, error, fetchAllDevices, setLoading } = useDevices(); // Lấy toàn bộ dữ liệu từ context
    const [displayedDevices, setDisplayedDevices] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterDays, setFilterDays] = useState('all');
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const pageSize = 25;

    const getDaysDifference = (date1, date2) => {
        const diffTime = date2.getTime() - date1.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const calculateDaysToDue = (lastCalibrationDate, calibrationFrequency) => {
        if (!lastCalibrationDate || !calibrationFrequency) return Infinity;
        const today = new Date();
        const lastDate = new Date(lastCalibrationDate);
        const dueDate = new Date(lastDate);
        dueDate.setMonth(dueDate.getMonth() + calibrationFrequency);
        return getDaysDifference(today, dueDate);
    };

    useEffect(() => {
        // Xử lý filter và search phía client
        let filteredDevices = allDevices;

        // Filter theo search
        if (search) {
            filteredDevices = filteredDevices.filter(device =>
                device.code?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter theo ngày đến hạn
        if (filterDays !== 'all') {
            filteredDevices = filteredDevices.filter(device => {
                const daysToDue = calculateDaysToDue(device.lastCalibrationDate, device.calibrationFrequency);
                return daysToDue <= parseInt(filterDays) && daysToDue >= 0;
            });
        }

        // Cập nhật phân trang
        const newTotalPages = Math.ceil(filteredDevices.length / pageSize);
        setTotalPages(newTotalPages);

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setDisplayedDevices(filteredDevices.slice(startIndex, endIndex));

        // Điều chỉnh page nếu vượt quá totalPages
        if (page > newTotalPages && newTotalPages > 0) {
            setPage(newTotalPages);
        }
    }, [allDevices, search, filterDays, page]);

    const handleEdit = (id) => {
        console.log('Edit device:', id);
        navigate(`/edit-device/${id}`)
    };
    const handleOpenConfirm = (id) => {
        setSelectedId(id);
        setOpen(true);
        const deviceExists = allDevices.find((device) => device.documentId === id);
        setSelectedDevice(deviceExists);
        console.log(deviceExists);
    };

    // Đóng modal
    const handleCloseConfirm = () => {
        setOpen(false);
        setSelectedId(null);
        setSelectedDevice(null);
    };
    const handleDelete = async () => {
        if (!selectedId) {
            console.error("ID không hợp lệ!");
            return;
        }

        try {
            setLoading(true);
            console.log("Đang xóa thiết bị:", selectedId);

            // Gọi API xóa thiết bị
            await axios.delete(`http://192.168.10.87:1337/api/devices/${selectedId}`);

            // Cập nhật danh sách thiết bị
            await fetchAllDevices();

            enqueueSnackbar("Xóa thiết bị thành công!", { variant: "success" });
            console.log("Thiết bị đã được xóa thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa thiết bị:", error);
            enqueueSnackbar("Xóa thiết bị thất bại, vui lòng thử lại!", { variant: "error" });
        } finally {
            setLoading(false);
            handleCloseConfirm(); // Đóng modal sau khi xóa xong
        }
    };

    const isNearDue = (lastCalibrationDate, calibrationFrequency) => {
        if (!lastCalibrationDate || !calibrationFrequency) return false;
        const today = new Date();
        const lastDate = new Date(lastCalibrationDate);
        const dueDate = new Date(lastDate);
        dueDate.setMonth(dueDate.getMonth() + calibrationFrequency);
        return today >= dueDate;
    };

    return (
        <Box sx={{ background: 'linear-gradient(135deg, #000 50%, #1a1a1a 100%)', minHeight: '100vh', padding: '2rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 2 }}>
                <TextField
                    label="Tìm kiếm thiết bị (theo mã số)"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    variant="outlined"
                    sx={{
                        width: '50%',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#f5f5f5',
                            '&:hover fieldset': {
                                borderColor: '#25c2a0',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#fe2c55',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#666',
                            '&.Mui-focused': {
                                color: '#fe2c55',
                            },
                        },
                    }}
                />
                <FormControl sx={{
                    width: '200px',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f5f5f5',
                        '&:hover fieldset': {
                            borderColor: '#25c2a0',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#fe2c55',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#666',
                        '&.Mui-focused': {
                            color: '#fe2c55',
                        },
                    },
                }}>
                    <InputLabel>Lọc theo ngày đến hạn</InputLabel>
                    <Select
                        value={filterDays}
                        label="Lọc theo ngày đến hạn"
                        onChange={(e) => {
                            setFilterDays(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        <MenuItem value="30">Dưới 30 ngày</MenuItem>
                        <MenuItem value="15">Dưới 15 ngày</MenuItem>
                        <MenuItem value="7">Dưới 7 ngày</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ backgroundColor: '#fff', borderRadius: '12px' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: 'linear-gradient(45deg, #fe2c55, #25c2a0)' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>STT</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tên thiết bị</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Mã số</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Loại</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tự hiệu chuẩn</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Bên ngoài hiệu chuẩn</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Ngày HC kỳ trước</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tần suất (tháng)</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Ngày đến hạn</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Ngày nhắc nhở</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Căn cứ hiệu chuẩn</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <DeviceTableBody
                        devices={displayedDevices}
                        loading={loading}
                        page={page}
                        pageSize={pageSize}
                        handleEdit={handleEdit}
                        handleDelete={handleOpenConfirm}
                        getDaysDifference={getDaysDifference}
                        isNearDue={isNearDue}
                    />
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#fe2c55',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#25c2a0',
                                color: '#fff',
                            },
                        },
                    }}
                />
            </Box>
            {/* Modal Confirm */}
            {selectedDevice && (
                <Dialog open={open} onClose={handleCloseConfirm}>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn có chắc chắn muốn xóa thiết bị này không? Hành động này không thể hoàn tác!
                        </DialogContentText>
                        <DialogContentText sx={{ mt: 2 }}>
                            <strong>Tên:</strong> {selectedDevice.name} <br />
                            <strong>Mã:</strong> {selectedDevice.code} <br />
                            <strong>Tiêu chuẩn hiệu chuẩn:</strong> {selectedDevice.calibrationStandard}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirm} color="primary">
                            Hủy
                        </Button>
                        <Button onClick={handleDelete} color="error" autoFocus disabled={loading}>
                            {loading ? "Đang xóa..." : "Xác nhận xóa"}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default DeviceList;