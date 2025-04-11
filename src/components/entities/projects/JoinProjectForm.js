import {useContext} from 'react'
import Form from '../../UI/Form.js'
import useLoad from '../../api/useLoad.js'
import UserContext from '../../../context/UserContext.js'

const emptyJoinProject = {
  UserProject_UserID: '',
  UserProject_ProjectID: '',
  UserProject_ProjectRoleID: '',
}

export default function JoinProjectForm({
  onCancel,
  onSubmit,
  initialJoinProject = emptyJoinProject,
}) {
  // Get logged in user from context
  const {loggedInUser} = useContext(UserContext)
  const loggedInUserID = loggedInUser?.UserID

  // Initialisation -------------------------------------------------------------------------------------------------
  const validation = {
    isValid: {
      UserProject_ProjectID: (id) => id !== '',
      UserProject_UserID: (id) => id !== '',
      UserProject_ProjectRoleID: (id) => id !== '',
    },
    errorMessage: {
      UserProject_ProjectID: 'Invalid Project ID - must not be empty',
      UserProject_UserID: 'Invalid User ID - must not be empty',
      UserProject_ProjectRoleID: 'Invalid Role ID - must not be empty',
    },
  }
  const conformance = {
    js2html: {
      UserProject_ProjectID: (id) => (id === null ? '' : id),
      UserProject_UserID: (id) => (id === null ? '' : id),
      UserProject_ProjectRoleID: (id) => (id === null ? '' : id),
    },
    html2js: {
      UserProject_ProjectID: (id) => (id === '' ? null : id),
      UserProject_UserID: (id) => (id === '' ? null : id),
      UserProject_ProjectRoleID: (id) => (id === '' ? null : id),
    },
  }

  // State ------------------------------------------------------------------------------------------------------
  // Set UserProject_UserID from loggedInUser
  const joinProjectWithUser = {
    ...initialJoinProject,
    UserProject_UserID: loggedInUserID,
  }

  const [joinProject, errors, handleChange, handleSubmit] = Form.useForm(
    joinProjectWithUser,
    conformance,
    validation,
    onCancel,
    onSubmit
  )

  // Load projects and roles from API
  const [projects, , loadingProjectsMessage] = useLoad('/projects')
  const [projectRoles, , loadingProjectRolesMessage] = useLoad('/projectroles')

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
              <option key={project.ProjectID} value={project.ProjectID}>
                {project.ProjectName}
              </option>
            ))}
          </select>
        )}
      </Form.Item>

      <Form.Item
        label="User ID"
        htmlFor="UserProject_UserID"
        advice="Your User ID"
        error={errors.UserProject_UserID}
      >
        <input
          type="text"
          name="UserProject_UserID"
          value={joinProject.UserProject_UserID}
          readOnly
        />
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
            {projectRoles.map((role) => (
              <option key={role.ProjectRoleID} value={role.ProjectRoleID}>
                {role.ProjectRoleName}
              </option>
            ))}
          </select>
        )}
      </Form.Item>
    </Form>
  )
}
