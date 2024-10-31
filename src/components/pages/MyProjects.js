import { useState, useEffect } from 'react'
import API from '../api/API.js'
import Card from '../UI/Card.js'

export default function MyProjects() {
    // Initialisation -------------------------------------------------------------------------------------------------
    const loggedInUserID = 9
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
                <div className='project-cards'>
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            title={project.name}
                            description={project.description}
                            {...project}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
