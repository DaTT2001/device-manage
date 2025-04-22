import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';

const colorData = [
  {
    category: '校验合格 Hiệu chuẩn đạt',
    periods: {
      '2025 1/1-30/6': { color: '#25c2a0', text: '绿色 Màu xanh lá' },
      '2025 1/7-31/12': { color: '#fff', text: '白色 Màu trắng' },
      '2026 1/1-30/6': { color: '#1976d2', text: '蓝色 Xanh lam' },
      '2026 1/7-31/12': { color: '#25c2a0', text: '绿色 Màu xanh lá' },
      '2027 1/1-30/6': { color: '#fff', text: '白色 Màu trắng' },
      '2027 1/7-31/12': { color: '#1976d2', text: '蓝色 Xanh lam' },
    },
    note: '',
  },
  {
    category: '校验不合格 Hiệu chuẩn không đạt',
    periods: {
      '2025 1/1-30/6': { color: '#fe2c55', text: '红色 Màu đỏ' },
    },
    note: '',
  },
  {
    category: '免校 Miễn hiệu chuẩn',
    periods: {
      '2025 1/1-30/6': { color: '#ffeb3b', text: '黄色 Màu vàng' },
    },
    note: '',
  },
];

const styles = {
  container: {
    background: 'linear-gradient(135deg, #f5f7fa 60%, #e3eafc 100%)',
    minHeight: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: '#fe2c55',
    fontWeight: 'bold',
    mb: 3,
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    maxWidth: '1400px',
  },
  tableHeader: {
    background: 'linear-gradient(45deg, #fe2c55, #25c2a0)',
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
  },
  colorBox: (color) => ({
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: color,
    display: 'inline-block',
    border: color === '#fff' ? '2px solid #00A859' : 'none',
  }),
};

const ConditionColorTable = () => {

  const renderColorCell = (period, periodData) => (
    <TableCell key={period} sx={{ textAlign: 'center', minWidth: '140px' }}>
      <Tooltip title={periodData.text}>
        <Box sx={styles.colorBox(periodData.color)} />
      </Tooltip>
      <Typography variant="caption" display="block">
        {periodData.text}
      </Typography>
    </TableCell>
  );

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={styles.title}>
        Bảng Màu Kiểm Tra Điều Kiện Dụng Cụ Đo Lường
      </Typography>

      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow sx={styles.tableHeader}>
              <TableCell sx={styles.headerCell}>Phân loại</TableCell>
              {Object.keys(colorData[0].periods).map((period) => (
                <TableCell key={period} sx={{ ...styles.headerCell, textAlign: 'center' }}>
                  {period}
                </TableCell>
              ))}
              <TableCell sx={styles.headerCell}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colorData.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.category}</TableCell>
                {Object.entries(row.periods).map(([period, periodData]) =>
                  renderColorCell(period, periodData)
                )}
                <TableCell>{row.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConditionColorTable;