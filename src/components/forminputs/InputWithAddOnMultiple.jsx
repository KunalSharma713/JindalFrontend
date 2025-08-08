import { FormGroup, Input } from "reactstrap";
import "./InputWithAddOn.css";
import uuid from "react-uuid";
import { useEffect, useState } from "react";
// Reusable input component with optional left/right add-ons and validation
const InputWithAddOnMultiple = ({
  hasAddOn = null,
  value = "",
  setValue,
  placeholder = "",
  feedbackMessage = "",
  feedbackType = "none",
  isTouched = false,
  setIsTouched,
  label = "",
  validateHandler = null,
  disabled,
  type = "text",
  className = "",
  isRequired = false,
  name = null,
  id = null,
  extraProps = {},
  onBlurAction = () => { },
  dynamicFormGroup = null,
}) => {
  const DynamicElement = dynamicFormGroup ?? FormGroup;
  const [uuidName, setUuidName] = useState(null);
  // Generate a UUID if id or name is missing
  useEffect(() => {
    if (!id || !name) {
      setUuidName(uuid());
    }
  }, []);

  return (
    <DynamicElement>
      {label !== "" && (
        <label
          htmlFor={name ?? uuidName}
          className="ml-1  truncate w-full "
          aria-labelledby={id ?? uuidName}
          style={{
            userSelect: "none",
            fontSize: "12px",
            fontWeight: "500",
            color: "#0F0F0F",
          }}
        >
          {label}
          {isRequired && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="my-2" style={{ position: "relative" }}>
        <Input
          autoComplete="off"
          id={id ?? uuidName}
          name={name ?? uuidName}
          className={`InputWithAddOnMultiple_input ${hasAddOn?.left && "has_left_add_on"
            } ${hasAddOn?.right && "has_right_add_on"
            } ${className} input-background-color-default input-with-add-on-default `}
          type={type === "integer" ? "number" : type}
          disabled={disabled}
          value={value}
          aria-required="true"
          aria-label={label}
          title={value}
          tabIndex={0}
          {...extraProps}
          onChange={(e) => {
            let newValue = e.target.value;
            if (type === "integer") {
              newValue = newValue?.replace(/[^0-9]/g, '')
            }
            setValue(newValue);

            if (isTouched && validateHandler !== null) {
              validateHandler(newValue);
            }
          }}
          placeholder={placeholder}
          onBlur={(e) => {

            let newValue = value;
            if (type === "integer") {
              newValue = newValue?.replace(/[^0-9]/g, '')
            }


            if (type === "text") {
              setValue((newValue ?? "").trim());
            } else {
              setValue(newValue ?? "");
            }

            validateHandler && validateHandler(newValue);
            setIsTouched(true);
            onBlurAction(newValue);

            return e
          }}
          valid={feedbackType === "success"}
          invalid={feedbackType === "error"}
        />
        {hasAddOn?.left}
        {hasAddOn?.right}
      </div>
       {/* Show validation feedback message */}
      {feedbackType !== "none" && (
        <div
          className={feedbackType + "-feedback-class  m-0 p-0 ml-1 w-full"}
          style={{ userSelect: "none" }}
        >
          {feedbackMessage}
        </div>
      )}
    </DynamicElement>
  );
};


export default InputWithAddOnMultiple;
