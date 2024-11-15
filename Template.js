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