import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  Paper,
} from '@mui/material';
import logo from '../assets/KD logo tách nềnn.png'
import { useSnackbar } from 'notistack';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, token, user, loading, setLoading } = useAuth();
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!loading && token && user) {
      navigate('/');
    }
  }, [loading, token, user, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Vui lòng nhập email hoặc tên người dùng';
    }
    if (!password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        enqueueSnackbar('Đăng nhập thành công!', { variant: 'success' });
        setLoading(false)
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
      enqueueSnackbar('Đăng nhập thất bại! Vui lòng thử lại', { variant: 'error' });
      setLoading(false)
    }
  };


  if (loading) {
    return (
      <Container
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000 50%, #1a1a1a 100%)',
        }}
      >
        <Typography variant="h6" sx={{ color: '#fff' }}>
          Đang tải...
        </Typography>
      </Container>
    );
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
          maxWidth: '400px',
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
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src={logo} alt="Logo" style={{ width: '70px' }} /> Đăng Nhập
          </Box>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email hoặc tên người dùng"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!formErrors.email}
            helperText={formErrors.email}
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
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Đăng Nhập
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link
              to="/forgot-password" // Liên kết đến trang quên mật khẩu
              sx={{
                color: '#25c2a0',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#fe2c55',
                },
              }}
            >
              Quên mật khẩu?
            </Link>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;