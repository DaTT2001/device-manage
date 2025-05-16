import React, { useState } from 'react';
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
import { enqueueSnackbar } from 'notistack';
import { useDevices } from '../context/DeviceContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { fields, initialValues, textFieldStyle } from '../utils/constants';
import { addDeviceApi } from '../utils/apiHelpers';

const validationSchema = Yup.object({
  name: Yup.string().required('Tên thiết bị là bắt buộc'),
  code: Yup.string().required('Mã thiết bị là bắt buộc'),
  // brand: Yup.string().required('Thương hiệu là bắt buộc'),
  type: Yup.string().required('Loại thiết bị là bắt buộc'),
  calibrationFrequency: Yup.number()
    .required('Chu kỳ hiệu chuẩn là bắt buộc')
    .positive('Chu kỳ hiệu chuẩn phải là số dương')
    .integer('Chu kỳ hiệu chuẩn phải là số nguyên'),
  phoneNumber: Yup.string()
    .transform(value => (value === '' ? null : value))
    .matches(/^\d+$/, 'Số điện thoại chỉ được chứa chữ số')
    .nullable(),
  cost: Yup.string()
    .transform(value => (value === '' ? null : value))
    .matches(/^\d+$/, 'Chi phí chỉ được chứa chữ số')
    .nullable(),
  // cost: Yup.number().nullable().positive('Chi phí phải là số dương'),
  buyDate: Yup.string().nullable(),
  lastCalibrationDate: Yup.string().nullable(),
  calibrationType: Yup.string()
    .oneOf(['self', 'external'], 'Loại hiệu chuẩn không hợp lệ')
    .required('Loại hiệu chuẩn là bắt buộc'),
  usedBy: Yup.array().of(Yup.string()).min(1, 'Vui lòng chọn ít nhất một mục'),
});


const AddDevice = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { allDevices, fetchAllDevices } = useDevices();

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { ...initialValues, calibrationType: 'self' },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values) => {
    setError(null);
    setSuccess(null);
    // Kiểm tra ngày mua và ngày hiệu chuẩn không lớn hơn ngày hiện tại
    const todayStr = new Date().toISOString().slice(0, 10);
    if (values.buyDate && values.buyDate > todayStr) {
      setError('Ngày mua không được lớn hơn ngày hiện tại.');
      enqueueSnackbar('Ngày mua không được lớn hơn ngày hiện tại.', { variant: 'error' });
      return;
    }
    if (values.lastCalibrationDate && values.lastCalibrationDate > todayStr) {
      setError('Ngày hiệu chuẩn không được lớn hơn ngày hiện tại.');
      enqueueSnackbar('Ngày hiệu chuẩn không được lớn hơn ngày hiện tại.', { variant: 'error' });
      return;
    }
    const trimmedValues = { ...values };
    Object.keys(trimmedValues).forEach(key => {
      if (typeof trimmedValues[key] === 'string') {
        trimmedValues[key] = trimmedValues[key].trim();
      }
    });

    const isCodeExist = allDevices.some(device => device.code === values.code);
    if (isCodeExist) {
      setError('Mã số thiết bị đã tồn tại. Vui lòng sử dụng mã số khác.');
      enqueueSnackbar('Mã số thiết bị đã tồn tại. Vui lòng sử dụng mã số khác.', { variant: 'error' });
      return;
    }

    try {
      const dataToSend = {
        ...trimmedValues,
        cost: trimmedValues.cost ? parseFloat(trimmedValues.cost) : null,
        calibrationFrequency: parseInt(trimmedValues.calibrationFrequency),
        usedBy: JSON.stringify(trimmedValues.usedBy),
        selfCalibration: trimmedValues.calibrationType === 'self',
        externalCalibration: trimmedValues.calibrationType === 'external',
        result: 'OK',
        wasteStatus: "no",
      };

      ['buyDate', 'lastCalibrationDate'].forEach(field => {
        if (!dataToSend[field]) {
          delete dataToSend[field];
        }
      });
      delete dataToSend.calibrationType;
      console.log(dataToSend);

      const response = await addDeviceApi(dataToSend);

      enqueueSnackbar(`Thêm thiết bị ${response.data.data.code} thành công!`, { variant: 'success' });
      reset();
      await fetchAllDevices();
      setSuccess('Thêm thiết bị thành công!');
    } catch (err) {
      console.error('Error adding device:', err);
      setError('Không thể thêm thiết bị. Vui lòng thử lại sau.');
      enqueueSnackbar('Không thể thêm thiết bị. Vui lòng thử lại sau.', { variant: 'error' });
    }
  };

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
          Thêm Thiết Bị Đo Lường
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
                  error={!!errors[item.name]}
                  helperText={errors[item.name]?.message}
                  required={!!item.required}
                />
              )}
            />
          ))}

          <FormLabel component="legend" sx={{ mt: 2 }}>Chọn loại hiệu chuẩn</FormLabel>
          <Controller
            name="calibrationType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                row
                {...field}
                value={field.value || 'self'}
                onChange={(e) => field.onChange(e.target.value)}
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
          {errors.calibrationType && (
            <Typography color="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
              {errors.calibrationType.message}
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
            Thêm Thiết Bị
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default React.memo(AddDevice);