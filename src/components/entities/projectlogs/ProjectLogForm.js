import {useState, useEffect, useContext} from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material'
import API from '../../api/API.js'
import UserContext from '../../../context/UserContext.js'

export default function ProjectLogForm({open, onClose, sprintId, onLogAdded}) {
  const {loggedInUser} = useContext(UserContext)
  const [logTypes, setLogTypes] = useState([])
  const [formData, setFormData] = useState({
    LogTitle: '',
    LogDescription: '',
    LogTaskDescription: '',
    Log_SprintID: sprintId,
    Log_UserID: loggedInUser?.UserID,
    Log_LogTypeID: '',
  })

  // Load log types
  useEffect(() => {
    const fetchLogTypes = async () => {
      try {
        const response = await API.get('/logtypes')
        if (response.isSuccess) {
          setLogTypes(response.result)
        } else {
          console.error('Failed to load log types:', response.message)
        }
      } catch (error) {
        console.error('Error loading log types:', error)
      }
    }

    fetchLogTypes()
  }, [])

  // Update sprintId when prop changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      Log_SprintID: sprintId,
    }))
  }, [sprintId])

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.LogTitle || !formData.Log_LogTypeID) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await API.post('/projectlogs', formData)
      if (response.isSuccess) {
        onLogAdded(response.result)
        resetForm()
        onClose()
      } else {
        console.error('Failed to add log:', response.message)
        alert('Failed to add log: ' + response.message)
      }
    } catch (error) {
      console.error('Error adding log:', error)
      alert('Error adding log: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      LogTitle: '',
      LogDescription: '',
      LogTaskDescription: '',
      Log_SprintID: sprintId,
      Log_UserID: loggedInUser?.UserID,
      Log_LogTypeID: '',
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Project Log</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{mt: 1}}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Log Title"
              name="LogTitle"
              value={formData.LogTitle}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Log Type</InputLabel>
              <Select
                name="Log_LogTypeID"
                value={formData.Log_LogTypeID}
                label="Log Type"
                onChange={handleChange}
              >
                {logTypes.map((type) => (
                  <MenuItem key={type.TypeID} value={type.TypeID}>
                    {type.TypeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="LogDescription"
              value={formData.LogDescription}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Description"
              name="LogTaskDescription"
              value={formData.LogTaskDescription}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Log
        </Button>
      </DialogActions>
    </Dialog>
  )
}
