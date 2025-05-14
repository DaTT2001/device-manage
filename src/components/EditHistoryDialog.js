import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Alert
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

const EditHistoryDialog = ({ open, onClose, item }) => {        
    const [calibrationDate, setCalibrationDate] = useState(item.calibrationDate || '');
    const [calibrationDetail, setCalibrationDetail] = useState(item.calibrationDetail || '');
    const [scribe, setScribe] = useState(item.scribe || '');
    const [result, setResult] = useState(item.result || 'OK');
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!calibrationDate || !calibrationDetail || !scribe) {
            setError('Vui lòng nhập đầy đủ các trường bắt buộc.');
            return;
        }
        // So sánh ngày dạng yyyy-mm-dd để bỏ qua giờ
        const todayStr = new Date().toISOString().slice(0, 10);
        if (calibrationDate > todayStr) {
            setError('Ngày không được lớn hơn ngày hiện tại.');
            return;
        }
        setError('');
        try {
            await axios.put(
                `http://117.6.40.130:1337/api/calibration-records/${item.documentId}`,
                {
                    data: {
                        calibrationDate,
                        calibrationDetail,
                        result,
                        scribe
                    }
                }
            );
            enqueueSnackbar('Sửa ghi chép thành công', { variant: 'success' });
            setCalibrationDate('');
            setCalibrationDetail('');
            setResult('OK');
            setScribe('');
            onClose();
            window.location.reload();
        } catch (error) {
            enqueueSnackbar('Sửa ghi chép thất bại', { variant: 'error' });
        }
    };
    const handleClose = () => {
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Sửa ghi chép lý lịch</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField
                    label="Ngày"
                    type="date"
                    value={calibrationDate}
                    onChange={e => setCalibrationDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{ mb: 2, mt: 1 }}
                    required
                />
                <TextField
                    label="Tình hình"
                    value={calibrationDetail}
                    onChange={e => setCalibrationDetail(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    label="Người ghi chép"
                    value={scribe}
                    onChange={e => setScribe(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    required
                />
                <FormLabel component="legend" sx={{ mt: 1 }}>Phán định</FormLabel>
                <RadioGroup
                    row
                    value={result}
                    onChange={e => setResult(e.target.value)}
                >
                    <FormControlLabel value="OK" control={<Radio />} label="OK" />
                    <FormControlLabel value="NG" control={<Radio />} label="NG" />
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button variant="contained" onClick={handleSave}>Lưu</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditHistoryDialog;