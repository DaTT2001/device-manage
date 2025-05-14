import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useDevices } from '../context/DeviceContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { fields, textFieldStyle } from '../utils/constants';

const validationSchema = Yup.object({
  name: Yup.string().required('Tên thiết bị là bắt buộc'),
  code: Yup.string().required('Mã thiết bị là bắt buộc'),
  brand: Yup.string().required('Thương hiệu là bắt buộc'),
  type: Yup.string().required('Loại thiết bị là bắt buộc'),
  calibrationFrequency: Yup.number()
    .required('Chu kỳ hiệu chuẩn là bắt buộc')
    .positive('Chu kỳ hiệu chuẩn phải là số dương')
    .integer('Chu kỳ hiệu chuẩn phải là số nguyên'),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, 'Số điện thoại chỉ được chứa chữ số')
    .nullable(),
  cost: Yup.number().nullable().positive('Chi phí phải là số dương'),
  buyDate: Yup.string().nullable(),
  lastCalibrationDate: Yup.string().nullable(),
  selfCalibration: Yup.boolean(),
  externalCalibration: Yup.boolean(),
  usedBy: Yup.array().of(Yup.string()).min(1, 'Vui lòng chọn ít nhất một mục'),
}).test('calibration-type', 'Vui lòng chọn một loại hiệu chuẩn', function (value) {
  return value.selfCalibration || value.externalCalibration;
});

const updateDeviceApi = async (id, deviceData) => {
  return axios.put(`http://117.6.40.130:1337/api/devices/${id}`, { data: deviceData });
};

const EditDevice = () => {
  const { documentId } = useParams();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchAllDevices } = useDevices();

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      name: '',
      code: '',
      brand: '',
      type: '',
      calibrationFrequency: '',
      phoneNumber: '',
      attached: '',
      supplier: '',
      cost: '',
      buyDate: '',
      lastCalibrationDate: '',
      calibrationStandard: '',
      selfCalibration: false,
      externalCalibration: false,
      usedBy: [],
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await axios.get(`http://117.6.40.130:1337/api/devices/${documentId}`);
        const device = response.data.data;
        if (device) {
          reset({
            name: device.name || '',
            code: device.code || '',
            brand: device.brand || '',
            type: device.type || '',
            calibrationFrequency: device.calibrationFrequency?.toString() || '',
            phoneNumber: device.phoneNumber || '',
            attached: device.attached || '',
            supplier: device.supplier || '',
            cost: device.cost?.toString() || '',
            buyDate: device.buyDate || '',
            lastCalibrationDate: device.lastCalibrationDate || '',
            calibrationStandard: device.calibrationStandard || '',
            selfCalibration: device.selfCalibration || false,
            externalCalibration: device.externalCalibration || false,
            usedBy: device.usedBy || [],
          });
        } else {
          setError('Không tìm thấy thiết bị với mã số này.');
        }
      } catch (err) {
        console.error('Error fetching device:', err);
        setError('Không thể tải dữ liệu thiết bị. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [documentId, reset]);

  const onSubmit = async (values) => {
    setError(null);
    setSuccess(null);

    const trimmedValues = { ...values };
    Object.keys(trimmedValues).forEach(key => {
      if (typeof trimmedValues[key] === 'string') {
        trimmedValues[key] = trimmedValues[key].trim();
      }
    });

    const dataToSend = {
      ...trimmedValues,
      cost: trimmedValues.cost ? parseFloat(trimmedValues.cost) : null,
      calibrationFrequency: parseInt(trimmedValues.calibrationFrequency),
      usedBy: JSON.stringify(trimmedValues.usedBy),
    };

    ['buyDate', 'lastCalibrationDate'].forEach(field => {
      if (!dataToSend[field]) {
        delete dataToSend[field];
      }
    });

    try {
      console.log('Dữ liệu gửi lên API:', dataToSend);
      const response = await updateDeviceApi(documentId, dataToSend);
      enqueueSnackbar(`Cập nhật thiết bị ${response.data.data.code} thành công!`, { variant: 'success' });
      setSuccess('Cập nhật thành công!');
      await fetchAllDevices();
    } catch (err) {
      console.error('API error details:', err.response?.data, err.message);
      setError('Không thể cập nhật thiết bị. Vui lòng thử lại sau.');
      enqueueSnackbar('Không thể cập nhật thiết bị. Vui lòng thử lại sau.', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Đang tải dữ liệu...</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        height: 'auto',
        paddingTop: '2rem',
        paddingBottom: '2rem',
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
            color: '#1d3557',
            fontWeight: 'bold',
            mb: 3,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Cập Nhật Thiết Bị Đo Lường
        </Typography>

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

        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map(item => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={item.label}
                  value={field.value || ''}
                  onChange={field.onChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  type={item.type || 'text'}
                  InputLabelProps={item.InputLabelProps}
                  sx={textFieldStyle}
                  disabled={item.name === 'code'}
                  error={!!errors[item.name]}
                  helperText={errors[item.name]?.message}
                />
              )}
            />
          ))}

          <FormLabel component="legend" sx={{ mt: 2 }}>Chọn loại hiệu chuẩn</FormLabel>
          <Controller
            name="selfCalibration"
            control={control}
            render={({ field }) => (
              <RadioGroup
                row
                value={field.value ? 'self' : 'external'}
                onChange={(e) => {
                  field.onChange(e.target.value === 'self');
                  control._formValues.externalCalibration = e.target.value === 'external';
                }}
              >
                <FormControlLabel
                  value="self"
                  control={<Radio sx={{ color: '#25c2a0', '&.Mui-checked': { color: '#1d3557' } }} />}
                  label="Tự hiệu chuẩn"
                />
                <FormControlLabel
                  value="external"
                  control={<Radio sx={{ color: '#25c2a0', '&.Mui-checked': { color: '#1d3557' } }} />}
                  label="Bên ngoài hiệu chuẩn"
                />
              </RadioGroup>
            )}
          />
          {errors.selfCalibration && (
            <Typography color="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
              {errors.selfCalibration.message}
            </Typography>
          )}

          <FormLabel component="legend" sx={{ mt: 2 }}>Sử dụng bởi</FormLabel>
          <Controller
            name="usedBy"
            control={control}
            render={({ field }) => (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value.includes('field')}
                      onChange={(e) => {
                        const newUsedBy = e.target.checked
                          ? [...field.value, 'field']
                          : field.value.filter(item => item !== 'field');
                        field.onChange(newUsedBy);
                      }}
                      sx={{ color: '#25c2a0', '&.Mui-checked': { color: '#1d3557' } }}
                    />
                  }
                  label="Hiện trường"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value.includes('office')}
                      onChange={(e) => {
                        const newUsedBy = e.target.checked
                          ? [...field.value, 'office']
                          : field.value.filter(item => item !== 'office');
                        field.onChange(newUsedBy);
                      }}
                      sx={{ color: '#25c2a0', '&.Mui-checked': { color: '#1d3557' } }}
                    />
                  }
                  label="Văn phòng"
                />
              </>
            )}
          />
          {errors.usedBy && (
            <Typography color="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
              {errors.usedBy.message}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              background: 'linear-gradient(135deg, #1d3557, #1d3557)',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '10px',
              mt: 3,
              textTransform: 'none',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(69, 123, 157, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d3557, #1d3557)',
                boxShadow: '0 6px 20px rgba(69, 123, 157, 0.6)',
              },
            }}
          >
            Cập Nhật Thiết Bị
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default React.memo(EditDevice);