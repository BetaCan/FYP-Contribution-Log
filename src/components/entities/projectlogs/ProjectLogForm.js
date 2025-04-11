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
  Box,
  Typography,
} from '@mui/material'
import API from '../../api/API.js'
import UserContext from '../../../context/UserContext.js'

export default function ProjectLogForm({
  open,
  onClose,
  sprintId,
  onLogAdded,
  initialLog = null,
  isEditMode = false,
}) {
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

  // Initialize form with log data if in edit mode
  useEffect(() => {
    if (isEditMode && initialLog) {
      setFormData({
        LogID: initialLog.LogID,
        LogTitle: initialLog.LogTitle || '',
        LogDescription: initialLog.LogDescription || '',
        LogTaskDescription: initialLog.LogTaskDescription || '',
        Log_SprintID: initialLog.Log_SprintID,
        Log_UserID: initialLog.Log_UserID,
        Log_LogTypeID: initialLog.Log_LogTypeID.toString(),
      })
    } else {
      // Reset form when not in edit mode
      resetForm()
    }
  }, [isEditMode, initialLog])

  // Update sprintId when prop changes
  useEffect(() => {
    if (!isEditMode) {
      setFormData((prev) => ({
        ...prev,
        Log_SprintID: sprintId,
      }))
    }
  }, [sprintId, isEditMode])

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
      let response

      if (isEditMode) {
        // Update existing log
        response = await API.put(`/projectlogs/${formData.LogID}`, formData)
      } else {
        // Create new log
        response = await API.post('/projectlogs', formData)
      }

      if (response.isSuccess) {
        onLogAdded(response.result)
        resetForm()
        onClose()
      } else {
        console.error(`Failed to ${isEditMode ? 'update' : 'add'} log:`, response.message)
        alert(`Failed to ${isEditMode ? 'update' : 'add'} log: ${response.message}`)
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} log:`, error)
      alert(`Error ${isEditMode ? 'updating' : 'adding'} log: ${error.message}`)
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
      <DialogTitle
        sx={{
          fontSize: '24px',
          fontWeight: '500',
          pb: 1,
          borderBottom: '1px solid #eee',
        }}
      >
        {isEditMode ? 'Edit Project Log' : 'Add Project Log'}
      </DialogTitle>
      <DialogContent sx={{pt: 3}}>
        <Box sx={{mb: 3}}>
          <Typography variant="body2" component="label" sx={{mb: 1, display: 'block'}}>
            Log Title *
          </Typography>
          <TextField
            fullWidth
            name="LogTitle"
            value={formData.LogTitle}
            onChange={handleChange}
            placeholder="Enter log title"
            variant="outlined"
            InputProps={{
              style: {
                padding: '12px 14px',
                fontSize: '16px',
              },
            }}
          />
        </Box>

        <Box sx={{mb: 3}}>
          <Typography variant="body2" component="label" sx={{mb: 1, display: 'block'}}>
            Log Type *
          </Typography>
          <FormControl fullWidth variant="outlined">
            <Select
              name="Log_LogTypeID"
              value={formData.Log_LogTypeID}
              onChange={handleChange}
              displayEmpty
              sx={{
                height: '56px',
                fontSize: '16px',
              }}
            >
              <MenuItem value="" disabled>
                Select log type
              </MenuItem>
              {logTypes.map((type) => (
                <MenuItem key={type.TypeID} value={type.TypeID}>
                  {type.TypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{mb: 3}}>
          <Typography variant="body2" component="label" sx={{mb: 1, display: 'block'}}>
            Description
          </Typography>
          <TextField
            fullWidth
            name="LogDescription"
            value={formData.LogDescription}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Enter log description"
            variant="outlined"
            InputProps={{
              style: {
                fontSize: '16px',
              },
            }}
          />
        </Box>

        <Box sx={{mb: 3}}>
          <Typography variant="body2" component="label" sx={{mb: 1, display: 'block'}}>
            Task Description
          </Typography>
          <TextField
            fullWidth
            name="LogTaskDescription"
            value={formData.LogTaskDescription}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Enter task description"
            variant="outlined"
            InputProps={{
              style: {
                fontSize: '16px',
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{p: 3, borderTop: '1px solid #eee'}}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            px: 3,
            py: 1,
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          CANCEL
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            px: 3,
            py: 1,
            fontSize: '14px',
            fontWeight: '500',
            bgcolor: '#4a77e5',
          }}
        >
          {isEditMode ? 'UPDATE LOG' : 'ADD LOG'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
