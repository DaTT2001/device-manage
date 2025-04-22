export const initialValues = {
  name: '',
  code: '',
  brand: '',
  type: '',
  phoneNumber: '',
  attached: '',
  supplier: '',
  cost: '',
  buyDate: '',
  // selfCalibration: true,
  // externalCalibration: false,
  calibrationType: 'self',
  lastCalibrationDate: '',
  calibrationFrequency: '',
  calibrationStandard: '',
  usedBy: [],
};
export const fields = [
  { name: 'name', label: 'Tên thiết bị', required: true },
  { name: 'code', label: 'Mã số', required: true },
  { name: 'type', label: 'Loại', required: true },
  { name: 'brand', label: 'Hãng sản xuất' },
  { name: 'phoneNumber', label: 'Số điện thoại' },
  { name: 'attached', label: 'Phụ kiện đính kèm' },
  { name: 'supplier', label: 'Xưởng cung ứng' },
  { name: 'cost', label: 'Giá mua' },
  { name: 'buyDate', label: 'Ngày mua', type: 'date', InputLabelProps: { shrink: true } },
  { name: 'lastCalibrationDate', label: 'Ngày HC kỳ trước', type: 'date', InputLabelProps: { shrink: true } },
  { name: 'calibrationFrequency', label: 'Tần suất hiệu chuẩn (tháng)', type: 'number', required: true },
  { name: 'calibrationStandard', label: 'Căn cứ hiệu chuẩn' },
];
export const textFieldStyle = {
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
};