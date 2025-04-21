import {NavLink} from 'react-router-dom'
import {useContext} from 'react'
import UserContext from '../../context/UserContext'
import './Navbar.scss'

function Navbar() {
  // Context
  const {loggedInUser, setLoggedInUser} = useContext(UserContext)

  // Methods
  const handleLogout = () => {
    setLoggedInUser(null)
  }

  return (
    <nav className="main-nav">
      <div className="nav-content">
        <div className="nav-links">
          {/* Home link - visible to all */}
          <div className="nav-item">
            <NavLink to="/" className={({isActive}) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
          </div>

          {/* Links only visible when logged in */}
          {loggedInUser && (
            <>
              {/* Projects link - only visible to Admins */}
              {loggedInUser.Role === 'Admin' && (
                <div className="nav-item">
                  <NavLink to="/projects" className={({isActive}) => (isActive ? 'active' : '')}>
                    Projects
                  </NavLink>
                </div>
              )}

              {/* My Projects link - visible to all logged in users */}
              <div className="nav-item">
                <NavLink to="/myprojects" className={({isActive}) => (isActive ? 'active' : '')}>
                  My Projects
                </NavLink>
              </div>

              {/* Components link - only visible to Admins */}
              {loggedInUser.Role === 'Admin' && (
                <div className="nav-item">
                  <NavLink to="/components" className={({isActive}) => (isActive ? 'active' : '')}>
                    Components
                  </NavLink>
                </div>
              )}

              {/* Profile link - visible to all logged in users */}
              <div className="nav-item">
                <NavLink to="/userpage" className={({isActive}) => (isActive ? 'active' : '')}>
                  Profile
                </NavLink>
              </div>
            </>
          )}
        </div>

        {/* User status section */}
        <div className="user-section">
          {loggedInUser ? (
            <div className="user-info">
              <span className="user-name">
                {loggedInUser.UserFirstName} ({loggedInUser.Role})
              </span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-item sign-in">
              <NavLink to="/signin" className={({isActive}) => (isActive ? 'active' : '')}>
                Sign In
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
