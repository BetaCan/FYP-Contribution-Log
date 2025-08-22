import * as React from 'react'
import {useState, useEffect, useContext} from 'react'
import {Container, TextField, Button, Box, Typography} from '@mui/material'
import API from '../../api/API'
import UserContext from '../../../context/UserContext'
import {useNavigate} from 'react-router-dom'

function SignInPage() {
  // State
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading users...')
  const {setLoggedInUser} = useContext(UserContext)
  const navigate = useNavigate()

  // Available roles
  const roles = ['All', 'Admin', 'Professor', 'Project Manager', 'Student', 'User']

  // Fetch users based on selected role
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Determine which endpoint to use based on selected role
        const endpoint =
          selectedRole && selectedRole !== 'All'
            ? `/users/${selectedRole.replace(' ', '')}` // Remove space for "Project Manager"
            : '/users'

        const response = await API.get(endpoint)

        if (response.isSuccess) {
          setUsers(response.result)
          setLoadingMessage('')
        } else {
          setLoadingMessage('Failed to load users')
          console.error('API error:', response.message)
        }
      } catch (error) {
        setLoadingMessage('Error connecting to server')
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [selectedRole])

  // Handle role selection change
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value)
    setSelectedUserId('') // Reset selected user when changing roles
  }

  // Handle user selection change
  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value)
  }

  // Handle login button click
  const handleLogin = () => {
    if (!selectedUserId) return

    const selectedUser = users.find((user) => user.UserID.toString() === selectedUserId.toString())
    if (selectedUser) {
      setLoggedInUser(selectedUser)
      console.log(
        `Logged in as ${selectedUser.UserFirstName} ${selectedUser.UserLastName} (${selectedUser.Role})`
      )
      // Redirect to home or dashboard after login
      navigate('/')
    }
  }

  // View
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{my: 3}}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Select User to Login
        </Typography>

        {/* Role Selector */}
        <Box sx={{width: '100%', mb: 2}}>
          <Typography variant="body2" gutterBottom>
            1. Select Role (Optional)
          </Typography>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            style={{
              padding: '8px',
              width: '100%',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </Box>

        {/* User Selector */}
        <Box sx={{width: '100%', mb: 2}}>
          <Typography variant="body2" gutterBottom>
            2. Select User
          </Typography>

          {loadingMessage ? (
            <Typography variant="body2" color="text.secondary">
              {loadingMessage}
            </Typography>
          ) : users.length === 0 ? (
            <Typography variant="body2" color="error">
              No users found for this role
            </Typography>
          ) : (
            <select
              value={selectedUserId}
              onChange={handleUserChange}
              style={{
                padding: '8px',
                width: '100%',
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="" disabled>
                Select a user to login as
              </option>
              {users.map((user) => (
                <option key={user.UserID} value={user.UserID}>
                  {user.UserFirstName} {user.UserLastName} - {user.Role} (ID: {user.UserID})
                </option>
              ))}
            </select>
          )}
        </Box>

        {/* Login Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={!selectedUserId}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  )
}

export default SignInPage
