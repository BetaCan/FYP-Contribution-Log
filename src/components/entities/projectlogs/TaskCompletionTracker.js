import {useState, useEffect} from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import Checkbox from '@mui/material/Checkbox'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import API from '../../api/API'

/**
 * TaskCompletionTracker Component
 * A simple table to track task completion status
 */
export default function TaskCompletionTracker({sprintId}) {
  const [users, setUsers] = useState([])
  const [taskCompletions, setTaskCompletions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState({
    userId: '',
    completed: false,
    description: '',
    taskId: null,
  })

  // Fetch users and task completions for this sprint
  useEffect(() => {
    if (!sprintId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // First get the project ID for this sprint
        const sprintResponse = await API.get(`/sprints/${sprintId}`)
        if (!sprintResponse.isSuccess) {
          setError('Failed to fetch sprint info')
          return
        }

        const projectId = sprintResponse.result.Sprint_ProjectID

        // Get users assigned to this project
        const projectUsersResponse = await API.get(`/userprojects/project/${projectId}`)
        if (!projectUsersResponse.isSuccess) {
          setError('Failed to fetch project users')
          return
        }

        // Get user details for each team member
        const userPromises = projectUsersResponse.result.map((userProject) =>
          API.get(`/users/${userProject.UserProject_UserID}`)
        )

        const userResponses = await Promise.all(userPromises)
        const userList = userResponses
          .filter((res) => res.isSuccess)
          .map((res) => ({
            id: res.result.UserID,
            name: `${res.result.UserFirstName} ${res.result.UserLastName}`,
          }))

        setUsers(userList)

        // Fetch task completion records for this sprint
        const taskCompletionResponse = await API.get(`/taskcompletions/sprint/${sprintId}`)
        if (taskCompletionResponse.isSuccess) {
          setTaskCompletions(taskCompletionResponse.result || [])
        } else {
          console.warn(
            'No task completion data available or error:',
            taskCompletionResponse.message
          )
          setTaskCompletions([])
        }

        setError(null)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sprintId])

  // Get task completion status for a user
  const getUserTaskStatus = (userId) => {
    const userTask = taskCompletions.find((task) => task.TaskCompletion_UserID === userId)

    return {
      completed: userTask ? !!userTask.TaskCompletionStatus : false,
      description: userTask ? userTask.TaskCompletionDescription : '',
      taskId: userTask ? userTask.TaskCompletionID : null,
    }
  }

  // Open task modal for a specific user
  const handleOpenTaskModal = (userId) => {
    const {completed, description, taskId} = getUserTaskStatus(userId)
    setCurrentTask({
      userId,
      completed,
      description,
      taskId,
    })
    setModalOpen(true)
  }

  // Close the task modal
  const handleCloseModal = () => {
    setModalOpen(false)
  }

  // Handle changes to task completion form
  const handleTaskChange = (field, value) => {
    setCurrentTask((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Save task completion
  const handleSaveTask = async () => {
    if (!sprintId || !currentTask.userId) return

    try {
      const taskData = {
        TaskCompletionDate: new Date().toISOString(),
        TaskCompletion_UserID: currentTask.userId,
        TaskCompletion_SprintID: sprintId,
        TaskCompletionStatus: currentTask.completed ? 1 : 0,
        TaskCompletionDescription: currentTask.description || '',
      }

      let response
      if (currentTask.taskId) {
        // Update existing task
        response = await API.put(`/taskcompletions/${currentTask.taskId}`, taskData)
      } else {
        // Create new task
        response = await API.post('/taskcompletions', taskData)
      }

      if (response.isSuccess) {
        // Refresh task data
        const updatedResponse = await API.get(`/taskcompletions/sprint/${sprintId}`)
        if (updatedResponse.isSuccess) {
          setTaskCompletions(updatedResponse.result || [])
        }
        setModalOpen(false)
      } else {
        alert('Failed to save task completion: ' + response.message)
      }
    } catch (error) {
      console.error('Error saving task completion:', error)
      alert('Error saving task completion. Please try again.')
    }
  }

  // Display loading state
  if (loading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', p: 3}}>
        <CircularProgress />
      </Box>
    )
  }

  // Display error state
  if (error) {
    return (
      <Typography color="error" sx={{p: 3}}>
        {error}
      </Typography>
    )
  }

  return (
    <Box>
      <Typography variant="h6" sx={{mb: 2}}>
        Task Completion Tracker
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{backgroundColor: '#f5f5f5'}}>
              <TableCell>Team Member</TableCell>
              <TableCell align="center">Task Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const {completed} = getUserTaskStatus(user.id)
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell align="center">
                    {completed ? (
                      <CheckCircleIcon sx={{color: 'success.main'}} />
                    ) : (
                      <CancelIcon sx={{color: 'error.main'}} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenTaskModal(user.id)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Task Completion Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Update Task Completion</DialogTitle>
        <DialogContent>
          <Box sx={{pt: 1}}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentTask.completed}
                  onChange={(e) => handleTaskChange('completed', e.target.checked)}
                  color="primary"
                />
              }
              label="Task Completed"
              sx={{mb: 2, display: 'block'}}
            />

            <TextField
              label="Description"
              multiline
              rows={4}
              value={currentTask.description}
              onChange={(e) => handleTaskChange('description', e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Enter task description or notes"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained" startIcon={<SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
