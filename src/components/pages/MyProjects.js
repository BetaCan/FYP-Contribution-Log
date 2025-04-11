import {useState, useEffect, useContext, useCallback} from 'react'
import API from '../api/API.js'
import Action from '../UI/Actions.js'
import ToolTipDecorator from '../UI/ToolTipDecorator.js'
import ProjectsPanels from '../entities/projects/ProjectsPanels.js'
import ProjectForm from '../entities/projects/ProjectForm.js'
import JoinProjectForm from '../entities/projects/JoinProjectForm.js'
import UserContext from '../../context/UserContext.js'

export default function MyProjects() {
  // Initialisation -------------------------------------------------------------------------------------------------
  const {loggedInUser} = useContext(UserContext)
  const loggedInUserID = loggedInUser?.UserID

  // State ------------------------------------------------------------------------------------------------------
  const [projects, setProjects] = useState(null)
  const [loadingMessage, setLoadingMessage] = useState('Loading records...')
  const [showAddProjectForm, setShowAddProjectForm] = useState(false)
  const [showJoinProjectForm, setShowJoinProjectForm] = useState(false)

  const loadProjects = useCallback(async () => {
    if (loggedInUserID) {
      const getProjectsEndpoint = `/projects/user/${loggedInUserID}`
      const response = await API.get(getProjectsEndpoint)
      if (response.isSuccess) {
        setProjects(response.result)
      } else {
        setLoadingMessage(response.message)
      }
    }
  }, [loggedInUserID])

  useEffect(() => {
    loadProjects()
  }, [loggedInUserID, loadProjects])

  useEffect(() => {
    if (projects) {
      projects.forEach((project) => {
        if (project.ProjectStartDate) {
          project.ProjectStartDate = new Date(project.ProjectStartDate).toISOString().slice(0, 10)
        }
        if (project.ProjectEndDate) {
          project.ProjectEndDate = new Date(project.ProjectEndDate).toISOString().slice(0, 10)
        }
      })
    }
  }, [projects])

  // Methods ----------------------------------------------------------------------------------------------------
  const toggleAddForm = () => {
    setShowAddProjectForm(!showAddProjectForm)
    setShowJoinProjectForm(false)
  }

  const toggleJoinForm = () => {
    setShowJoinProjectForm(!showJoinProjectForm)
    setShowAddProjectForm(false)
  }

  const CancelAddForm = () => setShowAddProjectForm(false)
  const CancelJoinForm = () => setShowJoinProjectForm(false)

  // This handler is now simplified since the ProjectForm handles both project creation
  // and user assignment internally
  const handleSubmitAdd = async (project) => {
    await loadProjects() // Simply reload projects after the form completes its work
    setShowAddProjectForm(false)
  }

  const handleSubmitJoin = async (joinProject) => {
    const response = await API.post('/userprojects', joinProject)
    if (response.isSuccess) {
      await loadProjects()
      setShowJoinProjectForm(false)
    } else {
      console.error('Failed to join project:', response.message)
    }
  }

  return (
    <section>
      <h1>My Projects</h1>

      <Action.Tray>
        <ToolTipDecorator message="Add new Project">
          <Action.Add showText onClick={toggleAddForm} buttonText="Add new Project" />
        </ToolTipDecorator>
        <ToolTipDecorator message="Join a Project">
          <Action.Add showText onClick={toggleJoinForm} buttonText="Join a Project" />
        </ToolTipDecorator>
      </Action.Tray>

      {showAddProjectForm && <ProjectForm onCancel={CancelAddForm} onSubmit={handleSubmitAdd} />}
      {showJoinProjectForm && (
        <JoinProjectForm onCancel={CancelJoinForm} onSubmit={handleSubmitJoin} />
      )}

      {!projects ? (
        <p>{loadingMessage}</p>
      ) : projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <ProjectsPanels projects={projects} reloadProjects={loadProjects} />
      )}
    </section>
  )
}
