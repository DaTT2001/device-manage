import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  Paper,
  Link,
} from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập logic gửi yêu cầu quên mật khẩu
    if (email) {
      setMessage('Vui lòng liên hệ với admin để đặt lại mật khẩu.');
    } else {
      setMessage('Vui lòng nhập email trước.');
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000 50%, #1a1a1a 100%)', // Nền TikTok
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: '2.5rem',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Tiêu đề */}
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: '#fe2c55', // Hồng neon TikTok
            fontWeight: 'bold',
            mb: 3,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Quên Mật Khẩu
        </Typography>

        {/* Thông báo */}
        {message && (
          <Alert
            severity={email ? 'info' : 'warning'}
            sx={{ mb: 2, borderRadius: '8px' }}
          >
            {message}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email hoặc tên người dùng"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: '#f5f5f5',
                '&:hover fieldset': {
                  borderColor: '#25c2a0', // Xanh neon khi hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fe2c55', // Hồng neon khi focus
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

          {/* Nút gửi */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(45deg, #fe2c55, #25c2a0)', // Gradient TikTok
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
            Gửi Yêu Cầu
          </Button>
        </form>

        {/* Link quay lại đăng nhập */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link
            href="/login"
            sx={{
              color: '#25c2a0', // Xanh neon
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                color: '#fe2c55', // Chuyển hồng khi hover
              },
            }}
          >
            Quay lại Đăng Nhập
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;