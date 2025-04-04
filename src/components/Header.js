import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (!confirmLogout) return;

    logout();
    enqueueSnackbar('Đăng xuất thành công!', { variant: 'success' });
    navigate('/login');
};

  // Hàm kiểm tra xem nút có đang active không
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(45deg, #fe2c55, #25c2a0)', // Gradient TikTok
        boxShadow: '0 4px 15px rgba(254, 44, 85, 0.4)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo hoặc tiêu đề */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            textDecoration: 'none',
            '&:hover': {
              color: '#f5f5f5',
            },
          }}
        >
          Devices App V1.0
        </Typography>

        {/* Nút điều hướng */}
        <Box>
          {user ? (
            <>
              {/* Nút Danh sách thiết bị */}
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{
                  textTransform: 'none',
                  mr: 2,
                  color: isActive('/') ? '#fff' : 'inherit',
                  backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  '&:hover': {
                    color: '#f5f5f5',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Danh sách thiết bị
              </Button>

              {/* Nút Thêm thiết bị */}
              <Button
                color="inherit"
                component={Link}
                to="/add-device"
                sx={{
                  textTransform: 'none',
                  mr: 2,
                  color: isActive('/add-device') ? '#fff' : 'inherit',
                  backgroundColor: isActive('/add-device') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  '&:hover': {
                    color: '#f5f5f5',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Thêm thiết bị
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/calibration"
                sx={{
                  textTransform: 'none',
                  mr: 2,
                  color: isActive('/calibration') ? '#fff' : 'inherit',
                  backgroundColor: isActive('/calibration') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  '&:hover': {
                    color: '#f5f5f5',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Hiệu chuẩn thiết bị
              </Button>
              {/* Nút Thêm thiết bị */}
              <Button
                color="inherit"
                component={Link}
                to="/waste-report"
                sx={{
                  textTransform: 'none',
                  mr: 2,
                  color: isActive('/waste-report') ? '#fff' : 'inherit',
                  backgroundColor: isActive('/waste-report') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  '&:hover': {
                    color: '#f5f5f5',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Báo phế
              </Button>
              {/* Nút Thêm thiết bị */}
              <Button
                color="inherit"
                component={Link}
                to="/edit-device"
                sx={{
                  textTransform: 'none',
                  mr: 2,
                  color: isActive('/edit-device') ? '#fff' : 'inherit',
                  backgroundColor: isActive('/edit-device') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  '&:hover': {
                    color: '#f5f5f5',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Sửa thông tin thiết bị
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/color-table"
                sx={{
                  textTransform: 'none',
                  mr: 2,
                  color: isActive('/color-table') ? '#fff' : 'inherit',
                  backgroundColor: isActive('/color-table') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  '&:hover': {
                    color: '#f5f5f5',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Bảng màu tra cứu
              </Button>
              {/* Nút Đăng xuất */}
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  textTransform: 'none',
                  color: 'inherit',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  '&:hover': {
                    color: '#f5f5f5',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{
                textTransform: 'none',
                color: isActive('/login') ? '#fff' : 'inherit',
                backgroundColor: isActive('/login') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                borderRadius: '8px',
                padding: '6px 12px',
                '&:hover': {
                  color: '#f5f5f5',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Đăng nhập
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;