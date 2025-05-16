import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const ConfirmCalibration = ({ open, onClose, onConfirm, deviceName }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận hiệu chuẩn</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xác nhận hiệu chuẩn cho thiết bị{deviceName ? ` "${deviceName}"` : ''}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCalibration;