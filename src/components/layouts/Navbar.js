import {NavLink} from 'react-router-dom'
import {useContext} from 'react'
import UserContext from '../../context/UserContext'
import './Navbar.scss'

function Navbar() {
  // Properties -------------------------------------------------------------------------------------------------

  // Hooks ------------------------------------------------------------------------------------------------------

  // Context ----------------------------------------------------------------------------------------------------
  const {loggedInUser, setLoggedInUser} = useContext(UserContext)

  // Methods ----------------------------------------------------------------------------------------------------
  const getLinkStyle = ({isActive}) => (isActive ? 'nav.Selected' : null)

  const handleLogout = () => {
    setLoggedInUser(null)
  }

  // View -------------------------------------------------------------------------------------------------------
  return (
    <nav>
      {/* Home link - visible to all (even without login) */}
      <div className="navItem">
        <NavLink to="/" className={getLinkStyle}>
          Home
        </NavLink>
      </div>

      {/* Links only visible when logged in */}
      {loggedInUser && (
        <>
          {/* Projects link - only visible to Admins */}
          {loggedInUser.Role === 'Admin' && (
            <div className="navItem">
              <NavLink to="/projects" className={getLinkStyle}>
                Projects
              </NavLink>
            </div>
          )}

          {/* My Projects link - visible to all logged in users */}
          <div className="navItem">
            <NavLink to="/myprojects" className={getLinkStyle}>
              My Projects
            </NavLink>
          </div>

          {/* Components link - only visible to Admins */}
          {loggedInUser.Role === 'Admin' && (
            <div className="navItem">
              <NavLink to="/components" className={getLinkStyle}>
                Components
              </NavLink>
            </div>
          )}

          {/* Profile link - visible to all logged in users */}
          <div className="navItem">
            <NavLink to="/userpage" className={getLinkStyle}>
              Profile
            </NavLink>
          </div>
        </>
      )}

      {/* Login/logout section */}
      <div className="navItem signIn">
        {loggedInUser ? (
          <div className="userInfo">
            <span className="userName">
              {loggedInUser.UserFirstName} ({loggedInUser.Role})
            </span>
            <button onClick={handleLogout} className="logoutButton">
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/signin" className={getLinkStyle}>
            SignIn
          </NavLink>
        )}
      </div>
    </nav>
  )
}

export default Navbar
