import {useContext} from 'react'
import Form from '../../UI/Form.js'
import UserContext from '../../../context/UserContext.js'
import projectService from '../../utils/ProjectService.js'

const emptyProject = {
  ProjectName: 'Dummy Project',
  ProjectStartDate: new Date('2024-11-15'),
  ProjectEndDate: new Date('2024-12-15'),
  Project_ProjectStatusID: '',
  ProjectDescription: 'ipsum dolor sit amet, consectetur adipiscing elit',
  Project_ProjectOverseerID: '',
}

export default function ProjectForm({onCancel, onSubmit, initialProject = emptyProject}) {
  // Get the logged in user context
  const {loggedInUser} = useContext(UserContext)
  const loggedInUserID = loggedInUser?.UserID

  // Initialisation -------------------------------------------------------------------------------------------------
  const validation = {
    isValid: {
      ProjectName: (name) => name.length > 5,
      ProjectStartDate: (date) => !isNaN(new Date(date).getTime()),
      ProjectEndDate: (date) => !isNaN(new Date(date).getTime()),
      Project_ProjectStatusID: (id) => ['1', '2', '3'].includes(id),
      ProjectDescription: (description) => description.length > 20,
      Project_ProjectOverseerID: (id) => id !== '',
    },
    errorMessage: {
      ProjectName: 'Invalid name - must be at least 5 characters',
      ProjectDescription: 'Invalid description - must be at least 20 characters',
      ProjectStartDate: 'Invalid start date - must be a valid date',
      ProjectEndDate: 'Invalid end date - must be a valid date',
      Project_ProjectStatusID: "Invalid status - must be 'In Progress', 'Completed', or 'Active'",
      Project_ProjectOverseerID: 'Invalid overseer ID - must not be empty',
    },
  }

  const conformance = {
    js2html: {
      ProjectName: (name) => name,
      ProjectStartDate: (date) => date.toISOString().slice(0, 10),
      ProjectEndDate: (date) => date.toISOString().slice(0, 10),
      Project_ProjectStatusID: (id) => (id === null ? '' : id),
      ProjectDescription: (description) => description,
      Project_ProjectOverseerID: (id) => (id === null ? '' : id),
    },
    html2js: {
      ProjectName: (name) => name,
      ProjectStartDate: (date) => new Date(date),
      ProjectEndDate: (date) => new Date(date),
      Project_ProjectStatusID: (id) => (id === '' ? null : id),
      ProjectDescription: (description) => description,
      Project_ProjectOverseerID: (id) => (id === '' ? null : id),
    },
  }

  // State ------------------------------------------------------------------------------------------------------
  // Merge the initialProject with the logged in user ID as the overseer
  const projectWithOverseer = {
    ...initialProject,
    Project_ProjectOverseerID: loggedInUserID,
  }

  // Simplified submit handler that uses the project service
  const handleFormSubmit = async (formData) => {
    // Use the service to handle both project creation and user assignment
    const result = await projectService.createProjectWithAssignment(formData, loggedInUserID)

    if (result.success) {
      onSubmit(result.project)
      return true // Allow form to close
    } else {
      alert(result.error)
      return false // Keep form open
    }
  }

  const [project, errors, handleChange, handleSubmit] = Form.useForm(
    projectWithOverseer,
    conformance,
    validation,
    onCancel,
    handleFormSubmit
  )

  // View -------------------------------------------------------------------------------------------------------
  return (
    <Form onSubmit={handleSubmit} onCancel={onCancel}>
      <Form.Item
        label="Project name"
        htmlFor="ProjectName"
        advice="Please enter the name of the project"
        error={errors.ProjectName}
      >
        <input type="text" name="ProjectName" value={project.ProjectName} onChange={handleChange} />
      </Form.Item>

      <Form.Item
        label="Project description"
        htmlFor="ProjectDescription"
        advice="Please enter the description of the project"
        error={errors.ProjectDescription}
      >
        <input
          type="text"
          name="ProjectDescription"
          value={project.ProjectDescription}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="Project start date"
        htmlFor="ProjectStartDate"
        advice="Please enter the start date of the project"
        error={errors.ProjectStartDate}
      >
        <input
          type="date"
          name="ProjectStartDate"
          value={project.ProjectStartDate.toISOString().slice(0, 10)}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="Project end date"
        htmlFor="ProjectEndDate"
        advice="Please enter the end date of the project"
        error={errors.ProjectEndDate}
      >
        <input
          type="date"
          name="ProjectEndDate"
          value={project.ProjectEndDate.toISOString().slice(0, 10)}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="Project status"
        htmlFor="Project_ProjectStatusID"
        advice="choose whether the project is In Progress, Completed, or Active"
        error={errors.Project_ProjectStatusID}
      >
        <select
          name="Project_ProjectStatusID"
          value={project.Project_ProjectStatusID}
          onChange={handleChange}
        >
          <option value="" disabled>
            Choose a status
          </option>
          <option value="1">In Progress</option>
          <option value="2">Completed</option>
          <option value="3">Active</option>
        </select>
      </Form.Item>

      {/* Hidden field for Project Overseer ID */}
      <input
        type="hidden"
        name="Project_ProjectOverseerID"
        value={project.Project_ProjectOverseerID}
      />
    </Form>
  )
}
