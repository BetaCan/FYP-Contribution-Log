import Form from '../../UI/Form.js'
import useLoad from '../../api/useLoad.js'

const emptyJoinProject = {
    UserProjectProjectID: '',
    UserprojectRole: '',
}

export default function JoinProjectForm({
    onCancel,
    onSubmit,
    initialJoinProject = emptyJoinProject,
}) {
    // Initialisation -------------------------------------------------------------------------------------------------
    const validation = {
        isValid: {
            UserProjectProjectID: (id) => id !== 0,
            UserprojectRole: (role) => ['Contributor', 'Viewer', 'Manager'].includes(role),
        },
        errorMessage: {
            UserProjectProjectID: 'Invalid Project ID - must not be empty',
            UserprojectRole: "Invalid role - must be 'Contributor', 'Viewer', or 'Manager'",
        },
    }
    const conformance = ['UserProjectProjectID', 'UserProjectRole']

    // State ------------------------------------------------------------------------------------------------------
    const [joinProject, errors, handleChange, handleSubmit] = Form.useForm(
        initialJoinProject,
        conformance,
        validation,
        onCancel,
        onSubmit,
    )
    const [projects, , loadingProjectsMessage] = useLoad('/projects')
    const [users, , loadingUsersMessage] = useLoad('/users')

    // Handlers ----------------------------------------------------------------------------------------------------

    // View -------------------------------------------------------------------------------------------------------
    return (
        <Form onSubmit={handleSubmit} onCancel={onCancel}>
            <Form.Item
                label='Project ID'
                htmlFor='UserProjectProjectID'
                advice='Please enter the ID of the project you want to join'
                error={errors.UserProjectProjectID}
            >
                {!projects ? (
                    <p>{loadingProjectsMessage}</p>
                ) : projects.length === 0 ? (
                    <p>No records found</p>
                ) : (
                    <select
                        name='UserProjectProjectID'
                        value={joinProject.UserProjectProjectID}
                        onChange={handleChange}
                    >
                        <option value='' disabled>
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
                label='Role'
                htmlFor='UserprojectRole'
                advice='Choose your role in the project'
                error={errors.UserprojectRole}
            >
                <select
                    name='UserprojectRole'
                    value={joinProject.UserprojectRole}
                    onChange={handleChange}
                >
                    <option value='' disabled>
                        Choose a role
                    </option>
                    {['Contributor', 'Viewer', 'Manager'].map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </Form.Item>
        </Form>
    )
}
