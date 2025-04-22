import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Alert
} from '@mui/material';
import axios from 'axios';

const AddHistoryDialog = ({ open, onClose, onSave, deviceId }) => {
    
    const [calibrationDate, setCalibrationDate] = useState('');
    const [calibrationDetail, setCalibrationDetail] = useState('');
    const [scribe, setScribe] = useState('');
    const [result, setResult] = useState('OK');
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

        if (result === 'NG' && deviceId) {
            try {
                await axios.put(`http://192.168.10.87:1337/api/devices/${deviceId}`, {
                    data: { result: 'NG', wasteStatus: 'no' }
                });
            } catch (error) {
                setError('Cập nhật trạng thái thiết bị thất bại!');
                return;
            }
        }

        onSave({
            calibrationDate,
            calibrationDetail,
            result,
            scribe,
            deviceId
        });
        setCalibrationDate('');
        setCalibrationDetail('');
        setResult('OK');
        setScribe('');
        onClose();
    };

    const handleClose = () => {
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Thêm ghi chép lý lịch</DialogTitle>
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
                {result === 'NG' && (
                    <Alert severity="warning" sx={{ mt: 2, mb: 1 }}>
                        Khi chọn NG, thiết bị sẽ vào hàng chờ báo phế, hành động này không thể hoàn tác.
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button variant="contained" onClick={handleSave}>Lưu</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddHistoryDialog;