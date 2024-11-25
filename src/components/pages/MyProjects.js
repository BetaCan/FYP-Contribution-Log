import { useState } from 'react'
import API from '../api/API.js'
import { ActionTray, ActionAdd } from '../UI/Actions.js'
import ToolTipDecorator from '../UI/ToolTipDecorator.js'
import ProjectsPanels from '../entities/projects/ProjectsPanels.js'
import ProjectForm from '../entities/projects/ProjectForm.js'
import JoinProjectForm from '../entities/projects/JoinProjectForm.js'
import useLoad from '../api/useLoad.js'

export default function MyProjects() {
    // Initialisation -------------------------------------------------------------------------------------------------
    const loggedInUserID = 9
    const getProjectEndpoint = `/projects/user/${loggedInUserID}`
    const postProjectEndpoint = '/projects'
    const postUserprojectsEndpoint = '/userprojects'

    //const endpoint = `/projects/user/${loggedInUserID}`

    // State ------------------------------------------------------------------------------------------------------
    const [projects, , loadingMessage, loadProjects] = useLoad(getProjectEndpoint)
    const [showAddProjectForm, setShowAddProjectForm] = useState(false)
    const [showJoinProjectForm, setShowJoinProjectForm] = useState(false)

    // Methods ----------------------------------------------------------------------------------------------------

    const toggleAddForm = () => setShowAddProjectForm(!showAddProjectForm)
    const toggleJoinForm = () => setShowJoinProjectForm(!showJoinProjectForm)
    const cancelAddForm = () => setShowAddProjectForm(false)
    const cancelJoinForm = () => setShowJoinProjectForm(false)

    const handleAddSubmit = async (project) => {
        const response = await API.post(postProjectEndpoint, project)
        return response.isSuccess
    }

    const handleJoinSubmit = async (userproject) => {
        const response = await API.post(postUserprojectsEndpoint, userproject)
        return response.isSuccess ? loadProjects(getProjectEndpoint) || true : false
    }

    // View -------------------------------------------------------------------------------------------------------
    return (
        <section>
            <h1>My Projects</h1>
            <ActionTray>
                <ToolTipDecorator message='Add new Project'>
                    <ActionAdd showText onClick={toggleAddForm} buttonText='Add new Project' />
                </ToolTipDecorator>
                <ToolTipDecorator message='Join a Project'>
                    <ActionAdd showText onClick={toggleJoinForm} buttonText='Join a Project' />
                </ToolTipDecorator>
            </ActionTray>

            {showAddProjectForm && (
                <ProjectForm onCancel={cancelAddForm} onSubmit={handleAddSubmit} />
            )}
            {showJoinProjectForm && (
                <JoinProjectForm onCancel={cancelJoinForm} onSubmit={handleJoinSubmit} />
            )}

            {!projects ? (
                <p>{loadingMessage}</p>
            ) : projects.length === 0 ? (
                <p>No projects found</p>
            ) : (
                <ProjectsPanels projects={projects} />
            )}
        </section>
    )
}
