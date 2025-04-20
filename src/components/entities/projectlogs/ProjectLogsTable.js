import {useState} from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import API from '../../api/API.js'

export default function ProjectLogsTable({logs, viewMode, projectId, sprintId}) {
  const [selectedLog, setSelectedLog] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleRemove = async (logId) => {
    try {
      const response = await API.delete(`/projectlogs/${logId}`)
      if (response.isSuccess) {
        // Refresh the page or update the logs list
        window.location.reload()
      } else {
        console.error('Failed to delete log:', response.message)
        alert('Failed to delete log: ' + response.message)
      }
    } catch (error) {
      console.error('Error deleting log:', error)
      alert('Error deleting log: ' + error.message)
    }
    setDialogOpen(false)
  }

  const openDialog = (log) => {
    setSelectedLog(log)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (logs.length === 0) {
    return (
      <Paper sx={{p: 3, textAlign: 'center'}}>
        <Typography variant="h6">No logs found for this sprint</Typography>
        <Typography variant="body2" color="textSecondary">
          Click the ADD LOG button to create your first log entry
        </Typography>
      </Paper>
    )
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="project logs table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Log Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.LogID}>
                <TableCell>{log.LogID}</TableCell>
                <TableCell>{log.LogTitle}</TableCell>
                <TableCell>{log.LogTypeName || `Type ${log.Log_LogTypeID}`}</TableCell>
                <TableCell>{log.LogDescription}</TableCell>
                <TableCell>{formatDate(log.LogCreatedAt)}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="error" onClick={() => openDialog(log)}>
                    REMOVE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Removal'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this log entry? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={() => selectedLog && handleRemove(selectedLog.LogID)}
            autoFocus
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
