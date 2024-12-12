import API from "../../api/API.js"
import Panel from "../../UI/Panel.js"
import ObjectTable from "../../UI/ObjectTable.js"
import { ActionTray, ActionModify, ActionDelete } from "../../UI/Actions.js"
import ToolTipDecorator from "../../UI/ToolTipDecorator.js"
import ProjectForm from "./ProjectForm.js"
import { useState } from "react"

export default function ProjectPanels({ projects, reloadProjects }) {
  // Initialisation  -------------------------------------------------------------------------------------------------
  const putProjectsEndpoint = `/projects`
  const deleteProjectsEndpoint = `/projects`
  // State ------------------------------------------------------------------------------------------------------
  const [selectedForm, setSelectedForm] = useState(0)

  // Context ----------------------------------------------------------------------------------------------------

  // Methods ----------------------------------------------------------------------------------------------------
  const handleModify = (id) => {
    setSelectedForm(id === selectedForm ? 0 : id)
  }

  const handleDelete = async (id) => {
    const response = await API.delete(`${deleteProjectsEndpoint}/${id}`)
    response.isSuccess && reloadProjects()
  }

  const handleSubmit = async (project) => {
    const response = await API.put(`${putProjectsEndpoint}/${project.ProjectID}`, project)
    if (response.isSuccess) {
      setSelectedForm(0)
      reloadProjects()
    } else {
      console.error("Failed to update project:", response.message)
    }
  }

  const handleCancel = () => {
    setSelectedForm(0)
  }

  // View -------------------------------------------------------------------------------------------------------
  const displayableattributes = [
    { key: "ProjectID", label: "ID" },
    { key: "UserprojectRole", label: "Role" },
    { key: "ProjectDescription", label: "Description" },
  ]

  const activeProjects = projects.filter((project) => project.ProjectStatus === "Active")
  const inProgressProjects = projects.filter((project) => project.ProjectStatus === "In Progress")
  const completedProjects = projects.filter((project) => project.ProjectStatus === "Completed")

  return (
    <div>
      <Panel.Container>
        <h4>Active Projects</h4>
        {activeProjects.map((project) => (
          <Panel key={project.ProjectID} title={`${project.ProjectName}`} level={1}>
            <Panel.Static level={1}>
              <ObjectTable object={project} attributes={displayableattributes} />
            </Panel.Static>

            <ActionTray>
              <ToolTipDecorator message={`Modify ${project.ProjectName} Project`}>
                <ActionModify
                  showText
                  onClick={() => handleModify(project.ProjectID)}
                  buttonText="Modify Project"
                />
              </ToolTipDecorator>
              <ToolTipDecorator message={`Delete ${project.ProjectName} Project`}>
                <ActionDelete
                  showText
                  onClick={() => handleDelete(project.ProjectID)}
                  buttonText="Delete Project"
                />
              </ToolTipDecorator>
            </ActionTray>

            {selectedForm === project.ProjectID && (
              <ProjectForm
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                initialProject={project}
              />
            )}
          </Panel>
        ))}
      </Panel.Container>

      <Panel.Container>
        <h4>In Progress Projects</h4>
        {inProgressProjects.map((project) => (
          <Panel key={project.ProjectID} title={`${project.ProjectName}`} level={1}>
            <Panel.Static level={1}>
              <ObjectTable object={project} attributes={displayableattributes} />
            </Panel.Static>
          </Panel>
        ))}
      </Panel.Container>

      <Panel.Container>
        <h4>Completed Projects</h4>
        {completedProjects.map((project) => (
          <Panel key={project.ProjectID} title={`${project.ProjectName}`} level={1}>
            <Panel.Static level={1}>
              <ObjectTable object={project} attributes={displayableattributes} />
            </Panel.Static>
          </Panel>
        ))}
      </Panel.Container>
    </div>
  )
}
