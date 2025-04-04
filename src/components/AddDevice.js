import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useDevices } from '../context/DeviceContext';

const AddDevice = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    brand: '',
    selfCalibration: false,
    externalCalibration: false,
    lastCalibrationDate: null,
    calibrationFrequency: '',
    calibrationStandard: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { allDevices, setLoading, fetchAllDevices } = useDevices();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (
      !formData.name ||
      !formData.code ||
      !formData.brand ||
      !formData.calibrationFrequency
    ) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    // Kiểm tra xem code đã tồn tại chưa
    const isCodeExist = allDevices.some((device) => device.code === formData.code);
    if (isCodeExist) {
      setError('Mã số thiết bị đã tồn tại. Vui lòng sử dụng mã số khác.');
      return;
    }
    console.log(formData);
    
    try {
      const response = await axios.post(
        'http://192.168.10.87:1337/api/devices',
        {
          data: {
            name: formData.name,
            code: formData.code,
            brand: formData.brand,
            selfCalibration: formData.selfCalibration,
            externalCalibration: formData.externalCalibration,
            lastCalibrationDate: formData.lastCalibrationDate,
            calibrationFrequency: parseInt(formData.calibrationFrequency),
            calibrationStandard: formData.calibrationStandard,
          },
        }
      );
      enqueueSnackbar(`Thêm thiết bị ${response.data.data.code} thành công!`, { variant: 'success' });
      // setSuccess('Thêm thiết bị thành công!');
      setFormData({
        name: '',
        code: '',
        brand: '',
        selfCalibration: false,
        externalCalibration: false,
        lastCalibrationDate: '',
        calibrationFrequency: '',
        calibrationStandard: '',
      })
      await fetchAllDevices()
    } catch (err) {
      console.error('Error adding device:', err);
      setError('Không thể thêm thiết bị. Vui lòng thử lại sau.');
      enqueueSnackbar("Không thể thêm thiết bị. Vui lòng thử lại sau.", { variant: 'error' });
    };
  }
    return (
      <Container
        maxWidth={false}
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000 50%, #1a1a1a 100%)',
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
            Thêm Thiết Bị Đo Lường
          </Typography>

          {/* Thông báo */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
              {success}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Tên thiết bị"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
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
            <TextField
              label="Mã số"
              name="code"
              value={formData.code}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
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
            <TextField
              label="Loại"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
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
            <FormControlLabel
              control={
                <Checkbox
                  name="selfCalibration"
                  checked={formData.selfCalibration}
                  onChange={handleChange}
                  sx={{
                    color: '#25c2a0',
                    '&.Mui-checked': {
                      color: '#fe2c55',
                    },
                  }}
                />
              }
              label="Tự hiệu chuẩn"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="externalCalibration"
                  checked={formData.externalCalibration}
                  onChange={handleChange}
                  sx={{
                    color: '#25c2a0',
                    '&.Mui-checked': {
                      color: '#fe2c55',
                    },
                  }}
                />
              }
              label="Bên ngoài hiệu chuẩn"
              sx={{ mb: 1 }}
            />
            <TextField
              label="Ngày HC kỳ trước"
              name="lastCalibrationDate"
              type="date"
              value={formData.lastCalibrationDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              // required
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
            <TextField
              label="Tần suất hiệu chuẩn (tháng)"
              name="calibrationFrequency"
              type="number"
              value={formData.calibrationFrequency}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
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
            <TextField
              label="Căn cứ hiệu chuẩn"
              name="calibrationStandard"
              value={formData.calibrationStandard}
              onChange={handleChange}
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
              Thêm Thiết Bị
            </Button>
          </form>
        </Paper>
      </Container>
    );
  };

  export default AddDevice;