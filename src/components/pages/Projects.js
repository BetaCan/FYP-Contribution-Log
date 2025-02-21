import {useState, useEffect} from "react";
import API from "../api/API.js";
// import { ActionTray, ActionAdd } from "../UI/Actions.js";
// import ToolTipDecorator from "../UI/ToolTipDecorator.js";
import UPProjectsPanels from "../entities/projects/UPProjectsPanels.js";
// import ProjectForm from "../entities/projects/ProjectForm.js";

export default function Projects() {
  // State ------------------------------------------------------------------------------------------------------
  const [projects, setProjects] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Loading records...");

  // Methods ----------------------------------------------------------------------------------------------------
  const getProjects = async () => {
    const response = await API.get("/projects");
    response.isSuccess ? setProjects(response.result) : setLoadingMessage(response.message);
  };

  useEffect(() => {
    getProjects();
  }, []);

  // View -------------------------------------------------------------------------------------------------------
  return (
    <section>
      <h1>Projects</h1>

      {!projects ? (
        <p>{loadingMessage}</p>
      ) : projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <UPProjectsPanels projects={projects} />
      )}
    </section>
  );
}
