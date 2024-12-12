import Panel from "../../UI/Panel.js"
import ObjectTable from "../../UI/ObjectTable.js"

export default function ProjectPanels({ projects }) {
  // Initialisation  -------------------------------------------------------------------------------------------------

  // State ------------------------------------------------------------------------------------------------------

  // Context ----------------------------------------------------------------------------------------------------

  // Methods ----------------------------------------------------------------------------------------------------

  // View -------------------------------------------------------------------------------------------------------
  const displayableattributes = [
    { key: "ProjectID", label: "ID" },
    { key: "UserprojectRole", label: "Role" },
    { key: "ProjectDescription", label: "Description" },
  ]

  const activeProjects = projects.filter(
    (project) => project.ProjectStatus === "Active"
  )
  const inProgressProjects = projects.filter(
    (project) => project.ProjectStatus === "In Progress"
  )
  const completedProjects = projects.filter(
    (project) => project.ProjectStatus === "Completed"
  )

  return (
    <div>
      <Panel.Container>
        <h4>Active Projects</h4>
        {activeProjects.map((project) => (
          <Panel
            key={project.ProjectID}
            title={`${project.ProjectName}`}
            level={1}
          >
            <Panel.Static level={1}>
              <ObjectTable
                object={project}
                attributes={displayableattributes}
              />
            </Panel.Static>
          </Panel>
        ))}
      </Panel.Container>

      <Panel.Container>
        <h4>In Progress Projects</h4>
        {inProgressProjects.map((project) => (
          <Panel
            key={project.ProjectID}
            title={`${project.ProjectName}`}
            level={1}
          >
            <Panel.Static level={1}>
              <ObjectTable
                object={project}
                attributes={displayableattributes}
              />
            </Panel.Static>
          </Panel>
        ))}
      </Panel.Container>

      <Panel.Container>
        <h4>Completed Projects</h4>
        {completedProjects.map((project) => (
          <Panel
            key={project.ProjectID}
            title={`${project.ProjectName}`}
            level={1}
          >
            <Panel.Static level={1}>
              <ObjectTable
                object={project}
                attributes={displayableattributes}
              />
            </Panel.Static>
          </Panel>
        ))}
      </Panel.Container>
    </div>
  )
}
