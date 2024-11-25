import { useState, useEffect } from 'react'
import API from '../api/API.js'
import { ActionTray, ActionAdd } from '../UI/Actions.js'
import ToolTipDecorator from '../UI/ToolTipDecorator.js'
import ProjectsPanels from '../entities/projects/ProjectsPanels.js'
import ProjectForm from '../entities/projects/ProjectForm.js'
import JoinProjectForm from '../entities/projects/JoinProjectForm.js'
import useLoad from '../api/useLoad.js'

export default function MyProjects() {
    // Initialisation -------------------------------------------------------------------------------------------------
    const loggedInUserID = 4
    const postProjectEndpoint = `/projects`
    const postUserProjectEndpoint = `/userprojects`
    const endpoint = `/projects/user/${loggedInUserID}`

    // State ------------------------------------------------------------------------------------------------------
    const [projects, , loadingMessage, loadProjects] = useLoad(endpoint)
    const [showAddProjectForm, setShowAddProjectForm] = useState(false)
    const [showJoinProjectForm, setShowJoinProjectForm] = useState(false)

    // Methods ----------------------------------------------------------------------------------------------------
    const handleAdd = () => {
        setShowAddProjectForm(true)
        if (showJoinProjectForm) setShowJoinProjectForm(false)
    }

    const handleJoin = () => {
        setShowJoinProjectForm(true)
        if (showAddProjectForm) setShowAddProjectForm(false)
    }

    const handleDismissAdd = () => {
        setShowAddProjectForm(false)
    }

    const handleDismissJoin = () => {
        setShowJoinProjectForm(false)
    }

    const handleSubmitAdd = async (project) => {
        const response = await API.post(postProjectEndpoint, project)
        if (response.isSuccess) {
            await loadProjects() // Refresh the project list
            return true
        }
        return false
    }

    const handleSubmitJoin = async (joinProject) => {
        const response = await API.post(postUserProjectEndpoint, {
            ...joinProject,
            UserProjectUserID: loggedInUserID,
        })
        if (response.isSuccess) {
            await loadProjects() // Refresh the project list
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
                <ProjectForm onCancel={handleDismissAdd} onSubmit={handleSubmitAdd} />
            )}
            {showJoinProjectForm && (
                <JoinProjectForm onCancel={handleDismissJoin} onSubmit={handleSubmitJoin} />
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
