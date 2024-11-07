import { useState, useEffect } from 'react'
import API from '../api/API.js'
import ProjectsPanels from '../entities/projects/ProjectsPanels.js'

export default function MyProjects() {
    // Initialisation -------------------------------------------------------------------------------------------------
    const loggedInUserID = 4
    const endpoint = `/projects/user/${loggedInUserID}`

    // State ------------------------------------------------------------------------------------------------------
    const [projects, setProjects] = useState(null)
    const [loadingMessage, setLoadingMessage] = useState('Loading records...')

    // Context ----------------------------------------------------------------------------------------------------

    // Methods ----------------------------------------------------------------------------------------------------
    const apiCall = async (endpoint) => {
        const response = await API.get(endpoint)
        response.isSuccess ? setProjects(response.result) : setLoadingMessage(response.message)
    }
    useEffect(() => {
        apiCall(endpoint)
    }, [endpoint])

    // View -------------------------------------------------------------------------------------------------------

    return (
        <section>
            <h1>My Projects</h1>
            {!projects ? (
                <p>{loadingMessage}</p>
            ) : projects.length === 0 ? (
                <p>No projects found</p>
            ) : (
                <>
                    <ProjectsPanels projects={projects} />
                </>
            )}
        </section>
    )
}
