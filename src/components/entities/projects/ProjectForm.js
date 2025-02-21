import Form from "../../UI/Form.js";

const emptyProject = {
  ProjectName: "Dummy Project",
  ProjectStartDate: new Date("2024-11-15"),
  ProjectEndDate: new Date("2024-12-15"),
  Project_ProjectStatusID: "Active",
  ProjectDescription: "ipsum dolor sit amet, consectetur adipiscing elit",
};

export default function ProjectForm({onCancel, onSubmit, initialProject = emptyProject}) {
  // Initialisation -------------------------------------------------------------------------------------------------
  const validation = {
    isValid: {
      ProjectName: (name) => name.length > 5,
      ProjectStartDate: (date) => !isNaN(new Date(date).getTime()),
      ProjectEndDate: (date) => !isNaN(new Date(date).getTime()),
      Project_ProjectStatusID: (status) => ["In Progress", "Completed", "Active"].includes(status),
      ProjectDescription: (description) => description.length > 20,
    },
    errorMessage: {
      ProjectName: "Invalid name - must be at least 5 characters",
      ProjectDescription: "Invalid description - must be at least 20 characters",
      ProjectStartDate: "Invalid start date - must be a valid date",
      ProjectEndDate: "Invalid end date - must be a valid date",
      Project_ProjectStatusID: "Invalid status - must be 'In Progress', 'Completed', or 'Active'",
    },
  };

  const conformance = ["ProjectStatusID"];

  // State ------------------------------------------------------------------------------------------------------
  const [project, errors, handleChange, handleSubmit] = Form.useForm(
    initialProject,
    conformance,
    validation,
    onCancel,
    onSubmit
  );

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
          value={project.ProjectStartDate}
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
          value={project.ProjectEndDate}
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
          <option value="0" disabled>
            Choose a status
          </option>
          {["In Progress", "Completed", "Active"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </Form.Item>
    </Form>
  );
}
