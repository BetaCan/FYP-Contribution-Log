import UPProjectsPanels from '../entities/projects/UPProjectsPanels.js'

import useLoad from '../api/useLoad.js'

export default function Projects() {
    // Initialisation -------------------------------------------------------------------------------------------------
    const endpoint = '/projects'

    // State ------------------------------------------------------------------------------------------------------
    const [projects, , loadingMessage, loadProjects] = useLoad(endpoint)

    // Methods ----------------------------------------------------------------------------------------------------

    // View -------------------------------------------------------------------------------------------------------
    return (
        <section>
            <h1>Projects</h1>

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
