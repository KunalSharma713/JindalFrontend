import { FormGroup } from "reactstrap"; // Importing FormGroup component from reactstrap
import { useEffect, useState } from "react"; // Importing React hooks for state and side effects
import uuid from "react-uuid"; // Importing uuid to generate unique IDs
import Select from "react-select"; // Importing the Select component from react-select for dropdown functionality

const InputSelect = ({
  removeXIcon = true, // Boolean prop to determine if the 'clear' icon (X) should be displayed
  options = [], // Array of options for the select dropdown
  value = "", // The current selected value
  setValue, // Function to update the value when a selection is made
  feedbackMessage = "", // Optional message to show feedback (e.g., error/success message)
  feedbackType = "none", // The type of feedback to display (none, success, error)
  label = "", // Label for the select input field
  validateHandler = null, // Optional validation handler function
  disabled = false, // Boolean prop to disable the select input
  isTouched = false, // Boolean flag to track if the input has been touched
  setIsTouched = () => { }, // Function to set the touched state
  isRequired = false, // Boolean to indicate if the field is required
  extraProps = {}, // Additional props to pass to the select input
  name = null, // Optional name attribute for the input
  id = null, // Optional id attribute for the input
  labelClassName = "", // Optional class name for the label
  isLoading = false, // Boolean to indicate if the options are loading
  hasExpand = false, // Boolean to apply an expanded style to the dropdown
  heightClass = null, // Optional class to control height styling
  dynamicFormGroup = null, // Option to pass a custom form group component
  inputCssClass = '' // Additional custom CSS class for the select input
}) => {
  // Dynamically choose FormGroup or a custom form group component
  const DynamicElement = dynamicFormGroup ?? FormGroup;

  // State to store a unique UUID name for the input field
  const [uuidName, setUuidName] = useState(null);

  // State to store options for the clear selected icon (X)
  const [ClearSelectedIconObj, setClearSelectedIconObj] = useState({});

  // useEffect hook to initialize UUID and manage clear icon logic
  useEffect(() => {
    if (!id || !name) {
      setUuidName(uuid());// Generate a unique ID if none is provided
    }
    if (removeXIcon) {
      setClearSelectedIconObj({
        ClearSelectedIcon: removeXIcon,// Conditionally set the clear icon
      });
    } else {
      setClearSelectedIconObj({});
    }
  }, [id, name, removeXIcon]); // Re-run effect if id, name, or removeXIcon change

  // Mapping options for react-select
  const formattedOptions = (options ?? [])?.map(option => ({
    value: option.value, // Mapping value for react-select
    label: option.label  // Mapping label for react-select
  }));

  // Mapping the selected value to find the corresponding option in the formatted options
  const selectedOption = formattedOptions.find(option => option.value === value);

  return (
    // Dynamic form group component that applies various classes based on props
    <DynamicElement
      className={` ${hasExpand ? "expand-multiple-select-dropdown" : ""} ${feedbackType === "error" ? "input-searchable-select-error" : ""} input_select_tab${heightClass ? "_" + heightClass : ""} ${disabled ? "input_select_tab_disabled" : ""}`}
    >
      {/* Label rendering if label prop is provided */}
      {label !== "" && (
        <label
          className={` ${labelClassName} ml-1 truncate w-full `}
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
      {/* React Select component */}
      <Select
        {...ClearSelectedIconObj} // Conditionally spread the clear icon options
        isLoading={isLoading} // Display loading indicator when fetching options
        options={formattedOptions} // Passing formatted options to the select dropdown
        value={selectedOption || ""} // Set the selected option based on current value
        id={id ?? uuidName} // Set the id of the select input
        isDisabled={disabled} // Disable the select if disabled prop is true
        onChange={(selectedOption) => {
          const newValue = selectedOption ? selectedOption.value : ""; // Get the value of the selected option
          setValue(newValue); // Update the value state
          if (isTouched && validateHandler !== null) {
            validateHandler(newValue); // Trigger validation handler if provided
          }
        }}
        onBlur={() => setIsTouched(true)} // Set the touched state when the select loses focus
        placeholder="Select..." // Placeholder text
        isClearable={false} // Disable the clearable option (X icon)
        closeMenuOnSelect={true} // Close the dropdown after a selection is made
        className={inputCssClass} // Apply custom CSS class if provided
        {...extraProps} // Spread additional props to the Select component
      />

      {/* Feedback message display if feedbackType is not "none" */}
      {feedbackType !== "none" && (
        <div className={feedbackType + "-feedback-class m-0 p-0 ml-1 w-full"}>
          {feedbackMessage} {/* Show the feedback message (e.g., error or success message) */}
        </div>
      )}
    </DynamicElement>
  );
};

export default InputSelect;
