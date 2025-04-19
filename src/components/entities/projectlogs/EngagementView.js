import React, {useState, useEffect, useContext} from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardActions,
  Switch,
  TextField,
} from '@mui/material'
import API from '../../api/API.js'
import UserContext from '../../../context/UserContext.js'

export default function EngagementView({project, selectedSprint}) {
  // Initialisation --------------------------------------------------------------------------------------------------
  // Helper functions for UI display
  const getScoreColor = (score) => {
    if (score >= 90) return '#4caf50' // Green
    if (score >= 80) return '#8bc34a' // Light Green
    if (score >= 70) return '#ffc107' // Amber
    if (score >= 60) return '#ff9800' // Orange
    return '#f44336' // Red
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return '#4caf50' // Green
      case 'Late':
        return '#ff9800' // Orange
      case 'Excused':
        return '#2196f3' // Blue
      case 'Absent':
        return '#f44336' // Red
      default:
        return '#757575' // Grey
    }
  }

  // Context ----------------------------------------------------------------------------------------------------
  const {loggedInUser} = useContext(UserContext)

  // State ------------------------------------------------------------------------------------------------------
  // UI state
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [todayDate] = useState(new Date().toISOString().split('T')[0])
  const [isSprintActive, setIsSprintActive] = useState(false)

  // Data state
  const [teamMembers, setTeamMembers] = useState([])
  const [users, setUsers] = useState({})
  const [calculatedMetrics, setCalculatedMetrics] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [taskCompletionRecords, setTaskCompletionRecords] = useState([])

  // Dialog state
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [attendanceStatus, setAttendanceStatus] = useState('Present')
  const [taskStatus, setTaskStatus] = useState(false)
  const [taskDescription, setTaskDescription] = useState('')
  const [existingRecordId, setExistingRecordId] = useState(null)
  const [existingTaskId, setExistingTaskId] = useState(null)

  // Effects and Data Loading -----------------------------------------------------------------------------------
  // Fetch team members for the project
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!project?.ProjectID) return

      try {
        setLoading(true)
        const response = await API.get(`/userprojects/project/${project.ProjectID}`)

        if (response.isSuccess) {
          const teamData = response.result || []
          setTeamMembers(teamData)

          // Create mapping of user IDs to names
          const namesMap = {}
          teamData.forEach((member) => {
            namesMap[member.UserID] = `${member.UserFirstName} ${member.UserLastName}`
          })
          setUsers(namesMap)
        } else {
          console.error('Failed to fetch team members:', response.message)
          setTeamMembers([])
        }
      } catch (error) {
        console.error('Error fetching team members:', error)
        setTeamMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [project])

  // Check if sprint is active and load attendance and task data when sprint changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSprint) return

      setLoading(true)

      try {
        // Fetch sprint info first to check if it's active
        const sprintResponse = await API.get(`/sprints/${selectedSprint}`)
        if (sprintResponse.isSuccess) {
          const sprint = sprintResponse.result
          const today = new Date()
          const startDate = new Date(sprint.SprintStartDate)
          const endDate = new Date(sprint.SprintEndDate)

          // Check if today is within sprint range
          setIsSprintActive(today >= startDate && today <= endDate)
        }

        // Fetch attendance
        const attendanceResponse = await API.get(`/attendance/sprint/${selectedSprint}`)
        if (attendanceResponse.isSuccess) {
          setAttendanceRecords(attendanceResponse.result || [])
        } else {
          console.error('Failed to fetch attendance:', attendanceResponse.message)
          setAttendanceRecords([])
        }

        // Fetch task completions
        const taskResponse = await API.get(`/taskcompletions/sprint/${selectedSprint}`)
        if (taskResponse.isSuccess) {
          setTaskCompletionRecords(taskResponse.result || [])
        } else {
          console.error('Failed to fetch task completions:', taskResponse.message)
          setTaskCompletionRecords([])
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedSprint])

  // Calculate metrics whenever attendance or task records change
  useEffect(() => {
    calculateEngagementMetrics()
  }, [attendanceRecords, taskCompletionRecords, teamMembers])

  // Methods ----------------------------------------------------------------------------------------------------
  // Calculate engagement metrics based on attendance and task completion
  const calculateEngagementMetrics = () => {
    if (teamMembers.length === 0) return

    const metrics = teamMembers.map((member) => {
      // Get attendance records for this user
      const userAttendanceRecords = attendanceRecords.filter(
        (record) => record.Attendance_UserID === member.UserID
      )

      // Calculate attendance score
      const totalMeetings = userAttendanceRecords.length || 1 // Avoid division by zero
      const presentCount = userAttendanceRecords.filter(
        (r) => r.AttendanceStatus === 'Present'
      ).length
      const lateCount = userAttendanceRecords.filter((r) => r.AttendanceStatus === 'Late').length
      const excusedCount = userAttendanceRecords.filter(
        (r) => r.AttendanceStatus === 'Excused'
      ).length

      // Calculate attendance score (Present = 100%, Late = 75%, Excused = 50%, Absent = 0%)
      const attendanceScore = Math.round(
        ((presentCount * 1.0 + lateCount * 0.75 + excusedCount * 0.5) / totalMeetings) * 100
      )

      // Get task records for this user
      const userTaskRecords = taskCompletionRecords.filter(
        (record) => record.TaskCompletion_UserID === member.UserID
      )

      // Calculate task completion score
      let taskCompletionScore = 70 // Default score if no data
      if (userTaskRecords.length > 0) {
        const completedTasks = userTaskRecords.filter(
          (r) => r.TaskCompletionStatus === true || r.TaskCompletionStatus === 1
        ).length
        taskCompletionScore = Math.round((completedTasks / userTaskRecords.length) * 100)
      }

      // Generate random score for feedback (simulated in this version)
      const feedbackScore = Math.round(70 + Math.random() * 30)

      // Calculate overall score
      const totalScore = Math.round((attendanceScore + taskCompletionScore + feedbackScore) / 3)

      return {
        MetricID: member.UserID,
        Metric_UserID: member.UserID,
        MetricAttendanceScore: attendanceScore,
        MetricTaskCompletionScore: taskCompletionScore,
        MetricFeedbackScore: feedbackScore,
        MetricTotalScore: totalScore,
        UserName: `${member.UserFirstName} ${member.UserLastName}`,
      }
    })

    setCalculatedMetrics(metrics)
  }

  // Tab handling
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex)
  }

  // Attendance management functions
  const openAttendanceDialog = (userId) => {
    setSelectedUser(userId)

    // Check if there's an existing record for this user today
    const existingRecord = attendanceRecords.find(
      (record) =>
        record.Attendance_UserID === userId &&
        new Date(record.AttendanceMeetingDate).toISOString().split('T')[0] === todayDate
    )

    if (existingRecord) {
      setAttendanceStatus(existingRecord.AttendanceStatus)
      setExistingRecordId(existingRecord.AttendanceID)
    } else {
      setAttendanceStatus('Present')
      setExistingRecordId(null)
    }

    setAttendanceDialogOpen(true)
  }

  const handleAttendanceSubmit = async () => {
    if (!selectedSprint || !selectedUser) return

    try {
      const payload = {
        AttendanceMeetingDate: todayDate,
        Attendance_UserID: selectedUser,
        Attendance_SprintID: selectedSprint,
        AttendanceStatus: attendanceStatus,
      }

      let response

      if (existingRecordId) {
        response = await API.put(`/attendance/${existingRecordId}`, payload)
      } else {
        response = await API.post('/attendance', payload)
      }

      // Close dialog regardless of success/failure
      setAttendanceDialogOpen(false)

      if (response && response.isSuccess) {
        // Refresh the attendance records
        const updatedResponse = await API.get(`/attendance/sprint/${selectedSprint}`)
        if (updatedResponse.isSuccess) {
          setAttendanceRecords(updatedResponse.result || [])
        }
      } else {
        console.error('Failed to submit attendance:', response ? response.message : 'Unknown error')
        alert('Failed to submit attendance: ' + (response ? response.message : 'Unknown error'))
      }
    } catch (error) {
      console.error('Error submitting attendance:', error)
      alert('Error submitting attendance: ' + error.message)
      setAttendanceDialogOpen(false)
    }
  }

  // Task management functions
  const openTaskDialog = (userId) => {
    setSelectedUser(userId)

    // Check if there's an existing record for this user today
    const existingTask = taskCompletionRecords.find(
      (record) =>
        record.TaskCompletion_UserID === userId &&
        new Date(record.TaskCompletionDate).toISOString().split('T')[0] === todayDate
    )

    if (existingTask) {
      // Handle different data formats (boolean vs number)
      const statusValue =
        typeof existingTask.TaskCompletionStatus === 'boolean'
          ? existingTask.TaskCompletionStatus
          : existingTask.TaskCompletionStatus === 1

      setTaskStatus(statusValue)
      setTaskDescription(existingTask.TaskCompletionDescription || '')
      setExistingTaskId(existingTask.TaskCompletionID)
    } else {
      setTaskStatus(false)
      setTaskDescription('')
      setExistingTaskId(null)
    }

    setTaskDialogOpen(true)
  }

  const handleTaskSubmit = async () => {
    if (!selectedSprint || !selectedUser) return

    try {
      const payload = {
        TaskCompletionDate: todayDate,
        TaskCompletion_UserID: selectedUser,
        TaskCompletion_SprintID: selectedSprint,
        TaskCompletionStatus: taskStatus,
        TaskCompletionDescription: taskDescription,
      }

      let response

      if (existingTaskId) {
        response = await API.put(`/taskcompletions/${existingTaskId}`, payload)
      } else {
        response = await API.post('/taskcompletions', payload)
      }

      // Close dialog regardless of success/failure
      setTaskDialogOpen(false)

      if (response && response.isSuccess) {
        // Refresh the task completion records
        const updatedResponse = await API.get(`/taskcompletions/sprint/${selectedSprint}`)
        if (updatedResponse.isSuccess) {
          setTaskCompletionRecords(updatedResponse.result || [])
        }
      } else {
        console.error(
          'Failed to submit task completion:',
          response ? response.message : 'Unknown error'
        )
        alert(
          'Failed to submit task completion: ' + (response ? response.message : 'Unknown error')
        )
      }
    } catch (error) {
      console.error('Error submitting task completion:', error)
      alert('Error submitting task completion: ' + error.message)
      setTaskDialogOpen(false)
    }
  }

  // Utility functions
  const getUserAttendanceStatus = (userId) => {
    // Make sure we're looking at the current attendance records
    const record = attendanceRecords.find(
      (record) =>
        record.Attendance_UserID === userId &&
        new Date(record.AttendanceMeetingDate).toISOString().split('T')[0] === todayDate
    )

    // Debug to check if we're finding the record properly
    console.log(`Checking attendance for user ${userId}:`, record)

    return record ? record.AttendanceStatus : null
  }

  const getUserTaskStatus = (userId) => {
    const record = taskCompletionRecords.find(
      (record) =>
        record.TaskCompletion_UserID === userId &&
        new Date(record.TaskCompletionDate).toISOString().split('T')[0] === todayDate
    )

    if (!record) return null

    // Handle different data formats (boolean vs number)
    const isCompleted =
      typeof record.TaskCompletionStatus === 'boolean'
        ? record.TaskCompletionStatus
        : record.TaskCompletionStatus === 1

    return isCompleted ? 'Completed' : 'Not Completed'
  }

  // View -------------------------------------------------------------------------------------------------------
  if (loading) {
    return (
      <Paper sx={{p: 4, textAlign: 'center'}}>
        <CircularProgress />
        <Typography variant="body1" sx={{mt: 2}}>
          Loading engagement metrics...
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{p: 4}}>
      <Typography variant="h5" component="h2" gutterBottom>
        Engagement Metrics
      </Typography>

      <Box sx={{mb: 3, borderBottom: 1, borderColor: 'divider'}}>
        <Box sx={{display: 'flex', mb: 1}}>
          <Button
            variant={activeTab === 0 ? 'contained' : 'outlined'}
            onClick={() => handleTabChange(0)}
            sx={{mr: 1}}
            color="primary"
          >
            TEAM ATTENDANCE
          </Button>
          <Button
            variant={activeTab === 1 ? 'contained' : 'outlined'}
            onClick={() => handleTabChange(1)}
            sx={{mr: 1}}
            color="primary"
          >
            TASK TRACKING
          </Button>
          <Button
            variant={activeTab === 2 ? 'contained' : 'outlined'}
            onClick={() => handleTabChange(2)}
            color="primary"
          >
            TEAM METRICS
          </Button>
        </Box>
      </Box>

      {/* Team Attendance Tab */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{mb: 3}}>
            <Typography variant="h6" gutterBottom>
              Today's Attendance ({new Date(todayDate).toLocaleDateString()})
            </Typography>
            {isSprintActive ? (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Mark attendance for team members for today's meeting or work session.
              </Typography>
            ) : (
              <Typography variant="body2" color="error" gutterBottom>
                Note: The current sprint is not active. Attendance can still be recorded for
                documentation purposes.
              </Typography>
            )}
          </Box>

          <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
            {teamMembers.map((member) => {
              const attendanceStatus = getUserAttendanceStatus(member.UserID)

              return (
                <Card key={member.UserID} sx={{width: 200, mb: 2}}>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {member.UserFirstName} {member.UserLastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {member.ProjectRoleName || 'Team Member'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                      Status:
                    </Typography>

                    {attendanceStatus ? (
                      <Chip
                        label={attendanceStatus}
                        size="small"
                        sx={{
                          color: 'white',
                          backgroundColor: getStatusColor(attendanceStatus),
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not marked
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => openAttendanceDialog(member.UserID)}
                      fullWidth
                    >
                      MARK ATTENDANCE
                    </Button>
                  </CardActions>
                </Card>
              )
            })}
          </Box>
        </Box>
      )}

      {/* Task Tracking Tab */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{mb: 3}}>
            <Typography variant="h6" gutterBottom>
              Today's Task Completion ({new Date(todayDate).toLocaleDateString()})
            </Typography>
            {isSprintActive ? (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Record task completion status for team members.
              </Typography>
            ) : (
              <Typography variant="body2" color="error" gutterBottom>
                Note: The current sprint is not active. Task completion can still be recorded for
                documentation purposes.
              </Typography>
            )}
          </Box>

          <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
            {teamMembers.map((member) => {
              const taskStatus = getUserTaskStatus(member.UserID)

              return (
                <Card key={member.UserID} sx={{width: 200, mb: 2}}>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {member.UserFirstName} {member.UserLastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {member.ProjectRoleName || 'Team Member'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                      Task Status:
                    </Typography>

                    {taskStatus ? (
                      <Chip
                        label={taskStatus}
                        size="small"
                        sx={{
                          color: 'white',
                          backgroundColor: taskStatus === 'Completed' ? '#4caf50' : '#f44336',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not recorded
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => openTaskDialog(member.UserID)}
                      fullWidth
                    >
                      RECORD TASK STATUS
                    </Button>
                  </CardActions>
                </Card>
              )
            })}
          </Box>
        </Box>
      )}

      {/* Team Metrics Tab */}
      {activeTab === 2 && (
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{minWidth: 650}}>
            <TableHead>
              <TableRow sx={{backgroundColor: '#f5f5f5'}}>
                <TableCell>Team Member</TableCell>
                <TableCell align="center">Attendance</TableCell>
                <TableCell align="center">Task Completion</TableCell>
                <TableCell align="center">Feedback</TableCell>
                <TableCell align="center">Overall</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calculatedMetrics.length > 0 ? (
                calculatedMetrics.map((metric) => (
                  <TableRow key={metric.MetricID}>
                    <TableCell component="th" scope="row">
                      {users[metric.Metric_UserID] ||
                        metric.UserName ||
                        `User ID: ${metric.Metric_UserID}`}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${Math.round(metric.MetricAttendanceScore)}%`}
                        sx={{
                          fontWeight: 'bold',
                          color: 'white',
                          backgroundColor: getScoreColor(metric.MetricAttendanceScore),
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${Math.round(metric.MetricTaskCompletionScore)}%`}
                        sx={{
                          fontWeight: 'bold',
                          color: 'white',
                          backgroundColor: getScoreColor(metric.MetricTaskCompletionScore),
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${Math.round(metric.MetricFeedbackScore)}%`}
                        sx={{
                          fontWeight: 'bold',
                          color: 'white',
                          backgroundColor: getScoreColor(metric.MetricFeedbackScore),
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${Math.round(metric.MetricTotalScore)}%`}
                        sx={{
                          fontWeight: 'bold',
                          color: 'white',
                          backgroundColor: getScoreColor(metric.MetricTotalScore),
                        }}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No engagement metrics available for this project.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Attendance Dialog */}
      <Dialog open={attendanceDialogOpen} onClose={() => setAttendanceDialogOpen(false)}>
        <DialogTitle>Mark Attendance</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Record attendance for {users[selectedUser]} on{' '}
            {new Date(todayDate).toLocaleDateString()}.
          </Typography>
          <FormControl component="fieldset" sx={{mt: 2}}>
            <RadioGroup
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
            >
              <FormControlLabel value="Present" control={<Radio />} label="Present" />
              <FormControlLabel value="Late" control={<Radio />} label="Late" />
              <FormControlLabel value="Excused" control={<Radio />} label="Excused" />
              <FormControlLabel value="Absent" control={<Radio />} label="Absent" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialogOpen(false)}>CANCEL</Button>
          <Button onClick={handleAttendanceSubmit} variant="contained" color="primary">
            SUBMIT
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Completion Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)}>
        <DialogTitle>Record Task Completion</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Record task completion for {users[selectedUser]} on{' '}
            {new Date(todayDate).toLocaleDateString()}.
          </Typography>
          <Box sx={{mt: 2, mb: 2, display: 'flex', alignItems: 'center'}}>
            <Typography variant="body2" sx={{mr: 2}}>
              Task Completed:
            </Typography>
            <Switch
              checked={taskStatus}
              onChange={(e) => setTaskStatus(e.target.checked)}
              color="primary"
            />
            <Typography variant="body2" sx={{ml: 1}}>
              {taskStatus ? 'Yes' : 'No'}
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Task Description"
            multiline
            rows={4}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>CANCEL</Button>
          <Button onClick={handleTaskSubmit} variant="contained" color="primary">
            SUBMIT
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
