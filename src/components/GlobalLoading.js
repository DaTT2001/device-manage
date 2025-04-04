import { Backdrop, CircularProgress } from '@mui/material';
import { useDevices } from '../context/DeviceContext';

const GlobalLoading = () => {
    const { loading } = useDevices(); // Lấy trạng thái loading từ context
    
    return (
        <Backdrop 
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} 
            open={loading} // Mở Backdrop khi loading = true
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default GlobalLoading;