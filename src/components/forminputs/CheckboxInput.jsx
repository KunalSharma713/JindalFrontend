import React from "react";
import { FormGroup, Label, Input } from "reactstrap";
import "./CheckboxInput.css";
const CheckboxInput = ({
  check = false,
  setChecked,
  label = null,
  disabled = false,
  className = "",
  formGroupClassName = "",
  id = "check-box-input-default-id",
}) => {
  return (
    <FormGroup check inline className={`check-box ${formGroupClassName}`}>
      <Input
        id={id}
        type="checkbox"
        className={className}
        onChange={() => {
          setChecked(!check);
        }}
        aria-required="true"
        checked={check}
        tabIndex={0}
        disabled={disabled}
      />
      {label && (
        <Label
          tabIndex={0}
          check
          inline
          htmlFor={id}
          className={` check-box-input-label`}
        >
          {label}
        </Label>
      )}
    </FormGroup>
  );
};



export default CheckboxInput;
