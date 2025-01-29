import Action from "./Actions.js";
import ToolTipDecorator from "./ToolTipDecorator.js";
import { useState } from "react";
import "./Form.scss";

export default function Form({ children, onSubmit, onCancel }) {
  // Intitilisation ------------------------------------------
  // Hooks ---------------------------------------------------
  // State ---------------------------------------------------
  // Context -------------------------------------------------
  // Handlers ------------------------------------------------
  const handleSubmit = () => {
    onSubmit();
  };
  const handleCancel = () => {
    onCancel();
  };
  // View ----------------------------------------------------
  return (
    <form className="BorderedForm">
      <div className="FormTray">{children}</div>

      <Action.Tray>
        <ToolTipDecorator message="Add a new project">
          <Action.Add showText onClick={handleSubmit} buttonText="Submit" />
        </ToolTipDecorator>
        <ToolTipDecorator message="close submission">
          <Action.Close showText onClick={handleCancel} buttonText="Cancel" />
        </ToolTipDecorator>
      </Action.Tray>
    </form>
  );
}

function Item({ children, label, htmlFor, advice, error }) {
  // Intitilisation ------------------------------------------
  // Hooks ---------------------------------------------------
  // State ---------------------------------------------------
  // Context -------------------------------------------------
  // Handlers ------------------------------------------------
  // View ----------------------------------------------------
  return (
    <div className="FormItem">
      <label className="FormLabel" htmlFor={htmlFor}>
        {label}
      </label>
      {advice && <p className="FormAdvice">{advice}</p>}
      {children}
      {error && <p className="FormError">{error}</p>}
    </div>
  );
}

function useForm(initialRecord, conformance, { isValid, errorMessage }, onCancel, onSubmit) {
  // Intitilisation ------------------------------------------
  // State ---------------------------------------------------
  const [record, setRecord] = useState(initialRecord);
  const [errors, setErrors] = useState(
    Object.keys(initialRecord).reduce((accum, key) => ({ ...accum, [key]: null }), {})
  );
  // Context -------------------------------------------------
  // Handlers ------------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue =
      conformance.html2js && conformance.html2js[name] ? conformance.html2js[name](value) : value;
    if (name === "ProjectStartDate" || name === "ProjectEndDate") {
      newValue = new Date(newValue);
    }
    setRecord({ ...record, [name]: newValue });
    setErrors({ ...errors, [name]: isValid[name](newValue) ? null : errorMessage[name] });
  };

  const isValidRecord = (record) => {
    let isRecordValid = true;

    const newErrors = {
      ...errors,
    };

    Object.keys(isValid).forEach((key) => {
      if (isValid[key](record[key])) {
        newErrors[key] = null;
      } else {
        newErrors[key] = errorMessage[key];
        isRecordValid = false;
      }
    });

    setErrors(newErrors);
    return isRecordValid;
  };

  const handleSubmit = () => {
    isValidRecord(record) && onSubmit(record) && onCancel();
    setErrors({ ...errors });
  };
  // View ----------------------------------------------------
  return [record, errors, handleChange, handleSubmit];
}

// ----------------------------------------
//  Compose Form Object ////////////////////
// ----------------------------------------
Form.Item = Item;
Form.useForm = useForm;
