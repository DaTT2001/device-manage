// DeviceTableBody.js
import React from 'react';
import { TableBody, TableRow, TableCell, Box, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
// Thêm các hàm tiện ích bạn đang sử dụng

const DeviceTableBody = ({ devices, loading, page, pageSize, handleEdit, handleDelete, getDaysDifference, isNearDue }) => {
    return (
        <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={10} align="center">Đang tải...</TableCell>
                </TableRow>
            ) : devices.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={10} align="center">Không có dữ liệu</TableCell>
                </TableRow>
            ) : (
                devices.map((device, index) => {
                    const lastDate = device.lastCalibrationDate
                        ? new Date(device.lastCalibrationDate)
                        : null;
                    const dueDate = lastDate
                        ? new Date(lastDate).setMonth(lastDate.getMonth() + (device.calibrationFrequency || 0))
                        : null;
                    const today = new Date();
                    const daysUntilDue = dueDate ? getDaysDifference(today, new Date(dueDate)) : null;

                    return (
                        <TableRow
                            key={device.id}
                            sx={{
                                backgroundColor: isNearDue(device.lastCalibrationDate, device.calibrationFrequency)
                                    ? 'rgba(254, 44, 85, 0.1)'
                                    : 'inherit',
                            }}
                        >
                            <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                            <TableCell>{device.name || 'N/A'}</TableCell>
                            <TableCell>{device.code || 'N/A'}</TableCell>
                            <TableCell>{device.brand || 'N/A'}</TableCell>
                            <TableCell>
                                {device.selfCalibration ? <CheckIcon sx={{ color: '#25c2a0' }} /> : null}
                            </TableCell>
                            <TableCell>
                                {device.externalCalibration ? <CheckIcon sx={{ color: '#25c2a0' }} /> : null}
                            </TableCell>
                            <TableCell>
                                {lastDate ? lastDate.toLocaleDateString('vi-VN') : 'Chưa sử dụng'}
                            </TableCell>
                            <TableCell>{device.calibrationFrequency || 'N/A'}</TableCell>
                            <TableCell>
                                {dueDate ? new Date(dueDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </TableCell>
                            <TableCell>
                                {daysUntilDue !== null
                                    ? daysUntilDue > 0
                                        ? `Còn ${daysUntilDue} ngày`
                                        : `Quá hạn ${Math.abs(daysUntilDue)} ngày`
                                    : 'N/A'}
                            </TableCell>
                            <TableCell>{device.calibrationStandard || ''}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                                    <IconButton onClick={() => handleEdit(device.documentId)} sx={{ color: '#25c2a0' }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(device.documentId)} sx={{ color: '#fe2c55' }}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    );
                })
            )}
        </TableBody>
    );
};

export default DeviceTableBody;