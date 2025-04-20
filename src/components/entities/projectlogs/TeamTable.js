import {useState, useEffect} from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import API from '../../api/API.js'

export default function TeamTable({projectId}) {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!projectId) return

      setLoading(true)
      try {
        // This endpoint should return users associated with the project
        const response = await API.get(`/userprojects/project/${projectId}`)

        if (response.isSuccess) {
          setTeamMembers(response.result)
        } else {
          console.error('Failed to load team members:', response.message)
          setTeamMembers([])
        }
      } catch (error) {
        console.error('Error loading team members:', error)
        setTeamMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [projectId])

  if (loading) {
    return <Typography>Loading team members...</Typography>
  }

  if (teamMembers.length === 0) {
    return <Typography>No team members found for this project.</Typography>
  }

  // Get role color based on role name
  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'Overseer':
        return 'error'
      case 'Leader':
        return 'warning'
      case 'Contributor':
        return 'success'
      case 'Viewer':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Project Team
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="team members table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.UserID}>
                <TableCell>{member.UserID}</TableCell>
                <TableCell>{`${member.UserFirstName} ${member.UserLastName}`}</TableCell>
                <TableCell>
                  <Chip
                    label={member.ProjectRoleName}
                    color={getRoleColor(member.ProjectRoleName)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{member.UserEmail}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => window.open(`mailto:${member.UserEmail}`)}
                  >
                    Contact
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
