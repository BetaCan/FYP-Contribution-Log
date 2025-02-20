import {useState, useEffect, useContext, useCallback} from "react";
import API from "../api/API.js";
import Action from "../UI/Actions.js";
import ToolTipDecorator from "../UI/ToolTipDecorator.js";
import ProjectsPanels from "../entities/projects/ProjectsPanels.js";
import ProjectForm from "../entities/projects/ProjectForm.js";
import JoinProjectForm from "../entities/projects/JoinProjectForm.js";
import UserContext from "../../context/UserContext.js"; // Corrected import path

export default function MyProjects() {
  // Initialisation -------------------------------------------------------------------------------------------------
  const {loggedInUser} = useContext(UserContext); // Get logged in user from context
  const loggedInUserID = loggedInUser?.UserID; // Assuming the user object has an id property
  //const loggedInUserID = 4; // Assuming the user object has an id property

  // State ------------------------------------------------------------------------------------------------------
  const [projects, setProjects] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Loading records...");
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showJoinProjectForm, setShowJoinProjectForm] = useState(false);

  const loadProjects = useCallback(async () => {
    if (loggedInUserID) {
      const getProjectsEndpoint = `/projects/user/${loggedInUserID}`;
      const response = await API.get(getProjectsEndpoint);
      if (response.isSuccess) {
        setProjects(response.result);
      } else {
        setLoadingMessage(response.message);
      }
    }
  }, [loggedInUserID]);

  useEffect(() => {
    loadProjects();
  }, [loggedInUserID, loadProjects]);

  useEffect(() => {
    projects &&
      projects.map((project) => {
        project.ProjectStartDate = new Date(project.ProjectStartDate).toISOString().slice(0, 10);
        project.ProjectEndDate = new Date(project.ProjectEndDate).toISOString().slice(0, 10);
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
    const response = await API.post("/projects", project);
    if (response.isSuccess) {
      await loadProjects();
      setShowAddProjectForm(false);
    } else {
      console.error("Failed to add project:", response.message);
    }
  };

  const handleSubmitJoin = async (joinProject) => {
    const response = await API.post("/userprojects", {
      ...joinProject,
      UserID: loggedInUserID,
    });
    if (response.isSuccess) {
      await loadProjects();
      setShowJoinProjectForm(false);
    } else {
      console.error("Failed to join project:", response.message);
    }
  };

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
        <ProjectsPanels projects={projects} reloadProjects={loadProjects} />
      )}
    </section>
  );
}
