import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
} from '@mui/material';
import { useDevices } from '../context/DeviceContext';
import { enqueueSnackbar } from 'notistack';

const Calibration = () => {
  const navigate = useNavigate();
  const [deviceCode, setDeviceCode] = useState(''); // Trạng thái cho input mã số
  const [error, setError] = useState(null);
  const { allDevices, setLoading } = useDevices(); 

  const handleInputChange = (e) => {
    setDeviceCode(e.target.value);
    setError(null); // Xóa lỗi khi người dùng nhập lại
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Bật trạng thái loading khi bắt đầu xử lý

    if (!deviceCode.trim()) {
      setError('Vui lòng nhập mã số thiết bị.');
      setLoading(false); // Tắt loading nếu có lỗi
      return;
    }

    // Kiểm tra xem thiết bị có tồn tại trong allDevices không
    const deviceExists = allDevices.filter((device) => device.code === deviceCode);

    if (deviceExists.length === 0) {
        console.log("Không tìm thấy thiết bị có code =", deviceCode);
        enqueueSnackbar(`Không tìm thấy thiết bị có code =`, { variant: 'error' });
    } else if (deviceExists.length > 1) {
        console.warn("⚠️ Mã sản phẩm bất thường, vui lòng báo cho Admin!");
        enqueueSnackbar(`⚠️ Mã sản phẩm bất thường, vui lòng báo cho Admin!`, { variant: 'warning' });
    } else {
        console.log("Thiết bị tìm thấy:", deviceExists[0]);
        enqueueSnackbar(`Tìm thấy thiết bị mã số: ${deviceExists[0].code}`, { variant: 'success' });
        navigate(`/device-detail/${deviceExists[0].documentId}`);
    }

    setLoading(false); // Tắt loading sau khi xử lý xong
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'linear-gradient(135deg, #000 50%, #1a1a1a 100%)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: '2.5rem',
          width: '100%',
          maxWidth: '500px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: '#fe2c55',
            fontWeight: 'bold',
            mb: 3,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Tìm Thiết Bị
        </Typography>

        {/* Thông báo lỗi */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        {/* Form nhập mã số */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nhập mã số thiết bị"
            value={deviceCode}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(45deg, #fe2c55, #25c2a0)',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '10px',
              mt: 3,
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(254, 44, 85, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e0294b, #20a88a)',
                boxShadow: '0 6px 20px rgba(254, 44, 85, 0.6)',
              },
            }}
          >
            Tìm và Hiệu chuẩn
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Calibration;