import { FormGroup, Input } from "reactstrap"; // Importing FormGroup and Input components from reactstrap
import uuid from "react-uuid"; // Importing uuid to generate unique IDs for form elements
import { useEffect, useState } from "react"; // Importing React hooks for state management and side effects

const InputTextArea = ({
  hasAddOn = null, // Optional prop to include add-ons to the left or right of the textarea
  value = "", // The current value of the textarea
  setValue, // Function to update the value of the textarea
  placeholder = "", // Placeholder text for the textarea
  feedbackMessage = "", // Optional feedback message (e.g., error or success message)
  feedbackType = "none", // Type of feedback (success, error, or none)
  isTouched = false, // Flag indicating if the textarea has been touched by the user
  setIsTouched, // Function to set the touched state
  label = "", // Label for the textarea field
  validateHandler = null, // Optional validation handler function
  disabled, // Boolean to disable the textarea
  type = "text", // Type of input, defaults to text, but can be customized
  className = "", // Custom CSS class for the textarea input
  isRequired = false, // Flag indicating if the field is required
  name = null, // Optional name attribute for the textarea input
  id = null, // Optional id attribute for the textarea input
  extraProps = {}, // Additional props to pass to the textarea
  minLength = 3 // Minimum number of rows for the textarea (default is 3)
}) => {
  // State to store a unique UUID name for the input field
  const [uuidName, setUuidName] = useState(null);

  // useEffect hook to initialize UUID when name or id is not provided
  useEffect(() => {
    if (!id || !name) {
      setUuidName(uuid()); // Generate a unique ID if none is provided
    }
  }, [id, name]);

  return (
    <FormGroup>
      {/* Render label if it's provided */}
      {label !== "" && (
        <label
          htmlFor={name ?? uuidName} // Set the 'for' attribute to the generated or provided ID
          style={{
            userSelect: "none", // Prevent the label from being selected by the user
            fontSize: "12px", // Set font size of the label
            fontWeight: "500", // Set font weight of the label
            color: "#0F0F0F", // Set font color
          }}
          className="ml-1 truncate w-full" // Styling for the label
        >
          {label} {/* Display the label text */}
          {isRequired && <span className="text-red-500"> *</span>} {/* Display a red asterisk if the field is required */}
        </label>
      )}

      {/* Container div to hold the textarea input */}
      <div style={{ position: "relative" }}>
        <Input
          autoComplete="off" // Disable autocomplete for the textarea
          id={id ?? uuidName} // Set the ID to the generated or provided value
          name={name ?? uuidName} // Set the name to the generated or provided value
          className={`${hasAddOn?.left && "has_left_add_on"} ${hasAddOn?.right && "has_right_add_on"} ${className} input-background-color-default`} // Dynamic class names for add-ons and custom styles
          type="textarea" // Define input type as textarea
          disabled={disabled} // Disable the textarea if disabled is true
          rows={minLength} // Set the number of rows for the textarea (based on minLength prop)
          value={value} // The current value of the textarea
          {...extraProps} // Spread any additional props passed to the component
          onChange={(e) => {
            setValue(e.target.value); // Update the value when the user types in the textarea
            if (isTouched && validateHandler !== null) {
              validateHandler(e.target.value); // Validate input if validateHandler is provided
            }
          }}
          placeholder={placeholder} // Set the placeholder text
          onBlur={() => {
            if (type === "text") {
              setValue((value ?? "").trim()); // Trim the value if it's a text type input
            }
            validateHandler && validateHandler(value); // Call the validate handler on blur
            setIsTouched(true); // Set the touched state to true
          }}
          valid={feedbackType === "success"} // Set the 'valid' state based on feedbackType
          invalid={feedbackType === "error"} // Set the 'invalid' state based on feedbackType
        />
        {hasAddOn?.left} {/* Render the left add-on if provided */}
        {hasAddOn?.right} {/* Render the right add-on if provided */}
      </div>

      {/* Render feedback message if feedbackType is not 'none' */}
      {feedbackType !== "none" && (
        <div
          className={feedbackType + "-feedback-class m-0 p-0 ml-1 w-full"} // Set feedback class based on feedbackType (success/error)
          style={{ userSelect: "none" }} // Prevent the feedback message from being selected
        >
          {feedbackMessage} {/* Display the feedback message */}
        </div>
      )}
    </FormGroup>
  );
};

export default InputTextArea;
