import { useEffect, useState } from "react";
import useFetchAPI from "../../hooks/useFetchAPI";
import useInputComponent from "../../hooks/useInputComponent"
import InputWithAddOnMultiple from "../forminputs/InputWithAddOnMultiple"
import DateTimeInputMultiple from "../date-time/DateTimeInputMultiple";
import CheckboxInput from "../forminputs/CheckboxInput";
import InputSelect from "../forminputs/Select/InputSelect"
import { Label } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationAlert from "../../hooks/NotificationAlert";
import { Spinner } from "reactstrap";
import { useSelector } from "react-redux";

export function AddUserDialog() {

  const { currentPlant } = useSelector(
    (state) => state.LoginReducer
  );
  const navigate = useNavigate();
  const location = useLocation();


  const [UserId, setUserId] = useState(null)
  useEffect(() => {
    const match = location?.pathname.match(/:([a-f0-9]{24})/);
    if (match) {
      setUserId(match[1])
    } else {
      setUserId(null)
    }

  }, [location])



  const [getCompanyDetailsFetchHandler, getCompanyFetchHandler] = useFetchAPI(
    {
      url: `/users/${UserId}`,
      method: "GET",
      authRequired: true,

    },
    (e) => {

      return e;
    },
    (e) => {
      return e?.response ?? true;
    }
  );



  useEffect(() => {
    if (getCompanyDetailsFetchHandler?.data) {
      let users = getCompanyDetailsFetchHandler?.data?.user;
      FirstNameInput.setEnteredValue(users.first_name)
      LastNameInput.setEnteredValue(users.last_name)
      EmailInput.setEnteredValue(users.email)
      PasswordInput.setEnteredValue(users.password)
      PhoneNumberInput.setEnteredValue(users.mobile_no)
      DobInput.setEnteredValue(users.dob)
      UserNameInput.setEnteredValue(users.username)
      setSelectRole(users?.roleid?._id)
      setGender(users?.gender)
    }
  }, [getCompanyDetailsFetchHandler?.data])



  useEffect(() => {
    if (UserId !== null) {
      getCompanyFetchHandler()
    }
  }, [UserId])



  const [getRoleResponse, getRoleHandler] =
    useFetchAPI(
      {
        url: "/role",
        method: "GET",
      },
      (e) => {
        return e?.roles?.map((item) => {
          return {
            label: item?.name, value: item?._id
          }
        });
      },
      (e) => {
        return e;
      }
    );


  useEffect(() => {
    getRoleHandler()
  }, [])




  let UserNameInput = useInputComponent();
  let UserNameValidator = (value) => {
    // Check if the field is empty
    if (value === "" || !value) {
      UserNameInput.setFeedbackMessage("Field Required!");
      UserNameInput.setMessageType("error");
      return false;
    }

    // Check for minimum length
    if (value.length < 3) {
      UserNameInput.setFeedbackMessage("Username must be at least 3 characters.");
      UserNameInput.setMessageType("error");
      return false;
    }

    // Check for leading or trailing spaces
    if (value.trim() !== value) {
      UserNameInput.setFeedbackMessage("Username cannot have leading or trailing spaces.");
      UserNameInput.setMessageType("error");
      return false;
    }

    // Check if the username starts with a letter
    const startWithLetterRegex = /^[a-zA-Z]/;
    if (!startWithLetterRegex.test(value)) {
      UserNameInput.setFeedbackMessage("Username must start with a letter.");
      UserNameInput.setMessageType("error");
      return false;
    }

    // Check if the username contains only alphanumeric characters and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(value)) {
      UserNameInput.setFeedbackMessage("Username can only contain letters, numbers, and underscores.");
      UserNameInput.setMessageType("error");
      return false;
    }

    // Clear feedback if everything is valid
    UserNameInput.setFeedbackMessage("");
    UserNameInput.setMessageType("none");
    return true;
  };



  // Firstname
  let FirstNameInput = useInputComponent();
  let FirstNameValidator = (value) => {
    // Check if the field is empty
    if (value === "" || !value) {
      FirstNameInput.setFeedbackMessage("Field Required!");
      FirstNameInput.setMessageType("error");
      return false;
    }

    // Check if the name starts with a number
    if (/^\d/.test(value)) {
      FirstNameInput.setFeedbackMessage("First name cannot start with a number.");
      FirstNameInput.setMessageType("error");
      return false;
    }

    // Check if the name contains only letters, spaces, or hyphens (you can adjust this regex as needed)
    const nameRegex = /^[a-zA-Z\s-]+$/;
    if (!nameRegex.test(value)) {
      FirstNameInput.setFeedbackMessage("First name can only contain letters, spaces, or hyphens.");
      FirstNameInput.setMessageType("error");
      return false;
    }

    // Clear feedback if everything is valid
    FirstNameInput.setFeedbackMessage("");
    FirstNameInput.setMessageType("none");
    return true;
  };

  // Lastname
  let LastNameInput = useInputComponent();
  let LastNameValidator = (value) => {
    // Check if the field is empty
    if (value === "" || !value) {
      LastNameInput.setFeedbackMessage("Field Required!");
      LastNameInput.setMessageType("error");
      return false;
    }

    // Check if the name starts with a number
    if (/^\d/.test(value)) {
      LastNameInput.setFeedbackMessage("Last name cannot start with a number.");
      LastNameInput.setMessageType("error");
      return false;
    }

    // Check if the name contains only letters, spaces, or hyphens (you can adjust this regex as needed)
    const nameRegex = /^[a-zA-Z\s-]+$/;
    if (!nameRegex.test(value)) {
      LastNameInput.setFeedbackMessage("Last name can only contain letters, spaces, or hyphens.");
      LastNameInput.setMessageType("error");
      return false;
    }

    // Clear feedback if everything is valid
    LastNameInput.setFeedbackMessage("");
    LastNameInput.setMessageType("none");
    return true;
  };


  // Email
  let EmailInput = useInputComponent();
  let EmailValidator = (value) => {
    // Check if the email field is empty
    if (value === "" || !value) {
      EmailInput.setFeedbackMessage("Email is required!");
      EmailInput.setMessageType("error");
      return false;
    }

    // Validate email format using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      EmailInput.setFeedbackMessage("Invalid Email Format!");
      EmailInput.setMessageType("error");
      return false;
    }

    // Clear feedback if the email is valid
    EmailInput.setFeedbackMessage("");
    EmailInput.setMessageType("none");
    return true;
  };



  // PhoneNumber
  let PhoneNumberInput = useInputComponent();
  let PhoneNumberValidator = (value) => {
    // Check if the phone number field is empty
    if (value === "" || !value) {
      PhoneNumberInput.setFeedbackMessage("Phone Number is required!");
      PhoneNumberInput.setMessageType("error");
      return false;
    }

    // Validate the phone number format (exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
      PhoneNumberInput.setFeedbackMessage("Invalid Phone Number! It must be exactly 10 digits.");
      PhoneNumberInput.setMessageType("error");
      return false;
    }

    // Clear feedback if the phone number is valid
    PhoneNumberInput.setFeedbackMessage("");
    PhoneNumberInput.setMessageType("none");
    return true;
  };


  // Password
  let PasswordInput = useInputComponent();
  let PasswordValidator = (value) => {
    // Check for empty password
    if (value === "" || !value) {
      PasswordInput.setFeedbackMessage("Password is required!");
      PasswordInput.setMessageType("error");
      return false;
    }

    // Check password length
    if (value.length < 6) {
      PasswordInput.setFeedbackMessage("Password must be at least 6 characters long!");
      PasswordInput.setMessageType("error");
      return false;
    }

    // Check for at least one uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(value)) {
      PasswordInput.setFeedbackMessage("Password must contain at least one uppercase letter!");
      PasswordInput.setMessageType("error");
      return false;
    }

    // Check for at least one lowercase letter
    const lowercaseRegex = /[a-z]/;
    if (!lowercaseRegex.test(value)) {
      PasswordInput.setFeedbackMessage("Password must contain at least one lowercase letter!");
      PasswordInput.setMessageType("error");
      return false;
    }

    // Check for at least one digit
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(value)) {
      PasswordInput.setFeedbackMessage("Password must contain at least one number!");
      PasswordInput.setMessageType("error");
      return false;
    }

    // Check for at least one special character
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(value)) {
      PasswordInput.setFeedbackMessage("Password must contain at least one special character!");
      PasswordInput.setMessageType("error");
      return false;
    }

    // If all checks pass, clear feedback and set message type to none
    PasswordInput.setFeedbackMessage("");
    PasswordInput.setMessageType("none");
    return true;
  };




  // Date of Birth (DOB)
  let DobInput = useInputComponent();
  let DobValidator = (value) => {
    if (value === "" || !value) {
      DobInput.setFeedbackMessage("Field Required!");
      DobInput.setMessageType("error");
      return false;
    }
    DobInput.setFeedbackMessage("");
    DobInput.setMessageType("none");
    return true;
  };

  const [Gender, setGender] = useState("male")

  const changegander = (type) => {
    if (type !== Gender) {
      if (Gender === "male") {
        setGender("female")
      } else {
        setGender("male")
      }
    }
    return type

  }

  const [selectRole, setSelectRole] = useState();
  const [selectRoleischeck, setSelectRoleischeck] = useState(false);
  const [RoleFeedbackMessage, setRoleFeedBackMessage] = useState({
    type: "info",
    message: "",
  });
  const RoleSelectValidater = (value) => {
    if (value === "" || !value) {
      setRoleFeedBackMessage({
        type: "error",
        message: "This field is required!",
      });
      return false;
    }
    setRoleFeedBackMessage({ type: "info", message: "" });

    return true;
  };




  const reset = () => {
    UserNameInput.reset()
    FirstNameInput.reset()
    LastNameInput.reset()
    EmailInput.reset()
    PhoneNumberInput.reset()
    PasswordInput.reset()
    DobInput.reset()
    setSelectRole()
    setSelectRoleischeck(false)
    setRoleFeedBackMessage({
      type: "info",
      message: ""
    })
  }


  useEffect(() => {
    reset()
  }, [])

  const [CreateUserResponse, CreateUserHandler] =
    useFetchAPI(
      {
        url: "/users/registeruser",
        method: "POST",
      },
      (e) => {
        NotificationAlert(
          "success",
          "User has been created successfully."
        );
        navigate("/users")
        reset()
        return e;
      },
      (e) => {
        let message =
          "Something went wrong while logging out. please try again.";
        if (typeof e?.response?.data === "string") {
          message = e?.response?.data;
        } else if (typeof e?.response?.data?.message === "string") {
          message = e?.response?.data?.message;
        }
        NotificationAlert("error", message);
      }
    );




  const [updateUserResponse, updateUserHandler] =
    useFetchAPI(
      {
        url: "/users/updateuser",
        method: "POST",
      },
      (e) => {
        NotificationAlert(
          "success",
          "User has been updated successfully."
        );
        // navigate("/users")
        reset()
        return e;
      },
      (e) => {
        let message =
          "Something went wrong while logging out. please try again.";
        if (typeof e?.response?.data === "string") {
          message = e?.response?.data;
        } else if (typeof e?.response?.data?.message === "string") {
          message = e?.response?.data?.message;
        }
        NotificationAlert("error", message);
      }
    );


  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();


    let isFirstNameValidator = FirstNameValidator(FirstNameInput.enteredValue)
    let isLastNameValidator = LastNameValidator(LastNameInput.enteredValue)
    let isEmailValidator = EmailValidator(EmailInput.enteredValue)
    let isPhoneNumberValidator = PhoneNumberValidator(PhoneNumberInput.enteredValue)
    let isPasswordValidator = PasswordValidator(PasswordInput.enteredValue)
    let isDobValidator = DobValidator(DobInput.enteredValue)
    let isUserNameValidator = UserNameValidator(UserNameInput.enteredValue)
    // let isRoleSelectValidater = RoleSelectValidater(selectRole)

    if (!isFirstNameValidator || !isLastNameValidator || !isEmailValidator ||
      !isPhoneNumberValidator || !isPasswordValidator || !isDobValidator ||
      !isUserNameValidator 
    ) {
      NotificationAlert(
        "error",
        "Please enter all information before proceeding."
      );
    } else {

      if (UserId) {
        await updateUserHandler({
          body: {
            userId: UserId,
            first_name: FirstNameInput.enteredValue,
            last_name: LastNameInput.enteredValue,
            email: EmailInput.enteredValue,
            password: PasswordInput.enteredValue,
            mobile_no: PhoneNumberInput.enteredValue,
            gender: Gender,
            dob: DobInput.enteredValue,
            roleid: "6895e5fdd39794892bd82947",
            username: UserNameInput.enteredValue,
            plant_id: currentPlant?._id
          },
        });
      } else {
        await CreateUserHandler({
          body: {
            first_name: FirstNameInput.enteredValue,
            last_name: LastNameInput.enteredValue,
            email: EmailInput.enteredValue,
            password: PasswordInput.enteredValue,
            mobile_no: PhoneNumberInput.enteredValue,
            gender: Gender,
            dob: DobInput.enteredValue,
            roleid: "6895e5fdd39794892bd82947",
            avatar: "df",
            username: UserNameInput.enteredValue,
            plant_id: currentPlant?._id
          },
        });
      }

    }

  };



  return getCompanyDetailsFetchHandler?.fetching ? <div style={{ textAlign: "center" }} > <Spinner /> </div> : <div className="w-full p-5" >
    <p className="text-lg font-semibold">{UserId ? "Update" : "Add New"} User</p>
    <p className="text-sm text-gray-500 mb-4">
      {UserId ? "Update" : "Create a new"}  user here. Click save when you’re done.
    </p>
    <form onSubmit={handleSubmit} >

      <div className="my-5 grid grid-cols-2 gap-4" >
        <div className="mb-5" >
          <InputWithAddOnMultiple
            label="User Name"
            placeholder=""
            className="loginInputs  w-full"
            value={UserNameInput.enteredValue ?? ''}
            setValue={UserNameInput.setEnteredValue}
            setIsTouched={UserNameInput.setIsTouched}
            feedbackMessage={UserNameInput.feedbackMessage}
            feedbackType={UserNameInput.messageType}
            isTouched={UserNameInput.isTouched}
            validateHandler={UserNameValidator}
            reset={UserNameInput.reset}
            extraProps={{ style: { height: "32px" } }}
            onBlurAction={(e) => { return e }}
            isRequired={true}
            disabled={false}
          />
        </div>
        <div className="mb-5" >
          <InputWithAddOnMultiple
            label="First Name"
            placeholder=""
            className="loginInputs  w-full"
            value={FirstNameInput.enteredValue ?? ''}
            setValue={FirstNameInput.setEnteredValue}
            setIsTouched={FirstNameInput.setIsTouched}
            feedbackMessage={FirstNameInput.feedbackMessage}
            feedbackType={FirstNameInput.messageType}
            isTouched={FirstNameInput.isTouched}
            validateHandler={FirstNameValidator}
            reset={FirstNameInput.reset}
            extraProps={{ style: { height: "32px" } }}
            onBlurAction={(e) => { return e }}
            isRequired={true}
            disabled={false}
          />
        </div>

        <div className="mb-5" >
          <InputWithAddOnMultiple
            label="Last Name"
            placeholder=""
            className="loginInputs w-full"
            value={LastNameInput.enteredValue ?? ''}
            setValue={LastNameInput.setEnteredValue}
            setIsTouched={LastNameInput.setIsTouched}
            feedbackMessage={LastNameInput.feedbackMessage}
            feedbackType={LastNameInput.messageType}
            isTouched={LastNameInput.isTouched}
            validateHandler={LastNameValidator}
            reset={LastNameInput.reset}
            extraProps={{ style: { height: "32px" } }}
            onBlurAction={(e) => { return e }}
            isRequired={true}
            disabled={false}
          />
        </div>
        <div className="mb-5" >
          <InputWithAddOnMultiple
            label="Email"
            placeholder=""
            className="loginInputs w-full"
            value={EmailInput.enteredValue ?? ''}
            setValue={EmailInput.setEnteredValue}
            setIsTouched={EmailInput.setIsTouched}
            feedbackMessage={EmailInput.feedbackMessage}
            feedbackType={EmailInput.messageType}
            isTouched={EmailInput.isTouched}
            validateHandler={EmailValidator}
            reset={EmailInput.reset}
            extraProps={{ style: { height: "32px" } }}
            onBlurAction={(e) => { return e }}
            isRequired={true}
            disabled={false}
          />
        </div>


        <div className="mb-5" >
          <DateTimeInputMultiple
            label="Date of Birth"
            className="datetime-input-format-type-1"
            value={DobInput.enteredValue ?? ''}
            setValue={DobInput.setEnteredValue}
            setIsTouched={DobInput.setIsTouched}
            feedbackMessage={DobInput.feedbackMessage}
            feedbackType={DobInput.messageType}
            isTouched={DobInput.isTouched}
            validateHandler={DobValidator}
            reset={DobInput.reset}
            dateFormat={"YYYY-MM-DD"}
            timeFormat={false}
            extraProps={{ style: { width: "100%", height: "32px" } }}
            heightClass="small"
            isRequired={true}
            inputProps={{
              placeholder: "YYYY-MM-DD",
            }}
            onBlurAction={(e) => {
              return e

            }}
            momentFormat={"YYYY-MM-DD"}
          />

        </div>


        {/* <div className="mb-5" >
          <InputSelect
            setValue={setSelectRole}
            label="Select Role"
            value={selectRole}
            options={getRoleResponse?.data}
            isTouched={selectRoleischeck}
            setIsTouched={setSelectRoleischeck}
            labelClassName="text-weight-bold h6"
            className="py-1 "
            isRequired={true}
            feedbackMessage={RoleFeedbackMessage?.message}
            feedbackType={RoleFeedbackMessage?.type}
            validateHandler={RoleSelectValidater}
          />
        </div> */}
        <div className="mb-5" >
          <InputWithAddOnMultiple
            label="Phone Number"
            placeholder=""
            className="loginInputs w-full"
            value={PhoneNumberInput.enteredValue ?? ''}
            setValue={PhoneNumberInput.setEnteredValue}
            setIsTouched={PhoneNumberInput.setIsTouched}
            feedbackMessage={PhoneNumberInput.feedbackMessage}
            feedbackType={PhoneNumberInput.messageType}
            isTouched={PhoneNumberInput.isTouched}
            validateHandler={PhoneNumberValidator}
            reset={PhoneNumberInput.reset}
            extraProps={{ style: { height: "32px" } }}
            onBlurAction={(e) => { return e }}
            isRequired={true}
            disabled={false}
          />
        </div>
        <div className="mb-5" >
          <InputWithAddOnMultiple
            label="Password"
            placeholder=""
            className="loginInputs w-full"
            value={PasswordInput.enteredValue ?? ''}
            setValue={PasswordInput.setEnteredValue}
            setIsTouched={PasswordInput.setIsTouched}
            feedbackMessage={PasswordInput.feedbackMessage}
            feedbackType={PasswordInput.messageType}
            isTouched={PasswordInput.isTouched}
            validateHandler={PasswordValidator}
            reset={PasswordInput.reset}
            extraProps={{ style: { height: "32px" } }}
            onBlurAction={(e) => { return e }}
            isRequired={true}
            disabled={false}
          />
        </div>

        <div className="mb-6" >
          <Label style={{ fontSize: "0.9rem" }} >Gender</Label>
          <div className="grid grid-cols-8  mt-2  " >
            <div>
              <CheckboxInput
                setChecked={() => { changegander("male") }}
                check={Gender === "male"}
                label={"Male"}
                id={"male_gender"}
              />
            </div>
            <div>
              <CheckboxInput
                setChecked={() => {
                  changegander("female")
                }}
                check={Gender === "female"}
                label={"Female"}
                id={"female_gender"}
              />
            </div>

          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button 
        onClick={() => { navigate("/users") }} 
        type="button" className="px-4 mb-5 border rounded">Cancel</button>

        <button
          type="submit"
          className="px-4 mb-5 bg-black text-white text-[16px] font-bold rounded disabled:opacity-50"
        >
          Save changes
        </button>
      </div>
    </form>
  </div>


}
