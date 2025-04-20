import {useState} from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import API from '../../api/API.js'

export default function ProjectLogDetail({log, onEdit, onDelete, onRefresh}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!log) {
    return (
      <Paper sx={{p: 3, textAlign: 'center'}}>
        <Typography variant="h6">No log selected</Typography>
        <Typography variant="body2" color="textSecondary">
          Please select a log or create a new one
        </Typography>
      </Paper>
    )
  }

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/projectlogs/${log.LogID}`)
      if (response.isSuccess) {
        onRefresh()
        setDialogOpen(false)
        onDelete()
      } else {
        console.error('Failed to delete log:', response.message)
        alert('Failed to delete log: ' + response.message)
      }
    } catch (error) {
      console.error('Error deleting log:', error)
      alert('Error deleting log: ' + error.message)
    }
  }

  return (
    <>
      <Paper sx={{p: 4, mb: 3}}>
        <Typography variant="h5" component="h2" gutterBottom>
          DESCRIPTION
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 4,
            minHeight: '200px',
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>
            {log.LogDescription || 'No description provided.'}
          </Typography>
        </Paper>

        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => onEdit(log)}
            sx={{minWidth: '120px', bgcolor: '#4a77e5'}}
          >
            EDIT
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{minWidth: '120px'}}
          >
            DELETE
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this log entry? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
