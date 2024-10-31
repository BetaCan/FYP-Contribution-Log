import { NavLink } from 'react-router-dom'
import './Navbar.css'

function XYZ() {
    // Properties -------------------------------------------------------------------------------------------------

    // Hooks ------------------------------------------------------------------------------------------------------

    // Context ----------------------------------------------------------------------------------------------------

    // Methods ----------------------------------------------------------------------------------------------------
    const getLinkStyle = ({ isActive }) => (isActive ? 'nav.Selected' : null)
    // View -------------------------------------------------------------------------------------------------------
    return (
        <nav>
            <div className='navItem'>
                <NavLink to='/' className={getLinkStyle}>
                    Home
                </NavLink>
            </div>
            {/* <div className='navItem'>
                <NavLink to='/contact' className={getLinkStyle}>
                    Contact Us
                </NavLink>
            </div> */}
            <div className='navItem'>
                <NavLink to='/myprojects' className={getLinkStyle}>
                    My Projects
                </NavLink>
            </div>
            <div className='navItem signIn'>
                <NavLink to='/signin' className={getLinkStyle}>
                    SignIn
                </NavLink>
            </div>
        </nav>
    )
}

export default XYZ
