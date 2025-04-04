import { Backdrop, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const GlobalLoading2 = () => {
    const { loading } = useAuth(); // Lấy trạng thái loading từ context
    
    return (
        <Backdrop 
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} 
            open={loading} // Mở Backdrop khi loading = true
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default GlobalLoading2;