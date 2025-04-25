import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

const WasteReport = () => {
  const [notReported, setNotReported] = useState([])
  const [reported, setReported] = useState([])
  const [loadingId, setLoadingId] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)

  const fetchDevices = async () => {
    try {
      const response = await axios.get(
        'http://192.168.10.87:1337/api/devices?filters[result][$eq]=NG&pagination[pageSize]=9999'
      )
      const allNG = response.data.data || []
      setNotReported(allNG.filter(d => d.wasteStatus === 'no'))
      setReported(allNG.filter(d => d.wasteStatus === 'yes'))
    } catch (error) {
      setNotReported([])
      setReported([])
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const handleOpenDialog = (device) => {
    setSelectedDevice(device)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedDevice(null)
  }

  const handleReportWaste = async () => {
    if (!selectedDevice) return;
    setLoadingId(selectedDevice.documentId)
    try {
      await axios.put(`http://192.168.10.87:1337/api/devices/${selectedDevice.documentId}`, {
        data: { wasteStatus: 'yes' }
      })
      await fetchDevices()
      enqueueSnackbar('Báo phế thành công!', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Báo phế thất bại!', { variant: 'error' })
    }
    setLoadingId(null)
    handleCloseDialog()
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Grid container spacing={3} justifyContent={'center'}>
        <Grid item xs={12} md={6} width={500}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Thiết bị NG chưa báo phế
            </Typography>
            <List>
              {notReported.length === 0 ? (
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Không có thiết bị nào.
                </Typography>
              ) : (
                notReported.map(device => (
                  <ListItem key={device.documentId} divider>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <ListItemText
                        primary={device.name || device.code}
                        secondary={`Mã: ${device.code} | Hãng: ${device.brand || 'N/A'}`}
                      />
                      <Chip label="NG" color="error" sx={{ ml: 2 }} />
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        disabled={loadingId === device.documentId}
                        onClick={() => handleOpenDialog(device)}
                        sx={{ ml: 2, minWidth: 90 }}
                      >
                        {loadingId === device.documentId ? 'Đang báo...' : 'Báo phế'}
                      </Button>
                    </Box>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} width={500}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Thiết bị NG đã báo phế
            </Typography>
            <List>
              {reported.length === 0 ? (
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Không có thiết bị nào.
                </Typography>
              ) : (
                reported.map(device => (
                  <ListItem key={device.documentId} divider>
                    <ListItemText
                      primary={device.name || device.code}
                      secondary={`Mã: ${device.code} | Hãng: ${device.brand || 'N/A'}`}
                    />
                    <Chip label="NG - Đã báo phế" color="warning" sx={{ ml: 2 }} />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog xác nhận báo phế */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận báo phế</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn báo phế thiết bị này không? Hành động này không thể hoàn tác!
          </DialogContentText>
          {selectedDevice && (
            <DialogContentText sx={{ mt: 2 }}>
              <strong>Tên:</strong> {selectedDevice.name} <br />
              <strong>Mã:</strong> {selectedDevice.code} <br />
              <strong>Hãng:</strong> {selectedDevice.brand || 'N/A'}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleReportWaste}
            color="error"
            autoFocus
            disabled={loadingId === (selectedDevice && selectedDevice.documentId)}
          >
            {loadingId === (selectedDevice && selectedDevice.documentId) ? 'Đang báo...' : 'Xác nhận báo phế'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default WasteReport