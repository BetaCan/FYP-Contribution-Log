import { useState, useEffect } from 'react'
import API from '../api/API.js'
import { ActionTray, ActionAdd } from '../UI/Actions.js'
import ToolTipDecorator from '../UI/ToolTipDecorator.js'
import ProjectsPanels from '../entities/projects/ProjectsPanels.js'
import ProjectForm from '../entities/projects/ProjectForm.js'

export default function MyProjects() {
    // Initialisation -------------------------------------------------------------------------------------------------
    const loggedInUserID = 9

    // State ------------------------------------------------------------------------------------------------------
    const [projects, setProjects] = useState(null)
    const [loadingMessage, setLoadingMessage] = useState('Loading records...')

    const [showAddProjectForm, setShowAddProjectForm] = useState(false)
    const [showJoinProjectForm, setShowJoinProjectForm] = useState(false)

    // Methods ----------------------------------------------------------------------------------------------------
    const getProjects = async () => {
        const response = await API.get(`/projects/user/${loggedInUserID}`)
        response.isSuccess ? setProjects(response.result) : setLoadingMessage(response.message)
    }

    useEffect(() => {
        getProjects()
    }, [])

    const handleAdd = () => {
        setShowAddProjectForm(true)
    }

    const handleJoin = () => {
        setShowJoinProjectForm(true)
    }

    const handleDismissAdd = () => {
        setShowAddProjectForm(false)
    }

    const handleDismissJoin = () => {
        setShowJoinProjectForm(false)
    }

    const handleSubmit = async (project) => {
        const response = await API.post(`/projects/user/${loggedInUserID}`, project)
        if (response.isSuccess) {
            await getProjects() // Refresh the project list
            return true
        }
        return false
    }

    // View -------------------------------------------------------------------------------------------------------
    return (
        <section>
            <h1>My Projects</h1>

            <ActionTray>
                <ToolTipDecorator message='Add new Project'>
                    <ActionAdd showText onClick={handleAdd} buttonText='Add new Project' />
                </ToolTipDecorator>
                <ToolTipDecorator message='Join a Project'>
                    <ActionAdd showText onClick={handleJoin} buttonText='Join a Project' />
                </ToolTipDecorator>
            </ActionTray>

            {showAddProjectForm && (
                <ProjectForm onDismiss={handleDismissAdd} onSubmit={handleSubmit} />
            )}
            {showJoinProjectForm && <p>{'<JoinProjectForm/>'} </p>}

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
