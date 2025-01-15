import { useState, useEffect } from "react";
import API from "../api/API.js";
import Action from "../UI/Actions.js";
import ToolTipDecorator from "../UI/ToolTipDecorator.js";
import ProjectsPanels from "../entities/projects/ProjectsPanels.js";
import ProjectForm from "../entities/projects/ProjectForm.js";
import JoinProjectForm from "../entities/projects/JoinProjectForm.js";
import useLoad from "../api/useLoad.js";

export default function MyProjects() {
  // Initialisation -------------------------------------------------------------------------------------------------
  const loggedInUserID = 4;
  const getProjectsEndpoint = `/projects/${loggedInUserID}`;
  const postProjectEndpoint = `/projects`;
  const postUserProjectEndpoint = `/userprojects`;

  // State ------------------------------------------------------------------------------------------------------
  const [projects, , loadingMessage, loadProjects] = useLoad(getProjectsEndpoint);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showJoinProjectForm, setShowJoinProjectForm] = useState(false);
  useEffect(() => {
    projects &&
      projects.map((project) => {
        project.ProjectStartDate = new Date(project.ProjectStartDate);
        project.ProjectEndDate = new Date(project.ProjectEndDate);
        return project;
      });
  }, [projects]);

  // Methods ----------------------------------------------------------------------------------------------------
  const toggleAddForm = () => {
    setShowAddProjectForm(!showAddProjectForm);
    setShowJoinProjectForm(false);
  };
  const toggleJoinForm = () => {
    setShowJoinProjectForm(!showJoinProjectForm);
    setShowAddProjectForm(false);
  };
  const CancelAddForm = () => setShowAddProjectForm(false);
  const CancelJoinForm = () => setShowJoinProjectForm(false);

  const handleSubmitAdd = async (project) => {
    const response = await API.post(postProjectEndpoint, project);
    if (response.isSuccess) {
      await loadProjects(); // Refresh the project list
      setShowAddProjectForm(false); // Close the form after submission
    } else {
      console.error("Failed to add project:", response.message);
    }
  };

  const handleSubmitJoin = async (joinProject) => {
    const response = await API.post(postUserProjectEndpoint, {
      ...joinProject,
      UserProjectUserID: loggedInUserID,
    });
    if (response.isSuccess) {
      await loadProjects(); // Refresh the project list
      setShowJoinProjectForm(false); // Close the form after submission
    } else {
      console.error("Failed to join project:", response.message);
    }
  };

  // View -------------------------------------------------------------------------------------------------------
  return (
    <section>
      <h1>My Projects</h1>

      <Action.Tray>
        <ToolTipDecorator message="Add new Project">
          <Action.Add showText onClick={toggleAddForm} buttonText="Add new Project" />
        </ToolTipDecorator>
        <ToolTipDecorator message="Join a Project">
          <Action.Add showText onClick={toggleJoinForm} buttonText="Join a Project" />
        </ToolTipDecorator>
      </Action.Tray>

      {showAddProjectForm && <ProjectForm onCancel={CancelAddForm} onSubmit={handleSubmitAdd} />}
      {showJoinProjectForm && (
        <JoinProjectForm onCancel={CancelJoinForm} onSubmit={handleSubmitJoin} />
      )}

      {!projects ? (
        <p>{loadingMessage}</p>
      ) : projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <ProjectsPanels
          projects={projects}
          reloadProjects={() => loadProjects(getProjectsEndpoint)}
        />
      )}
    </section>
  );
}
