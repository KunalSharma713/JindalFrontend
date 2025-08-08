import { FormGroup, Input } from "reactstrap";
import "./InputWithAddOn.css";
import uuid from "react-uuid";
import { useEffect, useState } from "react";

// Reusable input component with optional left/right add-ons, validation, and formatting
const InputWithAddOn = ({
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
}) => {
    const [uuidName, setUuidName] = useState(null);

    useEffect(() => {
        if (!id || !name) {
            setUuidName(uuid());
        }
    }, []);
    // Remove leading zeros from number inputs except for "0" or "0.0"
    const removeLeadingZeros = (number) => {
        if (/^0$|^0(\.0+)?$/.test(number)) {
            return number;
        }
        return number.replace(/^0+(?!\.)/, '');
    };
    // Handle change event with conditional formatting and validation
    const handleChange = (e) => {
        let newValue = e?.target?.value;

        if (type === "number") {
            if (newValue === "" || /^[0-9]*\.?[0-9]*$/.test(newValue)) {

                setValue(newValue);
            } else {
                return;
            }
        } else if (type === "integer") {
            setValue(newValue?.replace(/[^0-9]/g, ''));
        } else {
            setValue(newValue);
        }

        if (isTouched && validateHandler !== null) {
            validateHandler(newValue);
        }
    };
    // Handle blur event for trimming, formatting, and validation
    const handleBlur = (e) => {
        let trimmedValue = (value ? value + "" : "").trim();
        if (type === "text") {
            setValue(trimmedValue);
        }

        if (type === "number") {
            setValue(removeLeadingZeros(trimmedValue));
        }

        validateHandler && validateHandler(trimmedValue);
        setIsTouched(true);
        return e
    };

    return (
        <FormGroup>
            {label !== "" && (
                <label
                    htmlFor={name ?? uuidName}
                    className="ml-1 truncate w-full"
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
            <div style={{ position: "relative" }}>
                <Input
                    autoComplete="off"
                    id={id ?? uuidName}
                    name={name ?? uuidName}
                    className={`InputWithAddOn_input ${hasAddOn?.left ? "has_left_add_on" : ""
                        } ${hasAddOn?.right ? "has_right_add_on" : ""
                        } ${className} input-background-color-default input-with-add-on-default`}
                    type={type}
                    disabled={disabled}
                    value={value}
                    aria-required="true"
                    aria-label={label}
                    title={label}
                    tabIndex={0}
                    {...extraProps}
                    onChange={handleChange}
                    placeholder={placeholder}
                    onBlur={handleBlur}
                    valid={feedbackType === "success"}
                    invalid={feedbackType === "error"}
                />
                {hasAddOn?.left}
                {hasAddOn?.right}
            </div>
             {/* Show validation feedback message */}
            {feedbackType !== "none" && (
                <div
                    className={`${feedbackType}-feedback-class m-0 p-0 ml-1 w-full`}
                    style={{ userSelect: "none" }}
                >
                    {feedbackMessage}
                </div>
            )}
        </FormGroup>
    );
};


export default InputWithAddOn;
