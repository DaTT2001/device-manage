import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import DeviceList from './components/DeviceList';
import ForgotPassword from './components/ForgotPassword';
import AddDevice from './components/AddDevice'; // Import AddDevice
import Header from './components/Header';
import Footer from './components/Footer';
import { Box } from '@mui/material';
import WasteReport from './components/WasteReport';
import ConditionColorTable from './components/ConditionColorTable';
import { DeviceProvider } from './context/DeviceContext';
import { SnackbarProvider } from 'notistack';
import EditDevice from './components/EditDevice';
import GlobalLoading from './components/GlobalLoading';
import GlobalLoading2 from './components/GlobalLoading2';
import EditDeviceContainer from './components/EditDeviceContainer';
import Calibration from './components/Calibration';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
    <AuthProvider>
      <DeviceProvider>
      <Router>
        <AppContent />
      </Router>
      <GlobalLoading /> 
      <GlobalLoading2 /> 
      </DeviceProvider>
    </AuthProvider>
    </SnackbarProvider>
    
  );
}

const AppContent = () => {
  const { loading, token, user } = useAuth();
  const navigate = useNavigate();
  const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/forgot-password';
  const location = useLocation();

  useEffect(() => {
    if (!loading && token && user && isLoginPage) {
      navigate('/', { replace: true });
    }
  }, [loading, token, user, navigate, isLoginPage]);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000 50%, #1a1a1a 100%)',
          color: '#fff',
        }}
      >
        Đang tải...
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header chỉ hiện khi không phải trang đăng nhập */}
      {!isLoginPage && <Header />}

      {/* Nội dung chính */}
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DeviceList key={location.pathname} />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-device"
            element={
              <PrivateRoute>
                <AddDevice />
              </PrivateRoute>
            }
          /> {/* Thêm route cho AddDevice */}
          <Route
            path="/waste-report"
            element={
              <PrivateRoute>
                <WasteReport />
              </PrivateRoute>
            }
          />
           <Route
            path="/color-table"
            element={
              <PrivateRoute>
                <ConditionColorTable />
              </PrivateRoute>
            }
          />
          <Route path="/edit-device/:code" element={<EditDevice />} />
          <Route path="/calibration" element={<Calibration />} />
          <Route path="/edit-device" element={<EditDeviceContainer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>

      {/* Footer chỉ hiện khi không phải trang đăng nhập */}
      {!isLoginPage && <Footer />}
    </Box>
  );
};

const PrivateRoute = ({ children }) => {
  const { token, user } = useAuth();
  console.log('PrivateRoute - Token:', token, 'User:', user);

  if (!token || !user) {
    console.log('No token or user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default App;