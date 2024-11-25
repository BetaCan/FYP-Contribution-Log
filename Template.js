function XYZ() {
    // Initialisation -------------------------------------------------------------------------------------------------

    // State ------------------------------------------------------------------------------------------------------

    // Handlers ----------------------------------------------------------------------------------------------------

    // View -------------------------------------------------------------------------------------------------------

    return (
        <stuff /> 
    )
}

export default XYZ


function XYZ() {
    // Properties -------------------------------------------------------------------------------------------------

    // Hooks ------------------------------------------------------------------------------------------------------

    // Context ----------------------------------------------------------------------------------------------------

    // Methods ----------------------------------------------------------------------------------------------------
    
    // View -------------------------------------------------------------------------------------------------------

    return (
        <stuff /> 
    )
}

export default XYZ





/* --------------------------------------------------------------------------------------- */
/* Styling /////////////////////////////////////////////////////////////////////////////// */
/* --------------------------------------------------------------------------------------- */



MY PROJECTS
    // return (
    //     <section>
    //         <h1>My Projects</h1>
    //         {!projects ? (
    //             <p>{loadingMessage}</p>
    //         ) : projects.length === 0 ? (
    //             <p>No projects found</p>
    //         ) : (
    //             <p>Projects found</p>
    //             // <ProjectsPanels projects={projects} />
    //         )}
    //     </section>
    // )



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
        const response = await API.post(`/projects`, project)
        if (response.isSuccess) {
            await loadProjects() // Refresh the project list
            return true
        }
        return false
    }

    const handleSubmitJoin = async (joinProject) => {
        const response = await API.post(`/userprojects`, {
            ...joinProject,
            UserProjectUserID: loggedInUserID,
        })
        if (response.isSuccess) {
            await loadProjects() // Refresh the project list
            return true
        }
        return false
    }

