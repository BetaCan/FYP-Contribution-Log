import Form from "../../UI/Form.js";

const emptyProject = {
  ProjectName: "Dummy Project",
  ProjectStartDate: new Date("2024-11-15"),
  ProjectEndDate: new Date("2024-12-15"),
  ProjectStatus: "Active",
  ProjectDescription: "ipsum dolor sit amet, consectetur adipiscing elit",
};

export default function ProjectForm({ onCancel, onSubmit, initialProject = emptyProject }) {
  // Initialisation -------------------------------------------------------------------------------------------------
  const validation = {
    isValid: {
      ProjectName: (name) => name.length > 5,
      ProjectStartDate: (date) => !isNaN(date.getTime()),
      ProjectEndDate: (date) => !isNaN(date.getTime()),
      ProjectStatus: (status) => ["In Progress", "Completed", "Active"].includes(status),
      ProjectDescription: (description) => description.length > 20,
    },

    errorMessage: {
      ProjectName: "Invalid name - must be at least 5 characters",
      ProjectDescription: "Invalid description - must be at least 20 characters",
      ProjectStartDate: "Invalid start date - must be a valid date",
      ProjectEndDate: "Invalid end date - must be a valid date",
      ProjectStatus: "Invalid status - must be 'In Progress', 'Completed', or 'Active'",
    },
  };

  const conformance = [""];

  // js2html: {
  //   ProjectStartDate: (date) => new Date(date).toISOString().slice(0, 10),
  //   ProjectEndDate: (date) => new Date(date).toISOString().slice(0, 10),
  // },
  // html2js: {
  //   ProjectStartDate: (date) => new Date(date),
  //   ProjectEndDate: (date) => new Date(date),
  // },

  // State ------------------------------------------------------------------------------------------------------
  const [project, errors, handleChange, handleSubmit] = Form.useForm(
    initialProject,
    conformance,
    validation,
    onCancel,
    onSubmit
  );

  // Handlers ----------------------------------------------------------------------------------------------------
  // const handleChangeWrapper = (e) => {
  //   const { name, value } = e.target;
  //   const conformedValue = conformance.html2js[name] ? conformance.html2js[name](value) : value;
  //   handleChange({ target: { name, value: conformedValue } });
  // };

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
          // value={conformance.js2html["ProjectStartDate"](project.ProjectStartDate)}
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
          // value={conformance.js2html["ProjectEndDate"](project.ProjectEndDate)}
          value={project.ProjectEndDate}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="Project status"
        htmlFor="ProjectStatus"
        advice="choose whether the project is In Progress, Completed, or Active"
        error={errors.ProjectStatus}
      >
        <select name="ProjectStatus" value={project.ProjectStatus} onChange={handleChange}>
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
