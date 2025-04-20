import {useState, useEffect, useContext} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import API from '../api/API.js'
import TeamTable from '../entities/projectlogs/TeamTable'
import ProjectLogForm from '../entities/projectlogs/ProjectLogForm'
import SprintForm from '../entities/projectlogs/SprintForm'
import UserContext from '../../context/UserContext.js'
import EngagementMetrics from '../entities/projectlogs/EngagementMetrics.js'

export default function ProjectLogs() {
  const location = useLocation()
  const navigate = useNavigate()
  const {loggedInUser} = useContext(UserContext)
  const {project} = location.state || {project: null}

  const [selectedSprint, setSelectedSprint] = useState(null)
  const [sprints, setSprints] = useState([])
  const [logs, setLogs] = useState([])
  const [selectedLog, setSelectedLog] = useState(null)
  const [logTypes, setLogTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('overview')
  const [logFormOpen, setLogFormOpen] = useState(false)
  const [sprintFormOpen, setSprintFormOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // First, check if we have a valid project
  useEffect(() => {
    if (!project) {
      navigate('/projects')
      return
    }

    const fetchSprints = async () => {
      try {
        const response = await API.get(`/sprints/project/${project.ProjectID}`)
        console.log('Sprints API response:', response)

        if (response.isSuccess && response.result.length > 0) {
          setSprints(response.result)
          setSelectedSprint(response.result[0].SprintID)
        } else {
          console.error('No sprints found for this project')
          setSprints([])
        }
      } catch (error) {
        console.error('Error loading sprints:', error)
        setSprints([])
      }
    }

    // Fetch log types for display
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

    fetchSprints()
    fetchLogTypes()
  }, [project, navigate])

  // Load logs when sprint changes
  useEffect(() => {
    if (!selectedSprint) return

    const fetchLogs = async () => {
      setLoading(true)
      try {
        const response = await API.get(`/projectlogs/sprint/${selectedSprint}`)
        console.log('Logs API response:', response)
        if (response.isSuccess) {
          // Map log type IDs to names if we have the log types loaded
          const logsWithTypeNames = response.result.map((log) => {
            const logType = logTypes.find((type) => type.TypeID === log.Log_LogTypeID)
            return {
              ...log,
              LogTypeName: logType ? logType.TypeName : `Type ${log.Log_LogTypeID}`,
            }
          })
          setLogs(logsWithTypeNames)

          // Set the first log as selected if available
          if (logsWithTypeNames.length > 0) {
            setSelectedLog(logsWithTypeNames[0])
          } else {
            setSelectedLog(null)
          }
        } else {
          setLogs([])
          setSelectedLog(null)
          console.error('Error loading logs:', response.message)
        }
      } catch (error) {
        console.error('Error loading logs:', error)
        setLogs([])
        setSelectedLog(null)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [selectedSprint, logTypes])

  const handleSprintChange = (event) => {
    setSelectedSprint(event.target.value)
  }

  const handleViewChange = (view) => {
    setViewMode(view)
  }

  const handleLogAdded = (newLog) => {
    // Refresh logs instead of manual state update
    refreshLogs()
  }

  const handleSprintAdded = (newSprint) => {
    setSprints((prevSprints) => [...prevSprints, newSprint])
    setSelectedSprint(newSprint.SprintID)
  }

  const handleEditLog = () => {
    setEditMode(true)
    setLogFormOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteLog = async () => {
    try {
      const response = await API.delete(`/projectlogs/${selectedLog.LogID}`)
      if (response.isSuccess) {
        // Refresh logs instead of manual state update
        refreshLogs()
        setDeleteDialogOpen(false)
      } else {
        console.error('Failed to delete log:', response.message)
        alert('Failed to delete log: ' + response.message)
      }
    } catch (error) {
      console.error('Error deleting log:', error)
      alert('Error deleting log: ' + error.message)
    }
  }

  const refreshLogs = async () => {
    if (!selectedSprint) return

    try {
      const response = await API.get(`/projectlogs/sprint/${selectedSprint}`)
      if (response.isSuccess) {
        const logsWithTypeNames = response.result.map((log) => {
          const logType = logTypes.find((type) => type.TypeID === log.Log_LogTypeID)
          return {
            ...log,
            LogTypeName: logType ? logType.TypeName : `Type ${log.Log_LogTypeID}`,
          }
        })
        setLogs(logsWithTypeNames)
        if (logsWithTypeNames.length > 0) {
          setSelectedLog(logsWithTypeNames[0])
        } else {
          setSelectedLog(null)
        }
      }
    } catch (error) {
      console.error('Error refreshing logs:', error)
    }
  }

  if (!project) {
    return <Typography>No project selected. Please go back to the projects page.</Typography>
  }

  // Get current sprint details
  const currentSprint = sprints.find((s) => s.SprintID === selectedSprint) || {}

  // Render the team view
  const renderTeamView = () => {
    return <TeamTable projectId={project.ProjectID} />
  }

  // Render the engagement view
  const renderEngagementView = () => {
    return <EngagementMetrics projectId={project.ProjectID} selectedSprint={selectedSprint} />
  }

  // Render the overview (log detail) view
  const renderOverview = () => {
    if (loading) {
      return (
        <Paper sx={{p: 4, textAlign: 'center'}}>
          <Typography>Loading...</Typography>
        </Paper>
      )
    }

    if (!selectedLog) {
      return (
        <Paper sx={{p: 4, textAlign: 'center'}}>
          <Typography variant="h6">No log found for this sprint</Typography>
          <Typography variant="body2" color="textSecondary" sx={{mt: 2}}>
            Click the ADD LOG button to create a new log entry
          </Typography>
        </Paper>
      )
    }

    return (
      <Paper sx={{p: 4}}>
        <Typography variant="h5" component="h2" gutterBottom>
          DESCRIPTION
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>
            {selectedLog.LogDescription || 'No description provided.'}
          </Typography>
        </Paper>

        <Typography variant="h5" component="h2" gutterBottom>
          TASK DESCRIPTION
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>
            {selectedLog.LogTaskDescription || 'No task description provided.'}
          </Typography>
        </Paper>

        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditLog}
            sx={{minWidth: '120px', bgcolor: '#4a77e5'}}
          >
            EDIT
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteConfirm}
            sx={{minWidth: '120px'}}
          >
            DELETE
          </Button>
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{flexGrow: 1, p: 3}}>
      <Typography variant="h4" component="h1" gutterBottom>
        {project.ProjectName}
      </Typography>

      <Paper sx={{p: 3, mb: 3}}>
        {/* Log title and log type */}
        <Box sx={{display: 'flex', flexDirection: 'column', mb: 3}}>
          <Typography variant="h6" sx={{fontWeight: 'bold'}}>
            {selectedLog ? selectedLog.LogTitle : 'No logs created yet'}
          </Typography>
          {selectedLog && (
            <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
              {selectedLog.LogTypeName}
            </Typography>
          )}
        </Box>

        {/* View controls */}
        <Box sx={{mb: 3}}>
          <ButtonGroup variant="contained" fullWidth>
            <Button
              onClick={() => handleViewChange('overview')}
              variant={viewMode === 'overview' ? 'contained' : 'outlined'}
              sx={{px: 3}}
            >
              OVER VIEW
            </Button>
            <Button
              onClick={() => handleViewChange('team')}
              variant={viewMode === 'team' ? 'contained' : 'outlined'}
              sx={{px: 3}}
            >
              VIEW TEAM
            </Button>
            <Button
              onClick={() => handleViewChange('engagement')}
              variant={viewMode === 'engagement' ? 'contained' : 'outlined'}
              sx={{px: 3}}
            >
              ENGAGEMENT
            </Button>
          </ButtonGroup>
        </Box>

        {/* Sprint selection and action buttons */}
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3}}>
          <Box sx={{minWidth: '200px', width: '40%'}}>
            <Select
              value={selectedSprint || ''}
              onChange={handleSprintChange}
              displayEmpty
              fullWidth
              sx={{height: '56px'}}
            >
              <MenuItem value="" disabled>
                Select Sprint
              </MenuItem>
              {sprints.map((sprint) => (
                <MenuItem key={sprint.SprintID} value={sprint.SprintID}>
                  {sprint.SprintName || `Sprint ${sprint.SprintID}`}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{display: 'flex', gap: 2}}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setSprintFormOpen(true)}
              sx={{height: '56px'}}
            >
              ADD SPRINT
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditMode(false)
                setLogFormOpen(true)
              }}
              disabled={!selectedSprint}
              sx={{height: '56px', bgcolor: '#4a77e5'}}
            >
              ADD LOG
            </Button>
          </Box>
        </Box>

        {/* Sprint date range */}
        {selectedSprint && (
          <Box sx={{display: 'flex', gap: 3, mb: 2}}>
            <Box sx={{flex: 1}}>
              <Typography variant="body2" sx={{mb: 1}}>
                Start Date
              </Typography>
              <TextField
                fullWidth
                disabled
                value={currentSprint.SprintStartDate?.substring(0, 10) || ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            <Box sx={{flex: 1}}>
              <Typography variant="body2" sx={{mb: 1}}>
                End Date
              </Typography>
              <TextField
                fullWidth
                disabled
                value={currentSprint.SprintEndDate?.substring(0, 10) || ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Box>
        )}
      </Paper>

      {/* Main content area */}
      <Box>
        {viewMode === 'overview' && renderOverview()}
        {viewMode === 'team' && renderTeamView()}
        {viewMode === 'engagement' && renderEngagementView()}
      </Box>

      {/* Add/Edit Log Form Dialog */}
      <ProjectLogForm
        open={logFormOpen}
        onClose={() => {
          setLogFormOpen(false)
          setEditMode(false)
          // Refresh logs when form is closed (especially important after editing)
          refreshLogs()
        }}
        sprintId={selectedSprint}
        onLogAdded={handleLogAdded}
        initialLog={editMode ? selectedLog : null}
        isEditMode={editMode}
      />

      {/* Add Sprint Form Dialog */}
      <SprintForm
        open={sprintFormOpen}
        onClose={() => setSprintFormOpen(false)}
        projectId={project.ProjectID}
        onSprintAdded={handleSprintAdded}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteLog} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
