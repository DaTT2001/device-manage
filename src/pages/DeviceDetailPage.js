import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    Grid,
    Chip,
    Card,
    CardContent,
    Avatar,
    Stack,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BusinessIcon from '@mui/icons-material/Business';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import axios from 'axios';
import AddHistoryDialog from '../components/AddHistoryDialog';
import { enqueueSnackbar } from 'notistack';
import HistoryItem from '../components/HistoryItem';

const getDaysDifference = (date1, date2) => {
    const diffTime = date2.getTime() - date1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const DeviceDetailPage = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [daysUntilDue, setDaysUntilDue] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [history, setHistory] = useState([]);

    const handleAddHistory = async (item) => {
        try {
            await axios.post('http://117.6.40.130:1337/api/calibration-records', { data: item });
            enqueueSnackbar('Thêm ghi chép thành công', { variant: 'success' });
            setHistory((prevHistory) => [...prevHistory, item]);
        } catch (error) {
            console.log('Error adding history:', error);
            enqueueSnackbar('Thêm ghi chép thất bại', { variant: 'error' });
        }
    };

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const response = await axios.get(`http://117.6.40.130:1337/api/devices/${documentId}`);
                const device = response.data.data;
                if (device) setDevice(device);
            } catch (err) {
                setDevice(null);
            }
        };
        fetchDevice();
    }, [documentId]);

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const response = await axios.get(`http://117.6.40.130:1337/api/calibration-records?filters[deviceId][$eq]=${documentId}`);
                const devices = response.data.data;
                setHistory(devices);
                console.log("Device data:", devices);
                // if (device) setDevice(device);
            } catch (err) {
                setDevice(null);
            }
        };
        fetchDevice();
    }, [documentId]);

    useEffect(() => {
        if (!device) return;
        const lastDate = device.lastCalibrationDate ? new Date(device.lastCalibrationDate) : null;
        let nextDueDate = null;
        let days = null;
        if (lastDate && device.calibrationFrequency) {
            nextDueDate = new Date(lastDate);
            nextDueDate.setMonth(nextDueDate.getMonth() + device.calibrationFrequency);
            days = getDaysDifference(new Date(), nextDueDate);
        }
        setDueDate(nextDueDate);
        setDaysUntilDue(days);
    }, [device]);

    if (!device) {
        return <Typography sx={{ p: 4 }}>Không tìm thấy thiết bị.</Typography>;
    }

    return (
        <Box
            sx={{
                maxWidth: "80%", // Tăng maxWidth để chứa 3 cột
                mx: 'auto',
                mt: 5,
                mb: 5,
                px: { xs: 1, sm: 2 },
                background: 'linear-gradient(135deg, #f0f4fa 60%, #e3eafc 100%)',
                borderRadius: 4,
                boxShadow: 3,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 }, // Giảm padding để tiết kiệm không gian
                    borderRadius: 4,
                    background: 'transparent',
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                        <DescriptionIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="#1976d2">
                            Chi tiết thiết bị
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {device.name || 'Tên thiết bị'}
                        </Typography>
                    </Box>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={1} // Giảm spacing để vừa container
                    sx={{
                        maxWidth: '100%',
                        px: { xs: 1, md: 0 },
                        justifyContent: 'center', // Căn giữa các cột
                    }}
                >
                    <Grid item xs={12} md={6}>
                        <Card elevation={2} sx={{ mb: 2, borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                    <Inventory2Icon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Thông tin chung
                                    </Typography>
                                </Stack>
                                <Typography>
                                    <b>Mã số:</b> {device.code || 'N/A'}
                                </Typography>
                                <Typography>
                                    <b>Hãng:</b> {device.brand || 'N/A'}
                                </Typography>
                                <Typography>
                                    <b>Loại:</b> {device.type || 'N/A'}
                                </Typography>
                                <Typography>
                                    <b>Tần suất hiệu chuẩn:</b> {device.calibrationFrequency || 'N/A'}
                                </Typography>
                                <Typography sx={{ mt: 1 }} component="div">
                                    <b>Tự hiệu chuẩn:</b>{' '}
                                    <Chip
                                        label={device.selfCalibration ? 'Có' : 'Không'}
                                        color={device.selfCalibration ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Typography>
                                <Typography sx={{ mt: 1 }} component="div">
                                    <b>Bên ngoài hiệu chuẩn:</b>{' '}
                                    <Chip
                                        label={device.externalCalibration ? 'Có' : 'Không'}
                                        color={device.externalCalibration ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Typography>
                                <Typography sx={{ mt: 1 }} >
                                    <b>Sử dụng bởi:</b>{' '}
                                    {Array.isArray(device.usedBy) ? device.usedBy.join(', ') : device.usedBy || 'N/A'}
                                </Typography>
                                <Typography sx={{ mt: 1 }}>
                                    <b>Số điện thoại:</b> {device.phoneNumber || 'N/A'}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card elevation={2} sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                    <BusinessIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Thông tin mua sắm
                                    </Typography>
                                </Stack>
                                <Typography>
                                    <b>Phụ kiện:</b> {device.attached || 'N/A'}
                                </Typography>
                                <Typography>
                                    <b>Nhà cung cấp:</b> {device.supplier || 'N/A'}
                                </Typography>
                                <Typography>
                                    <b>Giá:</b> {device.cost ? Number(device.cost).toLocaleString('vi-VN') : 'N/A'}
                                </Typography>
                                <Typography>
                                    <b>Ngày mua:</b>{' '}
                                    {device.buyDate ? new Date(device.buyDate).toLocaleDateString('vi-VN') : 'N/A'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 3, mb: 2 }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                    <PictureAsPdfIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Thông tin hiệu chuẩn
                                    </Typography>
                                </Stack>
                                <Typography>
                                    <b>Ngày HC kỳ trước:</b>{' '}
                                    {device.lastCalibrationDate
                                        ? new Date(device.lastCalibrationDate).toLocaleDateString('vi-VN')
                                        : 'N/A'}
                                </Typography>
                                <Typography>
                                    <b>Ngày HC tiếp theo:</b>{' '}
                                    {dueDate ? dueDate.toLocaleDateString('vi-VN') : 'N/A'}
                                    {daysUntilDue !== null && (
                                        <span style={{ color: daysUntilDue < 0 ? 'red' : 'inherit', marginLeft: 8 }}>
                                            ({daysUntilDue < 0 ? `Quá hạn ${-daysUntilDue} ngày` : `Còn ${daysUntilDue} ngày`})
                                        </span>
                                    )}
                                </Typography>
                                <Typography>
                                    <b>Căn cứ hiệu chuẩn:</b> {device.calibrationStandard || 'N/A'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 3, mb: 2 }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                    <DescriptionIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Ghi chép lý lịch
                                    </Typography>
                                    {history.some(item => item.result === 'NG') ? (
                                        <Typography color="error" sx={{ ml: 2, fontWeight: 600 }}>
                                            Thiết bị NG
                                        </Typography>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            onClick={() => setOpenAddDialog(true)}
                                            sx={{ ml: 2, fontWeight: 600 }}
                                        >
                                            Thêm ghi chép
                                        </Button>
                                    )}
                                    <AddHistoryDialog
                                        open={openAddDialog}
                                        onClose={() => setOpenAddDialog(false)}
                                        onSave={handleAddHistory}
                                        deviceId={device.documentId}
                                    />
                                </Stack>
                                <Box sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 300, overflowY: 'auto' }}>
                                    {history.length === 0 ? (
                                        <Typography color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
                                            Không có ghi chép
                                        </Typography>
                                    ) : (
                                        history.map((item, idx) => (
                                            <HistoryItem item={item} idx={idx} key={idx} />
                                        ))
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                gap: 2,
                                justifyContent: { xs: 'center', md: 'flex-end' },
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PictureAsPdfIcon />}
                                onClick={() => navigate(`/device-detail/export/${device.documentId}`)}
                                sx={{ fontWeight: 600, minWidth: 140 }}
                            >
                                Xuất PDF
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate(-1)}
                                sx={{ fontWeight: 600, minWidth: 120 }}
                            >
                                Quay lại
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default React.memo(DeviceDetailPage);