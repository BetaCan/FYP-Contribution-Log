import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {ThemeProvider} from '@mui/material/styles'
import {useContext} from 'react'
import Layout from './components/layouts/Layout'
import Home from './components/pages/Home'
import SignIn from './components/pages/SignIn'
import ContactUs from './components/pages/ContactUs'
import MyProjects from './components/pages/MyProjects'
import Projects from './components/pages/Projects'
import PageNotFound from './components/pages/404'
import Logs from './components/pages/Logs'
import ProjectLogs from './components/pages/ProjectLogs'
import Components from './components/pages/Components'
import theme from './components/Styles/Theme'
import UserPage from './components/pages/UserPage'
import UserContext, {UserProvider} from './context/UserContext'

import './App.scss'

// Protected route component
function ProtectedRoute({element, allowedRoles = []}) {
  const {loggedInUser} = useContext(UserContext)

  // If user is not logged in, redirect to login
  if (!loggedInUser) {
    return <Navigate to="/signin" />
  }

  // If roles are specified and user doesn't have an allowed role, redirect to home
  if (allowedRoles.length > 0 && !allowedRoles.includes(loggedInUser.Role)) {
    return <Navigate to="/" />
  }

  // User is authorized, render the requested component
  return element
}

function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* Protected routes */}
      <Route path="/myprojects" element={<ProtectedRoute element={<MyProjects />} />} />
      <Route
        path="/projects"
        element={<ProtectedRoute element={<Projects />} allowedRoles={['Admin']} />}
      />
      <Route
        path="/components"
        element={<ProtectedRoute element={<Components />} allowedRoles={['Admin']} />}
      />
      <Route path="/logs" element={<ProtectedRoute element={<ProjectLogs />} />} />
      <Route path="/userpage" element={<ProtectedRoute element={<UserPage />} />} />

      {/* 404 route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
