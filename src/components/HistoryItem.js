import { Box, Typography, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useState } from 'react'
import EditHistoryDialog from './EditHistoryDialog'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'

const HistoryItem = ({ item, idx, onEdit }) => {
    const [openEdit, setOpenEdit] = useState(false);

    const handleEditSave = (newData) => {
        if (onEdit) onEdit(newData, idx);
        setOpenEdit(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa ghi chép này?')) return;
        try {
            await axios.delete(`http://192.168.10.87:1337/api/calibration-records/${item.documentId}`);
            enqueueSnackbar('Xóa ghi chép thành công', { variant: 'success' });
            window.location.reload();
        } catch (error) {
            enqueueSnackbar('Xóa ghi chép thất bại', { variant: 'error' });
        }
    };

    return (
        <Box
            key={idx}
            sx={{
                mb: 2,
                p: 2.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f8fafc 70%, #e3eafc 100%)',
                boxShadow: 2,
                maxWidth: 340,
                minWidth: 240,
                position: 'relative',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 6 }
            }}
        >
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                {item.result !== 'NG' && (
                    <>
                        <IconButton size="small" color="primary" onClick={() => setOpenEdit(true)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={handleDelete}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </>
                )}
            </Box>
            <Typography fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                {new Date(item.calibrationDate).toLocaleDateString('vi-VN')}
            </Typography>
            <Typography sx={{ mb: 0.5 }}>
                <b>Tình hình:</b> {item.calibrationDetail}
            </Typography>
            <Typography sx={{ mb: 0.5 }}>
                <b>Phán định:</b> <span style={{ color: item.result === 'OK' ? '#388e3c' : '#d32f2f', fontWeight: 600 }}>{item.result.toUpperCase()}</span>
            </Typography>
            <Typography sx={{ mb: 0.5 }}>
                <b>Người ghi chép:</b> {item.scribe}
            </Typography>
            <EditHistoryDialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                onSave={handleEditSave}
                deviceId={item.deviceId}
                item={item}
            />
        </Box>
    )
}

export default HistoryItem