import { useState } from 'react'

const emptyProject = {
    ProjectName: '',
    ProjectDescription: '',
    ProjectStartDate: '',
    ProjectEndDate: '',
    ProjectStatus: '',
}

export default function ProjectForm({ initialProject = emptyProject }) {
    // Initialisation -------------------------------------------------------------------------------------------------

    // State ------------------------------------------------------------------------------------------------------
    const [project, setProject] = useState(initialProject)

    // Handlers ----------------------------------------------------------------------------------------------------

    // View -------------------------------------------------------------------------------------------------------
    return (
        <form>
            <label htmlFor='ProjectName'>Project Name</label>
            <p>this is the projects name</p>
            <input type='text' name='ProjectName' value={project.ProjectName} />
            <label htmlFor='ProjectDescription'>Project Description</label>
            <input type='text' name='ProjectDescription' value={project.ProjectDescription} />
            <label htmlFor='ProjectStartDate'>Project Start Date</label>
            <input type='date' name='ProjectStartDate' value={project.ProjectStartDate} />
            <label htmlFor='ProjectEndDate'>Project End Date</label>
            <input type='date' name='ProjectEndDate' value={project.ProjectEndDate} />
            <label htmlFor='ProjectStatus'>Project Status</label>
            <p>choose whether the porject is In Progress, Completed, or Active</p>
            <select type='text' name='ProjectStatus' value={project.ProjectStatus}>
                {['In Progress', 'Completed', 'Active'].map((status) => (
                    <option key={status}> {status}</option>
                ))}
            </select>
        </form>
    )
}
