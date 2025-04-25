import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { enqueueSnackbar } from 'notistack';

const navLinks = [
  { label: 'Danh sách thiết bị', path: '/' },
  { label: 'Thêm thiết bị', path: '/add-device' },
  { label: 'Hiệu chuẩn thiết bị', path: '/device-detail' },
  { label: 'Báo phế', path: '/waste-report' },
  { label: 'Sửa thông tin thiết bị', path: '/edit-device' },
  { label: 'Bảng màu tra cứu', path: '/color-table' },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openLogout, setOpenLogout] = React.useState(false);

  const handleLogout = () => {
    setOpenLogout(true);
  };

  const handleConfirmLogout = () => {
    setOpenLogout(false);
    logout();
    enqueueSnackbar('Đăng xuất thành công!', { variant: 'success' });
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setOpenLogout(false);
  };

  const NavItems = () => (
    <>
      {navLinks.map((link) => {
        // Nếu là trang chủ, so sánh chính xác; còn lại dùng startsWith
        const isActive =
          link.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(link.path);

        return (
          <Button
            key={link.path}
            component={Link}
            to={link.path}
            sx={{
              color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
              textTransform: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: '1rem',
              px: 2,
              borderRadius: 2,
              boxShadow: isActive ? '0 2px 8px 0 rgba(30,30,47,0.12)' : 'none',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.12)',
              },
            }}
          >
            {link.label}
          </Button>
        );
      })}
    </>
  );
  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{ sx: { backgroundColor: '#1e1e2f', color: '#fff' } }}
    >
      <Box sx={{ width: 250, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.path}
              component={Link}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Đăng xuất" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #1d3557, #457b9d)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: '#fff',
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            Devices App
          </Typography>

          {user && (isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#fff' }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NavItems />
              <Button
                onClick={handleLogout}
                sx={{
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                Đăng xuất
              </Button>
            </Box>
          ))}

          {!user && (
            <Button
              component={Link}
              to="/login"
              sx={{
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                px: 2,
              }}
            >
              Đăng nhập
            </Button>
          )}
        </Toolbar>
        {user && isMobile && <MobileDrawer />}
      </AppBar>
      {/* Dialog xác nhận đăng xuất */}
      <Dialog open={openLogout} onClose={handleCancelLogout}>
        <DialogTitle>Xác nhận đăng xuất</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn đăng xuất không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmLogout} color="error" autoFocus>
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;