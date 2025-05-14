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
import DeviceTableBody from '../components/DeviceTableBody';
import { useNavigate } from 'react-router-dom';
import { useDevices } from '../context/DeviceContext';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

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
    const [filterResult, setFilterResult] = useState('all');

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
        if (search) {
            filteredDevices = filteredDevices.filter(device =>
                device.code?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterDays !== 'all') {
            filteredDevices = filteredDevices.filter(device => {
                const daysToDue = calculateDaysToDue(device.lastCalibrationDate, device.calibrationFrequency);
                return daysToDue <= parseInt(filterDays);
            });
        }
        if (filterResult !== 'all') {
            filteredDevices = filteredDevices.filter(device => device.result === filterResult);
        }
        const newTotalPages = Math.ceil(filteredDevices.length / pageSize) || 1;
        setTotalPages(newTotalPages);

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setDisplayedDevices(filteredDevices.slice(startIndex, endIndex));
        // Không setPage ở đây!
    }, [allDevices, search, filterDays, page, filterResult]);

    // Tách phần điều chỉnh page ra effect riêng
    useEffect(() => {
        if (page > totalPages && totalPages > 0) {
            setPage(totalPages);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPages]);

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
            await axios.delete(`http://117.6.40.130:1337/api/devices/${selectedId}`);

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
        <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 60%, #e3eafc 100%)', minHeight: '100vh', padding: '2rem' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        background: '#fff',
                        borderRadius: 2,
                        boxShadow: 1,
                        px: 2,
                        py: 1,
                        minWidth: 900,
                    }}
                >
                    <TextField
                        label="Tìm kiếm thiết bị (theo mã số)"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        variant="outlined"
                        size="small"
                        sx={{
                            width: '400px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: '#f5f5f5',
                                '&:hover fieldset': {
                                    borderColor: '#25c2a0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1d3557',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#666',
                                '&.Mui-focused': {
                                    color: '#1d3557',
                                },
                            },
                        }}
                    />
                    <FormControl
                        size="small"
                        sx={{
                            width: '250px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: '#f5f5f5',
                                '&:hover fieldset': {
                                    borderColor: '#25c2a0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1d3557',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#666',
                                '&.Mui-focused': {
                                    color: '#1d3557',
                                },
                            },
                        }}
                    >
                        <InputLabel>Lọc ngày đến hạn</InputLabel>
                        <Select
                            value={filterDays}
                            label="Lọc ngày đến hạn"
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
                    <FormControl
                        size="small"
                        sx={{
                            width: '250px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: '#f5f5f5',
                                '&:hover fieldset': {
                                    borderColor: '#25c2a0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1d3557',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#666',
                                '&.Mui-focused': {
                                    color: '#1d3557',
                                },
                            },
                        }}
                    >
                        <InputLabel>Lọc trạng thái</InputLabel>
                        <Select
                            value={filterResult}
                            label="Lọc trạng thái"
                            onChange={(e) => {
                                setFilterResult(e.target.value);
                                setPage(1);
                            }}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="OK">Thiết bị OK</MenuItem>
                            <MenuItem value="NG">Thiết bị NG</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        ml: 2,
                        borderRadius: 2,
                        height: 40,
                        fontWeight: 'bold',
                        boxShadow: 1,
                        textTransform: 'none',
                    }}
                    onClick={() => navigate('/add-device')}
                >
                    + Thêm thiết bị
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ backgroundColor: '#fff', borderRadius: '12px' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: 'linear-gradient(135deg, #1d3557, #457b9d)' }}>
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
                            // color: '#fff',
                            '&:hover': {
                                backgroundColor: '#1d3557',
                                color: "#fff",
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#1d3557',
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