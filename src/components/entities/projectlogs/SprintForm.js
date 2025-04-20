import {useState} from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material'
import API from '../../api/API.js'

export default function SprintForm({open, onClose, projectId, onSprintAdded}) {
  const [formData, setFormData] = useState({
    Sprint_ProjectID: projectId,
    SprintName: '',
    SprintStartDate: '',
    SprintEndDate: '',
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.SprintName || !formData.SprintStartDate || !formData.SprintEndDate) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await API.post('/sprints', formData)
      if (response.isSuccess) {
        onSprintAdded(response.result)
        resetForm()
        onClose()
      } else {
        console.error('Failed to add sprint:', response.message)
        alert('Failed to add sprint: ' + response.message)
      }
    } catch (error) {
      console.error('Error adding sprint:', error)
      alert('Error adding sprint: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      Sprint_ProjectID: projectId,
      SprintName: '',
      SprintStartDate: '',
      SprintEndDate: '',
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Sprint</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{mt: 1}}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Sprint Name"
              name="SprintName"
              value={formData.SprintName}
              onChange={handleChange}
              placeholder="e.g., Sprint 1"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Start Date"
              name="SprintStartDate"
              type="date"
              value={formData.SprintStartDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="End Date"
              name="SprintEndDate"
              type="date"
              value={formData.SprintEndDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Sprint
        </Button>
      </DialogActions>
    </Dialog>
  )
}
