import { useState } from 'react'
import API from '../../api/API.js'
import FormItem from '../../UI/Form.js'
import { ActionTray, ActionAdd, ActionClose } from '../../UI/Actions.js'
import ToolTipDecorator from '../../UI/ToolTipDecorator.js'

const emptyProject = {
    ProjectName: 'Test Name for a project',
    ProjectDescription: 'ipsum dolor sit amet, consectetur adipiscing elit',
    ProjectStartDate: '15/11/2024',
    ProjectEndDate: '26/11/2026',
    ProjectStatus: 'Active',
}

export default function ProjectForm({ onDismiss, onSubmit, initialProject = emptyProject }) {
    // Initialisation -------------------------------------------------------------------------------------------------
    const isValid = {
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
    }

    const errorMessage = {
        ProjectName: 'Invalid name - must be at least 5 characters',
        ProjectDescription: 'Invalid description - must be at least 20 characters',
        ProjectStartDate: 'Invalid start date - must be a valid date',
        ProjectEndDate: 'Invalid end date - must be a valid date',
        ProjectStatus: "Invalid status - must be 'In Progress', 'Completed', or 'Active'",
    }

    // State ------------------------------------------------------------------------------------------------------
    const [project, setProject] = useState(initialProject)
    const [errors, setErrors] = useState(
        Object.keys(initialProject).reduce((accum, key) => ({ ...accum, [key]: null }), {}),
    )

    // Handlers ----------------------------------------------------------------------------------------------------
    const handleChange = (event) => {
        const { name, value } = event.target
        const newValue = value.trim()
        setProject({ ...project, [name]: newValue })
        setErrors({ ...errors, [name]: isValid[name](newValue) ? null : errorMessage[name] })
    }

    const isValidProject = (project) => {
        let isProjectValid = true
        Object.keys(project).forEach((key) => {
            if (isValid[key](project[key])) {
                errors[key] = null
            } else {
                errors[key] = errorMessage[key]
                isProjectValid = false
            }
        })
        return isProjectValid
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
        setErrors({ ...errors })
    }

    // View -------------------------------------------------------------------------------------------------------
    return (
        <form className='BorderedForm'>
            <FormItem
                label='Project name'
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
            </FormItem>

            <FormItem
                label='Project description'
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
            </FormItem>

            <FormItem
                label='Project start date'
                htmlFor='ProjectStartDate'
                advice='Please enter the the start date of the project'
                error={errors.ProjectStartDate}
            >
                <input
                    type='date'
                    name='ProjectStartDate'
                    value={project.ProjectStartDate}
                    onChange={handleChange}
                />
            </FormItem>

            <FormItem
                label='Project end date'
                htmlFor='ProjectEndDate'
                advice='Please enter the the End date of the project'
                error={errors.ProjectEndDate}
            >
                <input
                    type='date'
                    name='ProjectEndDate'
                    value={project.ProjectEndDate}
                    onChange={handleChange}
                />
            </FormItem>

            <FormItem
                label='Project status'
                htmlFor='ProjectStatus'
                advice='choose whether the project is In Progress, Completed, or Active'
                error={errors.ProjectStatus}
            >
                <select
                    type='text'
                    name='ProjectStatus'
                    value={project.ProjectStatus}
                    onChange={handleChange}
                >
                    <option value='0' disabled>
                        Choose a status
                    </option>
                    {['In Progress', 'Completed', 'Active'].map((status) => (
                        <option key={status}> {status}</option>
                    ))}
                </select>
            </FormItem>

            <ActionTray>
                <ToolTipDecorator message='Add a new project'>
                    <ActionAdd showText onClick={handleSubmit} buttonText='Submit' />
                </ToolTipDecorator>
                <ToolTipDecorator message='close submission'>
                    <ActionClose showText onClick={handleCancel} buttonText='Cancel' />
                </ToolTipDecorator>
            </ActionTray>
        </form>
    )
}
