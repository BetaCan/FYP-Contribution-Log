import Panel from '../../UI/Panel.js'
import ObjectTable from '../../UI/ObjectTable.js'

export default function ProjectPanels({ projects }) {
    // Intialisation  -------------------------------------------------------------------------------------------------

    // State ------------------------------------------------------------------------------------------------------

    // Context ----------------------------------------------------------------------------------------------------

    // Methods ----------------------------------------------------------------------------------------------------

    // View -------------------------------------------------------------------------------------------------------
    const displayableattributes = [
        { key: 'ProjectRoleName', label: 'Role' },
        { key: 'ProjectDescription', label: 'Project Description' },
        { key: 'ProjectStartDate', label: 'Start Date' },
        { key: 'ProjectEndDate', label: 'End Date' },
        { key: 'ProjectStatus', label: 'Status' },
    ]

    return (
        <Panel.Container>
            {projects.map((project) => (
                <Panel
                    key={project.ProjectID}
                    title={`${project.ProjectID} ${project.ProjectName}`}
                    level={4}
                >
                    <Panel.Static level={3}>
                        <ObjectTable object={project} attributes={displayableattributes} />
                    </Panel.Static>
                </Panel>
            ))}
        </Panel.Container>
    )
}
