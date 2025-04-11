import {useState, useEffect, useContext} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import API from '../api/API.js'
import ProjectLogsTable from '../entities/projectlogs/ProjectLogsTable'
import ProjectLogForm from '../entities/projectlogs/ProjectLogForm'
import UserContext from '../../context/UserContext.js'

// You'll need to create this component for adding sprints
import SprintForm from '../entities/projectlogs/SprintForm'

export default function ProjectLogs() {
  const location = useLocation()
  const navigate = useNavigate()
  const {loggedInUser} = useContext(UserContext)
  const {project} = location.state || {project: null}

  const [selectedSprint, setSelectedSprint] = useState(null)
  const [sprints, setSprints] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('overview')
  const [logFormOpen, setLogFormOpen] = useState(false)
  const [sprintFormOpen, setSprintFormOpen] = useState(false)

  // First, check if we have a valid project
  useEffect(() => {
    if (!project) {
      navigate('/projects')
      return
    }

    const fetchSprints = async () => {
      try {
        // Use the endpoint to fetch sprints for this project
        const response = await API.get(`/sprints/project/${project.ProjectID}`)
        console.log('Sprints API response:', response) // Debug log

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

    fetchSprints()
  }, [project, navigate])

  // Load logs when sprint changes
  useEffect(() => {
    if (!selectedSprint) return

    const fetchLogs = async () => {
      setLoading(true)
      try {
        const response = await API.get(`/projectlogs/sprint/${selectedSprint}`)
        console.log('Logs API response:', response) // Debug log
        if (response.isSuccess) {
          setLogs(response.result)
        } else {
          setLogs([])
          console.error('Error loading logs:', response.message)
        }
      } catch (error) {
        console.error('Error loading logs:', error)
        setLogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [selectedSprint])

  const handleSprintChange = (event) => {
    setSelectedSprint(event.target.value)
  }

  const handleViewChange = (view) => {
    setViewMode(view)
  }

  const handleLogAdded = (newLog) => {
    setLogs((prevLogs) => [newLog, ...prevLogs])
  }

  const handleSprintAdded = (newSprint) => {
    setSprints((prevSprints) => [...prevSprints, newSprint])
    setSelectedSprint(newSprint.SprintID)
  }

  if (!project) {
    return <Typography>No project selected. Please go back to the projects page.</Typography>
  }

  return (
    <Box sx={{flexGrow: 1, p: 3}}>
      <Typography variant="h4" component="h1" gutterBottom>
        {project.ProjectName}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{p: 2}}>
            <Box
              sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}
            >
              <Typography variant="h6">Sprint & Logs Management</Typography>

              <ButtonGroup variant="contained" aria-label="view mode buttons">
                <Button
                  onClick={() => handleViewChange('overview')}
                  color={viewMode === 'overview' ? 'primary' : 'inherit'}
                >
                  Overview
                </Button>
                <Button
                  onClick={() => handleViewChange('team')}
                  color={viewMode === 'team' ? 'primary' : 'inherit'}
                >
                  View Team
                </Button>
                <Button
                  onClick={() => handleViewChange('engagement')}
                  color={viewMode === 'engagement' ? 'primary' : 'inherit'}
                >
                  Engagement
                </Button>
              </ButtonGroup>
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
              <FormControl sx={{minWidth: 200, mr: 2}}>
                <Select
                  value={selectedSprint || ''}
                  onChange={handleSprintChange}
                  displayEmpty
                  inputProps={{'aria-label': 'Select Sprint'}}
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
              </FormControl>

              {/* Add Sprint Button */}
              <IconButton
                color="primary"
                aria-label="add sprint"
                onClick={() => setSprintFormOpen(true)}
                sx={{mr: 1}}
              >
                <AddIcon /> Sprint
              </IconButton>

              {/* Add Log Button */}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => setLogFormOpen(true)}
                disabled={!selectedSprint}
              >
                Add Log
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Start Date"
            type="date"
            value={
              (selectedSprint &&
                sprints
                  .find((s) => s.SprintID === selectedSprint)
                  ?.SprintStartDate?.substring(0, 10)) ||
              ''
            }
            InputLabelProps={{
              shrink: true,
            }}
            disabled
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="End Date"
            type="date"
            value={
              (selectedSprint &&
                sprints
                  .find((s) => s.SprintID === selectedSprint)
                  ?.SprintEndDate?.substring(0, 10)) ||
              ''
            }
            InputLabelProps={{
              shrink: true,
            }}
            disabled
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <Typography>Loading logs...</Typography>
          ) : (
            <ProjectLogsTable
              logs={logs}
              viewMode={viewMode}
              projectId={project.ProjectID}
              sprintId={selectedSprint}
            />
          )}
        </Grid>
      </Grid>

      {/* Add Log Form Dialog */}
      <ProjectLogForm
        open={logFormOpen}
        onClose={() => setLogFormOpen(false)}
        sprintId={selectedSprint}
        onLogAdded={handleLogAdded}
      />

      {/* Add Sprint Form Dialog */}
      <SprintForm
        open={sprintFormOpen}
        onClose={() => setSprintFormOpen(false)}
        projectId={project.ProjectID}
        onSprintAdded={handleSprintAdded}
      />
    </Box>
  )
}
