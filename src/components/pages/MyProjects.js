import { useState, useEffect } from 'react'
import { useAuth } from '../auth/useAuth.js'
import API from '../api/API.js'
import { ActionTray, ActionAdd } from '../UI/Actions.js'
import ToolTipDecorator from '../UI/ToolTipDecorator.js'
import ProjectsPanels from '../entities/projects/ProjectsPanels.js'
import ProjectForm from '../entities/projects/ProjectForm.js'

export default function MyProjects() {
    // Initialisation -------------------------------------------------------------------------------------------------
    const loggedInUserID = 9
    const endpoint = `/projects/user/${loggedInUserID}`

    // State ------------------------------------------------------------------------------------------------------
    const [projects, setProjects] = useState(null)
    const [loadingMessage, setLoadingMessage] = useState('Loading records...')

    const [showAddProjectForm, setShowAddProjectForm] = useState(false)
    const [showJoinProjectForm, setShowJoinProjectForm] = useState(false)

    // Context ----------------------------------------------------------------------------------------------------

    // Methods ----------------------------------------------------------------------------------------------------
    const apiCall = async (endpoint) => {
        const response = await API.get(endpoint)
        response.isSuccess ? setProjects(response.result) : setLoadingMessage(response.message)
    }
    useEffect(() => {
        apiCall(endpoint)
    }, [endpoint])

    const handleAdd = () => {
        setShowAddProjectForm(true)
    }
    const handleJoin = () => {
        setShowJoinProjectForm(true)
    }

    // View -------------------------------------------------------------------------------------------------------

    return (
        <section>
            <h1>My Projects</h1>
            {!projects ? (
                <p>{loadingMessage}</p>
            ) : projects.length === 0 ? (
                <p>No projects found</p>
            ) : (
                <ProjectsPanels projects={projects} />
            )}

            <p>&nbsp;</p>
            <ActionTray>
                <ToolTipDecorator message='Add new Project'>
                    <ActionAdd showText onClick={handleAdd} buttonText='Add new Project' />
                </ToolTipDecorator>
                <ToolTipDecorator message='Join a Project'>
                    <ActionAdd showText onClick={handleJoin} buttonText='Join a Project' />
                </ToolTipDecorator>
            </ActionTray>

            {showAddProjectForm && <ProjectForm />}
            {/* {showJoinProjectForm && <JoinProjectForm />} */}
        </section>
    )
}
