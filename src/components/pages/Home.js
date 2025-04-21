import {useContext} from 'react'
import {Link} from 'react-router-dom'
import UserContext from '../../context/UserContext'
import './Home.scss'

function Home() {
  // Context
  const {loggedInUser} = useContext(UserContext)

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome to Sprint Sync</h1>

        {loggedInUser ? (
          <p className="welcome-message">
            Hello, <span className="user-name">{loggedInUser.UserFirstName}</span>! We're glad to
            see you back.
          </p>
        ) : (
          <p className="welcome-message">
            Please <Link to="/signin">sign in</Link> to access your projects and personalized
            features.
          </p>
        )}
      </div>

      <div className="info-section">
        <h2>Project Management Made Simple</h2>
        <p>
          Sprint Sync helps you organize your projects, track progress, and collaborate with your
          team effectively. Our intuitive interface makes it easy to manage sprints, track tasks,
          and keep everyone on the same page.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Track Sprints</h3>
            <p>
              Organize your work into sprints with clear start and end dates. Monitor progress and
              stay on schedule.
            </p>
          </div>

          <div className="feature-card">
            <h3>Team Collaboration</h3>
            <p>
              Work together seamlessly with your team members. Share updates and coordinate
              effectively.
            </p>
          </div>

          <div className="feature-card">
            <h3>Progress Monitoring</h3>
            <p>
              Get real-time insights into your project's progress with detailed reports and
              visualizations.
            </p>
          </div>

          <div className="feature-card">
            <h3>Task Management</h3>
            <p>
              Break down projects into manageable tasks. Assign responsibilities and track
              completion.
            </p>
          </div>
        </div>
      </div>

      {loggedInUser ? (
        <div className="action-section">
          <h2>Get Started</h2>
          <div className="button-group">
            <Link to="/myprojects" className="action-button primary">
              View My Projects
            </Link>
            {loggedInUser.Role === 'Admin' && (
              <Link to="/projects" className="action-button secondary">
                Manage All Projects
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="action-section">
          <h2>Ready to Get Started?</h2>
          <Link to="/signin" className="action-button primary">
            Sign In Now
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home
