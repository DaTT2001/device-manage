import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #000, #1a1a1a)', // Nền đen gradient
        padding: '1.5rem',
        textAlign: 'center',
        color: '#fff',
        boxShadow: '0 -4px 15px rgba(254, 44, 85, 0.2)',
        mt: 'auto', // Đẩy footer xuống dưới cùng
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        © 2025 Device Management. All rights reserved. Developed by DaTT2001
      </Typography>
      <Box>
        <Link
          href="https://ayo.so/ak08"
          sx={{
            color: '#25c2a0', // Xanh neon
            textDecoration: 'none',
            mx: 1,
            '&:hover': {
              color: '#fe2c55', // Hồng neon khi hover
              textDecoration: 'none',
            },
          }}
        >
          Giới thiệu
        </Link>
        <Link
          href="https://github.com/DaTT2001"
          sx={{
            color: '#25c2a0',
            textDecoration: 'none',
            mx: 1,
            '&:hover': {
              color: '#fe2c55',
              textDecoration: 'none',
            },
          }}
        >
          Liên hệ
        </Link>
        <Link
          href="https://opensource.org/license/mit"
          sx={{
            color: '#25c2a0',
            textDecoration: 'none',
            mx: 1,
            '&:hover': {
              color: '#fe2c55',
              textDecoration: 'none',
            },
          }}
        >
          Chính sách
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;