import Panel from '../../UI/Panel.js'
import ObjectTable from '../../UI/ObjectTable.js'

export default function ProjectPanels({ projects }) {
    // Initialisation  -------------------------------------------------------------------------------------------------

    // State ------------------------------------------------------------------------------------------------------

    // Context ----------------------------------------------------------------------------------------------------

    // Methods ----------------------------------------------------------------------------------------------------

    // View -------------------------------------------------------------------------------------------------------
    const displayableattributes = [
        { key: 'UserprojectRole', label: 'Role' },
        { key: 'ProjectDescription', label: 'Description' },
    ]

    return (
        <div>
            <Panel.Container>
                <h4>All Projects</h4>
                {projects.map((project) => (
                    <Panel
                        key={project.ProjectID}
                        title={`${project.ProjectID} ${project.ProjectName}`}
                        level={1}
                    >
                        <Panel.Static level={1}>
                            <ObjectTable object={project} attributes={displayableattributes} />
                        </Panel.Static>
                    </Panel>
                ))}
            </Panel.Container>
        </div>
    )
}
