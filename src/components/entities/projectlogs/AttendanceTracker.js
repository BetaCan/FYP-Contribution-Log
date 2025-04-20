import {useState, useEffect} from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import SaveIcon from '@mui/icons-material/Save'
import API from '../../api/API'

/**
 * SimpleAttendanceTracker Component
 * A straightforward table to mark users' attendance
 */
export default function AttendanceTracker({sprintId, projectId}) {
  const [users, setUsers] = useState([])
  const [userAttendance, setUserAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Status options for attendance
  const attendanceStatus = [
    {value: 'Present', label: 'Present'},
    {value: 'Late', label: 'Late'},
    {value: 'Excused', label: 'Excused'},
    {value: 'Absent', label: 'Absent'},
  ]

  // Get color for status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return {bgcolor: '#81c784', color: 'white'} // Green
      case 'late':
        return {bgcolor: '#ffd54f', color: 'black'} // Yellow
      case 'excused':
        return {bgcolor: '#90caf9', color: 'black'} // Light blue
      case 'absent':
        return {bgcolor: '#e57373', color: 'white'} // Red
      default:
        return {bgcolor: '#e0e0e0', color: 'black'} // Grey
    }
  }

  // Fetch users for this sprint's project
  useEffect(() => {
    if (!sprintId) return

    // In AttendanceTracker.js, modify the fetchUsers function:

    const fetchUsers = async () => {
      setLoading(true)
      try {
        // Fetch all attendance records for this sprint
        const attendanceResponse = await API.get(`/attendance/sprint/${sprintId}`)
        if (!attendanceResponse.isSuccess) {
          setError('Failed to fetch attendance data')
          return
        }

        // Extract unique user IDs from attendance records
        const userIds = [
          ...new Set(attendanceResponse.result.map((record) => record.Attendance_UserID)),
        ]

        if (userIds.length === 0) {
          // If no attendance records yet, show empty state
          setUsers([])
          setError(null)
          setLoading(false)
          return
        }

        // Fetch all users at once
        const usersResponse = await API.get('/users')
        if (!usersResponse.isSuccess) {
          setError('Failed to fetch user data')
          return
        }

        // Filter users who are in the attendance records
        const relevantUsers = usersResponse.result
          .filter((user) => userIds.includes(user.UserID))
          .map((user) => ({
            id: user.UserID,
            name: `${user.UserFirstName} ${user.UserLastName}`,
            status: 'Present', // Default status
          }))

        // Create a map of the latest status for each user
        const latestStatusMap = {}
        attendanceResponse.result.forEach((record) => {
          // Only update if this is the latest record we've seen for this user
          if (
            !latestStatusMap[record.Attendance_UserID] ||
            new Date(record.AttendanceUpdatedAt) >
              new Date(latestStatusMap[record.Attendance_UserID].updatedAt)
          ) {
            latestStatusMap[record.Attendance_UserID] = {
              status: record.AttendanceStatus,
              id: record.AttendanceID,
              updatedAt: record.AttendanceUpdatedAt,
            }
          }
        })

        // Apply the latest status to each user
        const usersWithStatus = relevantUsers.map((user) => ({
          ...user,
          status: latestStatusMap[user.id]?.status || 'Present',
          attendanceId: latestStatusMap[user.id]?.id,
        }))

        setUsers(usersWithStatus)
        setError(null)
      } catch (err) {
        console.error('Error loading users or attendance:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [sprintId])

  // Handle status change
  const handleStatusChange = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? {...user, status: newStatus} : user))
    )
  }

  // Save all attendance records
  const handleSaveAttendance = async () => {
    if (!sprintId) return

    setSaving(true)
    try {
      const date = new Date().toISOString().split('T')[0]
      const allPromises = []

      // Process each user's attendance
      for (const user of users) {
        const attendanceData = {
          AttendanceMeetingDate: date,
          Attendance_UserID: user.id,
          Attendance_SprintID: sprintId,
          AttendanceStatus: user.status,
        }

        if (user.attendanceId) {
          // Update existing attendance record
          allPromises.push(API.put(`/attendance/${user.attendanceId}`, attendanceData))
        } else {
          // Create new attendance record
          allPromises.push(API.post('/attendance', attendanceData))
        }
      }

      const results = await Promise.all(allPromises)

      if (results.every((res) => res.isSuccess)) {
        // All records saved successfully
        const response = await API.get(`/attendance/sprint/${sprintId}`)
        if (response.isSuccess) {
          // Update the UI with new attendance data
          const attendanceMap = {}
          response.result.forEach((record) => {
            attendanceMap[record.Attendance_UserID] = record.AttendanceID
          })

          setUsers((prev) =>
            prev.map((user) => ({
              ...user,
              attendanceId: attendanceMap[user.id] || user.attendanceId,
            }))
          )
        }
        alert('Attendance saved successfully!')
      } else {
        alert('Some attendance records failed to save.')
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Error saving attendance. Please try again.')
    } finally {
      setSaving(false)
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
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{backgroundColor: '#f5f5f5'}}>
              <TableCell>Team Member</TableCell>
              <TableCell align="center">Attendance Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell align="center">
                  <Select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    sx={{
                      width: 120,
                      '& .MuiSelect-select': {
                        ...getStatusColor(user.status),
                        fontWeight: 'bold',
                        textAlign: 'center',
                      },
                    }}
                  >
                    {attendanceStatus.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveAttendance}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : 'Save Attendance'}
        </Button>
      </Box>
    </Box>
  )
}
