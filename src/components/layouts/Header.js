import {Link} from 'react-router-dom'
import {useContext} from 'react'
import UserContext from '../../context/UserContext'
import './Header.scss'

function Header() {
  // Context
  const {loggedInUser} = useContext(UserContext)

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          <Link to="/">
            <img
              src="https://img.icons8.com/?size=100&id=40610&format=png&color=ffffff"
              alt="Sprint Sync Logo"
              className="logo-image"
            />
          </Link>
          <Link to="/" className="logo-text">
            <h1>Sprint Sync</h1>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
