// projectService.js
import API from '../api/API.js'

// Format date objects to YYYY-MM-DD strings
const formatDateForAPI = (dateObject) => {
  if (dateObject instanceof Date) {
    return dateObject.toISOString().slice(0, 10)
  }
  return dateObject
}

// Format all dates in a project object
const formatProjectDates = (project) => {
  const formattedProject = {...project}

  if (project.ProjectStartDate) {
    formattedProject.ProjectStartDate = formatDateForAPI(project.ProjectStartDate)
  }

  if (project.ProjectEndDate) {
    formattedProject.ProjectEndDate = formatDateForAPI(project.ProjectEndDate)
  }

  return formattedProject
}

// Create a project and assign the current user as overseer
const createProjectWithAssignment = async (projectData, userId) => {
  try {
    // Format dates
    const formattedProject = formatProjectDates(projectData)

    // Step 1: Create the project
    const projectResponse = await API.post('/projects', formattedProject)

    if (!projectResponse.isSuccess) {
      throw new Error(`Failed to create project: ${projectResponse.message}`)
    }

    // Get the new project ID
    const createdProject = projectResponse.result
    const projectId = createdProject[0].ProjectID

    // Step 2: Create the user-project relationship
    const userProjectData = {
      UserProject_UserID: userId,
      UserProject_ProjectID: projectId,
      UserProject_ProjectRoleID: 1, // Overseer role
    }

    const userProjectResponse = await API.post('/userprojects', userProjectData)

    if (!userProjectResponse.isSuccess) {
      throw new Error(`Failed to assign user to project: ${userProjectResponse.message}`)
    }

    return {
      success: true,
      project: createdProject,
    }
  } catch (error) {
    console.error('Project creation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to complete the project creation process',
    }
  }
}

// Create a named service object and export it as default
const projectService = {
  createProjectWithAssignment,
}

export default projectService
