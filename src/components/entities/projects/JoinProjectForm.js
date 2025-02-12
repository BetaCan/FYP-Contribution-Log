import { useContext } from "react";
import Form from "../../UI/Form.js";
import useLoad from "../../api/useLoad.js";
import UserContext from "../../../context/UserContext.js"; // Corrected import path

const emptyJoinProject = {
  ProjectID: "",
  UserID: "",
  UserProjectRoleID: "",
};

export default function JoinProjectForm({
  onCancel,
  onSubmit,
  initialJoinProject = emptyJoinProject,
}) {
  // Initialisation -------------------------------------------------------------------------------------------------
  const { loggedInUser } = useContext(UserContext); // Get logged in user from context
  const loggedInUserID = loggedInUser?.id; // Assuming the user object has an id property

  const validation = {
    isValid: {
      ProjectID: (id) => id !== "",
      UserID: (id) => id !== "",
      UserProjectRoleID: (id) => id !== "",
    },
    errorMessage: {
      ProjectID: "Invalid Project ID - must not be empty",
      UserID: "Invalid User ID - must not be empty",
      UserProjectRoleID: "Invalid Role ID - must not be empty",
    },
  };
  const conformance = {
    js2html: {
      ProjectID: (id) => (id === null ? "" : id),
      UserID: (id) => (id === null ? "" : id),
      UserProjectRoleID: (id) => (id === null ? "" : id),
    },
    html2js: {
      ProjectID: (id) => (id === "" ? null : id),
      UserID: (id) => (id === "" ? null : id),
      UserProjectRoleID: (id) => (id === "" ? null : id),
    },
  };

  // State ------------------------------------------------------------------------------------------------------
  const [joinProject, errors, handleChange, handleSubmit] = Form.useForm(
    { ...initialJoinProject, UserID: loggedInUserID }, // Set UserID from loggedInUser
    conformance,
    validation,
    onCancel,
    onSubmit
  );
  const [projects, , loadingProjectsMessage] = useLoad("/projects");
  const [userProjectRoles, , loadingUserProjectRolesMessage] = useLoad("/userprojectroles");

  // View -------------------------------------------------------------------------------------------------------
  return (
    <Form onSubmit={handleSubmit} onCancel={onCancel}>
      <Form.Item
        label="Project"
        htmlFor="ProjectID"
        advice="Please select the project you want to join"
        error={errors.ProjectID}
      >
        {!projects ? (
          <p>{loadingProjectsMessage}</p>
        ) : projects.length === 0 ? (
          <p>No records found</p>
        ) : (
          <select name="ProjectID" value={joinProject.ProjectID} onChange={handleChange}>
            <option value="" disabled>
              Choose a project
            </option>
            {projects.map((project) => (
              <option key={project.ProjectID} value={project.ProjectID}>
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
        htmlFor="UserProjectRoleID"
        advice="Choose your role in the project"
        error={errors.UserProjectRoleID}
      >
        {!userProjectRoles ? (
          <p>{loadingUserProjectRolesMessage}</p>
        ) : userProjectRoles.length === 0 ? (
          <p>No records found</p>
        ) : (
          <select
            name="UserProjectRoleID"
            value={joinProject.UserProjectRoleID}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose a role
            </option>
            {userProjectRoles.map((role) => (
              <option key={role.UserProjectRoleID} value={role.UserProjectRoleID}>
                {role.UserProjectRole}
              </option>
            ))}
          </select>
        )}
      </Form.Item>
    </Form>
  );
}
