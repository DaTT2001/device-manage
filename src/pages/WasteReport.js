import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip, Grid, Button } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

const WasteReport = () => {
  const [notReported, setNotReported] = useState([])
  const [reported, setReported] = useState([])
  const [loadingId, setLoadingId] = useState(null)

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

  const handleReportWaste = async (deviceId) => {
    if (!window.confirm('Bạn chắc chắn muốn báo phế thiết bị này?')) return;
    setLoadingId(deviceId)
    try {
      await axios.put(`http://192.168.10.87:1337/api/devices/${deviceId}`, {
        data: { wasteStatus: 'yes' }
      })
      await fetchDevices()
      enqueueSnackbar('Báo phế thành công!', { variant: 'success' })
    } catch (error) {
      alert('Báo phế thất bại!')
      enqueueSnackbar('Báo phế thất bại!', { variant: 'error' })
    }
    setLoadingId(null)
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
                        onClick={() => handleReportWaste(device.documentId)}
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
    </Box>
  )
}

export default WasteReport