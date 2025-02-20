import {useContext} from "react";
import Form from "../../UI/Form.js";
import useLoad from "../../api/useLoad.js";
import UserContext from "../../../context/UserContext.js"; // Corrected import path

const emptyJoinProject = {
  UserProject_UserID: "",
  UserProject_ProjectID: "",
  UserProject_ProjectRoleID: "",
};

export default function JoinProjectForm({
  onCancel,
  onSubmit,
  initialJoinProject = emptyJoinProject,
}) {
  // Initialisation -------------------------------------------------------------------------------------------------
  const {loggedInUser} = useContext(UserContext); // Get logged in user from context
  const loggedInUserID = loggedInUser?.UserID; // Assuming the user object has an id property

  const validation = {
    isValid: {
      UserProject_ProjectID: (id) => id !== "",
      UserProject_UserID: (id) => id !== "",
      UserProject_ProjectRoleID: (id) => id !== "",
    },
    errorMessage: {
      UserProject_ProjectID: "Invalid Project ID - must not be empty",
      UserProject_UserID: "Invalid User ID - must not be empty",
      UserProject_ProjectRoleID: "Invalid Role ID - must not be empty",
    },
  };
  const conformance = {
    js2html: {
      UserProject_ProjectID: (id) => (id === null ? "" : id),
      UserProject_UserID: (id) => (id === null ? "" : id),
      UserProject_ProjectRoleID: (id) => (id === null ? "" : id),
    },
    html2js: {
      UserProject_ProjectID: (id) => (id === "" ? null : id),
      UserProject_UserID: (id) => (id === "" ? null : id),
      UserProject_ProjectRoleID: (id) => (id === "" ? null : id),
    },
  };

  // State ------------------------------------------------------------------------------------------------------
  const [joinProject, errors, handleChange, handleSubmit] = Form.useForm(
    {...initialJoinProject, UserID: loggedInUserID}, // Set UserID from loggedInUser
    conformance,
    validation,
    onCancel,
    onSubmit
  );
  const [projects, , loadingProjectsMessage] = useLoad("/projects");
  const [projectRoles, , loadingProjectRolesMessage] = useLoad("/projectroles");

  // View -------------------------------------------------------------------------------------------------------
  return (
    <Form onSubmit={handleSubmit} onCancel={onCancel}>
      <Form.Item
        label="Project"
        htmlFor="UserProject_ProjectID"
        advice="Please select the project you want to join"
        error={errors.UserProject_ProjectID}
      >
        {!projects ? (
          <p>{loadingProjectsMessage}</p>
        ) : projects.length === 0 ? (
          <p>No records found</p>
        ) : (
          <select
            name="UserProject_ProjectID"
            value={joinProject.UserProject_ProjectID}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose a project
            </option>
            {projects.map((project) => (
              <option key={project.UserProject_ProjectID} value={project.UserProject_ProjectID}>
                {project.ProjectName}
              </option>
            ))}
          </select>
        )}
      </Form.Item>

      <Form.Item label="User ID" htmlFor="UserID" advice="Your User ID" error={errors.UserID}>
        <input type="text" name="UserID" value={loggedInUserID} readOnly />
      </Form.Item>

      <Form.Item
        label="Role"
        htmlFor="UserProject_ProjectRoleID"
        advice="Choose your role in the project"
        error={errors.UserProject_ProjectRoleID}
      >
        {!projectRoles ? (
          <p>{loadingProjectRolesMessage}</p>
        ) : projectRoles.length === 0 ? (
          <p>No records found</p>
        ) : (
          <select
            name="UserProject_ProjectRoleID"
            value={joinProject.UserProject_ProjectRoleID}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose a role
            </option>
            {projectRoles.map((roles) => (
              <option key={roles.UserProject_ProjectRoleID} value={roles.UserProject_ProjectRoleID}>
                {roles.ProjectRoleName}
              </option>
            ))}
          </select>
        )}
      </Form.Item>
    </Form>
  );
}
