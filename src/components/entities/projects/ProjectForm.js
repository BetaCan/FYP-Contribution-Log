import Form from '../../UI/Form.js'

const emptyProject = {
    ProjectName: 'Test Name for a project',
    ProjectDescription: 'ipsum dolor sit amet, consectetur adipiscing elit',
    ProjectStartDate: '15/11/2024',
    ProjectEndDate: '26/11/2026',
    ProjectStatus: 'Active',
}

export default function ProjectForm({ onDismiss, onSubmit, initialProject = emptyProject }) {
    // Initialisation -------------------------------------------------------------------------------------------------
    const validation = {
        isValid: {
            ProjectName: (name) => name.length > 5,
            ProjectDescription: (description) => description.length > 20,
            ProjectStartDate: (startDate) => {
                const date = new Date(startDate)
                return !isNaN(date.getTime())
            },
            ProjectEndDate: (endDate) => {
                const date = new Date(endDate)
                return !isNaN(date.getTime())
            },
            ProjectStatus: (status) => ['In Progress', 'Completed', 'Active'].includes(status),
        },

        errorMessage: {
            ProjectName: 'Invalid name - must be at least 5 characters',
            ProjectDescription: 'Invalid description - must be at least 20 characters',
            ProjectStartDate: 'Invalid start date - must be a valid date',
            ProjectEndDate: 'Invalid end date - must be a valid date',
            ProjectStatus: "Invalid status - must be 'In Progress', 'Completed', or 'Active'",
        },
    }

    const conformance = []

    // State ------------------------------------------------------------------------------------------------------
    const [project, errors, setErrors, handleChange] = Form.useForm(
        initialProject,
        conformance,
        validation,
    )

    // Handlers ----------------------------------------------------------------------------------------------------
    const isValidProject = (project) => {
        let isRecordValid = true
        Object.keys(project).forEach((key) => {
            if (validation.isValid[key](project[key])) {
                errors[key] = null
            } else {
                errors[key] = validation.errorMessage[key]
                isRecordValid = false
            }
        })
        setErrors({ ...errors })
        return isRecordValid
    }

    const handleCancel = () => onDismiss()
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (isValidProject(project)) {
            const success = await onSubmit(project)
            if (success) {
                onDismiss()
            }
        }
    }

    // View -------------------------------------------------------------------------------------------------------
    return (
        <Form onSubmit={handleSubmit} onCancel={handleCancel}>
            <Form.Item
                label='Project Name'
                htmlFor='ProjectName'
                advice='Please enter the name of the project'
                error={errors.ProjectName}
            >
                <input
                    type='text'
                    name='ProjectName'
                    value={project.ProjectName}
                    onChange={handleChange}
                />
            </Form.Item>

            <Form.Item
                label='Project Description'
                htmlFor='ProjectDescription'
                advice='Please enter the description of the project'
                error={errors.ProjectDescription}
            >
                <input
                    type='text'
                    name='ProjectDescription'
                    value={project.ProjectDescription}
                    onChange={handleChange}
                />
            </Form.Item>

            <Form.Item
                label='Project Start Date'
                htmlFor='ProjectStartDate'
                advice='Please enter the start date of the project'
                error={errors.ProjectStartDate}
            >
                <input
                    type='date'
                    name='ProjectStartDate'
                    value={project.ProjectStartDate}
                    onChange={handleChange}
                />
            </Form.Item>

            <Form.Item
                label='Project End Date'
                htmlFor='ProjectEndDate'
                advice='Please enter the end date of the project'
                error={errors.ProjectEndDate}
            >
                <input
                    type='date'
                    name='ProjectEndDate'
                    value={project.ProjectEndDate}
                    onChange={handleChange}
                />
            </Form.Item>

            <Form.Item
                label='Project Status'
                htmlFor='ProjectStatus'
                advice='Choose whether the project is In Progress, Completed, or Active'
                error={errors.ProjectStatus}
            >
                <select name='ProjectStatus' value={project.ProjectStatus} onChange={handleChange}>
                    <option value='' disabled>
                        Choose a status
                    </option>
                    {['In Progress', 'Completed', 'Active'].map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </Form.Item>
        </Form>
    )
}
