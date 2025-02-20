import API from "../../api/API.js";
import Modal from "../../UI/Modal.js";
import Panel from "../../UI/Panel.js";
import ObjectTable from "../../UI/ObjectTable.js";
import Action from "../../UI/Actions.js";
import ToolTipDecorator from "../../UI/ToolTipDecorator.js";
import ProjectForm from "./ProjectForm.js";
import {useState} from "react";

export default function ProjectsPanels({projects, reloadProjects}) {
  const putProjectsEndpoint = `/project`;
  const deleteProjectsEndpoint = `/project`;

  const [selectedForm, setSelectedForm] = useState(0);
  const {handleModal} = Modal.useModal();

  const handleModify = (id) => {
    setSelectedForm(id === selectedForm ? 0 : id);
  };

  const handleDelete = async (id) => {
    dismissModal();
    const response = await API.delete(`${deleteProjectsEndpoint}/${id}`);
    response.isSuccess ? reloadProjects() : showErrorModal("Delete failed", response.message);
  };

  const handleSubmit = async (project) => {
    const response = await API.put(`${putProjectsEndpoint}/${project.ProjectID}`, project);
    if (response.isSuccess) {
      setSelectedForm(0);
      reloadProjects();
    } else {
      console.error("Failed to update project:", response.message);
    }
  };

  const handleCancel = () => {
    setSelectedForm(0);
  };

  const showDeleteModal = (id) =>
    handleModal({
      show: true,
      title: "Alerts!",
      content: <p>Are you sure you want to delete this record project?</p>,
      actions: [
        <Action.Yes showText onClick={() => handleDelete(id)} />,
        <Action.No showText onClick={dismissModal} />,
      ],
    });

  const showErrorModal = (title, message) =>
    handleModal({
      show: true,
      title: title,
      content: <p>{message}</p>,
      actions: [<Action.Close showText onClick={dismissModal} />],
    });

  const dismissModal = () => handleModal(false);

  const displayableattributes = [
    // {key: "ProjectID", label: "ID"},
    {key: "ProjectStartDate", label: "Start Date"},
    {key: "ProjectEndDate", label: "End Date"},
    {key: "ProjectStatusName", label: "Status"},
    {key: "ProjectOverseerName", label: "Overseer"},
    {key: "ProjectDescription", label: "Description"},
    // {key: "Project_ProjectStatusID", label: "Status"}, add this back in when we have the status
  ];

  return (
    <div>
      <Panel.Container>
        <h4>My Projects</h4>
        {projects.map((project) => (
          <Panel key={project.ProjectID} title={`${project.ProjectName}`} level={1}>
            <Panel.Static level={1}>
              <ObjectTable object={project} attributes={displayableattributes} />
            </Panel.Static>

            <Action.Tray>
              <ToolTipDecorator message={`Modify ${project.ProjectName} Project`}>
                <Action.Modify
                  showText
                  onClick={() => handleModify(project.ProjectID)}
                  buttonText="Modify Project"
                />
              </ToolTipDecorator>
              <ToolTipDecorator message={`Delete ${project.ProjectName} Project`}>
                <Action.Delete
                  showText
                  onClick={() => showDeleteModal(project.ProjectID)}
                  buttonText="Delete Project"
                />
              </ToolTipDecorator>
            </Action.Tray>

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
    </div>
  );
}
