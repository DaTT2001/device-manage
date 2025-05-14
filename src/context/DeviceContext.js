import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Tạo context
const DeviceContext = createContext();

// Provider component
export const DeviceProvider = ({ children }) => {
    const [allDevices, setAllDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm fetch toàn bộ dữ liệu từ API bằng vòng lặp
    const fetchAllDevices = async () => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            let allData = [];
            let currentPage = 1;
            let hasMore = true;
            const pageSize = 100; // Sử dụng pageSize lớn để giảm số lần gọi

            while (hasMore) {
                const url = `http://117.6.40.130:1337/api/devices?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`;
                const response = await axios.get(url);
                const { data, meta } = response.data;

                if (!Array.isArray(data)) {
                    throw new Error('Dữ liệu từ API không phải là mảng');
                }

                allData = [...allData, ...data];
                hasMore = currentPage < meta.pagination.pageCount;
                currentPage++;
            }

            setAllDevices(allData);
            setError(null);
        } catch (err) {
            console.error('Error fetching devices:', err);
            setError('Không thể tải danh sách thiết bị. Vui lòng thử lại sau.');
            setAllDevices([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch dữ liệu một lần duy nhất khi component mount
    useEffect(() => {
        fetchAllDevices();
    }, []); // Không có dependency, chỉ chạy một lần

    // Giá trị cung cấp cho context
    const value = {
        allDevices,
        loading,
        error,
        fetchAllDevices,
        setLoading,
    };

    return (
        <DeviceContext.Provider value={value}>
            {children}
        </DeviceContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useDevices = () => {
    const context = useContext(DeviceContext);
    if (!context) {
        throw new Error('useDevices must be used within a DeviceProvider');
    }
    return context;
};