import { MultiSelect } from "react-multi-select-component";
import { FormGroup } from "reactstrap";
import { useEffect, useState } from "react";
import uuid from "react-uuid";

/**
 * InputMultipleSelect
 * A reusable multi-select dropdown component with label, validation, feedback, and custom styling.
 *
 * @param {Array} options - The options to display in the dropdown.
 * @param {Array} value - Currently selected values (array of selected option objects).
 * @param {Function} setValue - Callback to update selected values.
 * @param {string} placeholder - Placeholder for the dropdown.
 * @param {string} feedbackMessage - Validation or informational message shown below the dropdown.
 * @param {"none" | "error" | "success"} feedbackType - Type of feedback (for styling).
 * @param {string} label - Label displayed above the dropdown.
 * @param {Function|null} validateHandler - Function to run on change or blur for validation.
 * @param {boolean} disabled - Whether the dropdown is disabled.
 * @param {boolean} isTouched - Whether the input has been interacted with.
 * @param {Function} setIsTouched - Setter for updating the touched state.
 * @param {boolean} isRequired - Whether the field is mandatory.
 * @param {object} extraProps - Additional props to pass to the MultiSelect component.
 * @param {string|null} name - HTML name attribute.
 * @param {string|null} id - HTML id attribute.
 * @param {boolean} hasSelectAll - Whether to include a "Select All" option.
 * @param {boolean} isLoading - Show loading indicator inside the dropdown.
 * @param {string} labelClassName - Additional class names for label styling.
 * @param {object} overrideStrings - Custom strings for overriding default text.
 * @param {string|null} heightClass - Optional class modifier for height-related styles.
 * @param {boolean} hasExpand - Whether to apply expanded dropdown style.
 */

const InputMultipleSelect = ({
  options = [], 
  value = "",
  setValue,
  placeholder = "Select...",
  feedbackMessage = "",
  feedbackType = "none",
  label = "",
  validateHandler = null,
  disabled = false,
  isTouched = false,
  setIsTouched,
  isRequired = false,
  extraProps = {},
  name = null,
  id = null,
  hasSelectAll = false,
  isLoading = false,
  labelClassName = "",
  overrideStrings = {},
  heightClass = null,
  hasExpand = false,
}) => {
  const [uuidName, setUuidName] = useState(null);

  // Generate a unique ID if not provided
  useEffect(() => {
    if (!id || !name) {
      setUuidName(uuid());
    }
  }, []);

  return (
    <FormGroup
      className={` ${hasExpand ? "expand-multiple-select-dropdown" : ""} ${
        feedbackType === "error" ? "input-searchable-select-error" : ""
      }  input_select_tab${heightClass ? "_" + heightClass : ""} ${
        disabled ? "input_select_tab_disabled" : ""
      } `}
    >
      {label !== "" && (
        <label
          className={` ${labelClassName} ml-1  truncate w-full `}
          htmlFor={name ?? uuidName}
          style={{
            userSelect: "none",
            fontSize: "12px",
            fontWeight: "500",
            color: "#0F0F0F",
          }}
        >
          {label} {isRequired && <span className="text-red-500"> *</span>}
        </label>
      )}
      {/* MultiSelect Dropdown */}
      <MultiSelect
        isLoading={isLoading}
        options={options}
        value={value}
        id={id ?? uuidName}
        disabled={disabled}
        hasSelectAll={hasSelectAll}
        onChange={(e) => {
          setValue(e);
          if (isTouched && validateHandler !== null) {
            validateHandler(e);
          }
        }}
        onMenuToggle={() => {
          validateHandler && validateHandler(value);
          setIsTouched(true);
        }}
        labelledBy={placeholder}
        overrideStrings={{ ...overrideStrings, selectSomeItems: placeholder }}
        className=" "
        {...extraProps}
      />

      {feedbackType !== "none" && (
        <div className={feedbackType + "-feedback-class  m-0 p-0 ml-1 w-full"}>
          {feedbackMessage}
        </div>
      )}
    </FormGroup>
  );
};


export default InputMultipleSelect;
