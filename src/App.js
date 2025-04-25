import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DeviceList from './pages/DeviceList';
import ForgotPassword from './pages/ForgotPassword';
import AddDevice from './pages/AddDevice'; // Import AddDevice
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import { Box } from '@mui/material';
import WasteReport from './pages/WasteReport';
import ConditionColorTable from './pages/ConditionColorTable';
import { DeviceProvider } from './context/DeviceContext';
import { SnackbarProvider } from 'notistack';
import EditDevice from './pages/EditDevice';
import GlobalLoading from './components/GlobalLoading';
import GlobalLoading2 from './components/GlobalLoading2';
import EditDeviceContainer from './components/EditDeviceContainer';
import Calibration from './pages/Calibration';
import CalibrationPDFPage from './pages/CalibrationPDFPage';
import DeviceDetailPage from './pages/DeviceDetailPage';

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
  const isPDFPage = location.pathname.startsWith('/device-detail/export');

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
          // background: 'linear-gradient(135deg, #000 50%, #1a1a1a 100%)',
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
      {!isLoginPage && !isPDFPage && <Header />}

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
          <Route path="/edit-device/:documentId" element={<EditDevice />} />
          <Route path="/device-detail" element={<Calibration />} />
          <Route path="/edit-device" element={<EditDeviceContainer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/device-detail/export/:documentId" element={<CalibrationPDFPage />} />
          <Route path="/device-detail/:documentId" element={<DeviceDetailPage />} />
        </Routes>
      </Box>

      {/* Footer chỉ hiện khi không phải trang đăng nhập */}
      {!isLoginPage && !isPDFPage && <Footer />}
    </Box>
  );
};

const PrivateRoute = ({ children }) => {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default App;