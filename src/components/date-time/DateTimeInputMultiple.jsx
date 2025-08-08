
import React, { useEffect, useState } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import uuid from "react-uuid";
import { FormGroup } from "reactstrap";
import "../forminputs/InputWithAddOn.css";
// import { ReactComponent as CancelIcon } from "../../assets/icons/Cancel.svg";
// import { ReactComponent as CalendarIcon } from "../../assets/icons/CalendarIcon.svg";
import moment from "moment";
const DateTimeInputMultiple = ({
  value = "",
  setValue,
  feedbackMessage = "",
  feedbackType = "none",
  isTouched = false,
  setIsTouched = () => {},
  label = "",
  validateHandler = null,
  className = "",
  isRequired = false,
  name = null,
  id = null,
  inputProps = {},
  momentFormat = "",
  onBlurAction = () => {},
  disabled = false,
  ...extraProps
}) => {
  const [uuidName, setUuidName] = useState(null);
  useEffect(() => {
    if (!id || !name) {
      setUuidName(uuid());
    }
  }, []);

  return (
    <FormGroup>
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
      <div style={{ position: "relative" }}>
        <Datetime
          // displayTimeZone={"Europe/London"}
          value={moment(value).isValid() ? moment(value) : null}
          closeOnSelect={!(extraProps?.timeFormat == true)}
          className={` ${className}  ${
            feedbackType == "error"
              ? "date-time-input-is-not-valid"
              : "is-valid"
          } input-background-color-default default-border-radius has_left_add_on_date_time `}
          onChange={async (e) => {
            const parsedDate = moment(e, moment.ISO_8601, true);
            let stringDate = parsedDate.isValid() ? e.toISOString() : null;
            setValue(stringDate);
            if (isTouched && validateHandler != null) {
              validateHandler(stringDate);
            }
          }}
          onClose={(e) => {
            let stringDate = moment(value).isValid() ? value : null;
            validateHandler && validateHandler(stringDate);
            onBlurAction(stringDate);
            setIsTouched(true);
            return e
          }}
          inputProps={{
            ...inputProps,
            id: id ?? uuidName,
            name: name ?? uuidName,
            "aria-required": "true",
            "aria-label": label,
            title: label,
            tabIndex: 0,
            autoComplete: "false",
            value: moment(value).isValid()
              ? moment(value).format(momentFormat)
              : "",
            disabled: disabled,
            
          }}
          {...extraProps}
        />
        {/* {!disabled && (
          <CancelIcon
            className="input_addon_icon_right me-1"
            onClick={() => {
              validateHandler && validateHandler(null);
              setValue(null);
              onBlurAction(null);
            }}
          />
        )} */}
        {/* <CalendarIcon className="input_addon_icon_left_date_time_calendar " /> */}
      </div>
      {feedbackType != "none" && (
        <div
          className={feedbackType + "-feedback-class  m-0 p-0 ml-1 w-full"}
          style={{ userSelect: "none" }}
        >
          {feedbackMessage}
        </div>
      )}
    </FormGroup>
  );
};


export default DateTimeInputMultiple;
