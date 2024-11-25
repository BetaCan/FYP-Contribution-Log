import { useState, useEffect } from 'react'
import API from '../api/API.js'
import { ActionTray, ActionAdd } from '../UI/Actions.js'
import ToolTipDecorator from '../UI/ToolTipDecorator.js'
import UPProjectsPanels from '../entities/projects/UPProjectsPanels.js'
import ProjectForm from '../entities/projects/ProjectForm.js'
import useLoad from '../api/useLoad.js'

export default function Projects() {
    // Initialisation -------------------------------------------------------------------------------------------------
    const endpoint = '/projects'

    // State ------------------------------------------------------------------------------------------------------
    const [projects, setProjects, loadingMessage, loadProjects] = useLoad(endpoint)

    const [showAddProjectForm, setShowAddProjectForm] = useState(false)
    const [showJoinProjectForm, setShowJoinProjectForm] = useState(false)

    // Methods ----------------------------------------------------------------------------------------------------
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
        const response = await API.post('/projects', project)
        if (response.isSuccess) {
            await loadProjects() // Refresh the project list
            return true
        }
        return false
    }

    // View -------------------------------------------------------------------------------------------------------
    return (
        <section>
            <h1>Projects</h1>

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
                <UPProjectsPanels projects={projects} />
            )}
        </section>
    )
}
