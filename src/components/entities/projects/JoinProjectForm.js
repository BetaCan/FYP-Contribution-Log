import { useState } from 'react'
import FormItem from '../../UI/Form.js'
import { ActionTray, ActionAdd, ActionClose } from '../../UI/Actions.js'
import ToolTipDecorator from '../../UI/ToolTipDecorator.js'

const emptyJoinProject = {
    UserProjectProjectID: '',
    UserprojectRole: '',
}

export default function JoinProjectForm({
    onDismiss,
    onSubmit,
    initialJoinProject = emptyJoinProject,
}) {
    // Initialisation -------------------------------------------------------------------------------------------------
    const isValid = {
        UserProjectProjectID: (id) => id.length > 0,
        UserprojectRole: (role) => ['Contributor', 'Viewer', 'Manager'].includes(role),
    }

    const errorMessage = {
        UserProjectProjectID: 'Invalid Project ID - must not be empty',
        UserprojectRole: 'Invalid Role - must be Contributor, Viewer, or Manager',
    }

    // State ------------------------------------------------------------------------------------------------------
    const [joinProject, setJoinProject] = useState(initialJoinProject)
    const [errors, setErrors] = useState(
        Object.keys(initialJoinProject).reduce((accum, key) => ({ ...accum, [key]: null }), {}),
    )

    // Handlers ----------------------------------------------------------------------------------------------------
    const handleChange = (event) => {
        const { name, value } = event.target
        const newValue = value.trim()
        setJoinProject({ ...joinProject, [name]: newValue })
        setErrors({ ...errors, [name]: isValid[name](newValue) ? null : errorMessage[name] })
    }

    const isValidJoinProject = (joinProject) => {
        let isJoinProjectValid = true
        Object.keys(joinProject).forEach((key) => {
            if (isValid[key](joinProject[key])) {
                errors[key] = null
            } else {
                errors[key] = errorMessage[key]
                isJoinProjectValid = false
            }
        })
        return isJoinProjectValid
    }

    const handleCancel = () => onDismiss()
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (isValidJoinProject(joinProject)) {
            const success = await onSubmit(joinProject)
            if (success) {
                onDismiss()
            }
        }
        setErrors({ ...errors })
    }

    // View -------------------------------------------------------------------------------------------------------
    return (
        <form className='BorderedForm'>
            <FormItem
                label='Project ID'
                htmlFor='UserProjectProjectID'
                advice='Please enter the ID of the project you want to join'
                error={errors.UserProjectProjectID}
            >
                <input
                    type='text'
                    name='UserProjectProjectID'
                    value={joinProject.UserProjectProjectID}
                    onChange={handleChange}
                />
            </FormItem>

            <FormItem
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
            </FormItem>

            <ActionTray>
                <ToolTipDecorator message='Join a project'>
                    <ActionAdd showText onClick={handleSubmit} buttonText='Submit' />
                </ToolTipDecorator>
                <ToolTipDecorator message='Close submission'>
                    <ActionClose showText onClick={handleCancel} buttonText='Cancel' />
                </ToolTipDecorator>
            </ActionTray>
        </form>
    )
}
