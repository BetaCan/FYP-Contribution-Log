import { ActionTray, ActionAdd, ActionClose } from './Actions.js'
import ToolTipDecorator from './ToolTipDecorator.js'
import useLoad from '../api/useLoad.js'
import './Form.scss'

export default function Form({ children, onSubmit, onCancel }) {
    // Intitilisation ------------------------------------------
    // Hooks ---------------------------------------------------
    // State ---------------------------------------------------
    // Context -------------------------------------------------
    // Handlers ------------------------------------------------
    const handleSubmit = () => {
        onSubmit()
    }
    const handleCancel = () => {
        onCancel()
    }
    // View ----------------------------------------------------
    return (
        <form className='BorderedForm'>
            <div className='FormTray'>{children}</div>

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

function Item({ children, label, htmlFor, advice, error }) {
    // Intitilisation ------------------------------------------
    // Hooks ---------------------------------------------------
    // State ---------------------------------------------------
    // Context -------------------------------------------------
    // Handlers ------------------------------------------------
    // View ----------------------------------------------------
    return (
        <div className='FormItem'>
            <label className='FormLabel' htmlFor={htmlFor}>
                {label}
            </label>
            {advice && <p className='FormAdvice'>{advice}</p>}
            {children}
            {error && <p className='FormError'>{error}</p>}
        </div>
    )
}

// ----------------------------------------
//  Compose Form Object ////////////////////
// ----------------------------------------
Form.Item = Item
