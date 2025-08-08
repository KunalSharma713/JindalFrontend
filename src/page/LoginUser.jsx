
// Custom Hooks
import useInputComponent from "../hooks/useInputComponent";
import useFetchAPI from "../hooks/useFetchAPI";
// Components
import InputWithAddOn from "../components/forminputs/InputWithAddOn";
// React & Redux imports
import { useNavigate } from "react-router-dom";
import { Form } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { LoginAction } from "../store/slices/LoginSlice";

import "./LoginUser.css"; // Import the CSS
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Example icons from react-icons


import logo from "../assets/img/storelogo.png";
import NotificationAlert from "../hooks/NotificationAlert";


const LoginUser = () => {
    // Access login status from Redux store
    const { IsLoggedIn } = useSelector((state) => state.LoginReducer);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (IsLoggedIn) {
            // navigate("/users")
        }
    }, [IsLoggedIn])

    // Toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Email input with validation
    const EmailInput = useInputComponent();
    let EmailValidator = (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
            EmailInput.setFeedbackMessage("Invalid Email Format!");
            EmailInput.setMessageType("error");
            return false;
        }
        EmailInput.setFeedbackMessage("");
        EmailInput.setMessageType("none");
        return true;
    };

    // Password input with validation
    const PasswordInput = useInputComponent();
    let PasswordValidator = (value) => {
        if (value.length < 6) {
            PasswordInput.setFeedbackMessage("Password must be at least 6 characters!");
            PasswordInput.setMessageType("error");
            return false;
        }
        PasswordInput.setFeedbackMessage("");
        PasswordInput.setMessageType("none");
        return true;
    };

    // Login API handler
    const [LoginFetchResponse, LoginFetchHandler] = useFetchAPI(
        {
            url: `/users/login`,
            method: "POST"
        },
        (e) => {
            dispatch(
                LoginAction({
                    email: EmailInput.enteredValue,
                    accessToken: e?.accessToken,
                    refreshToken: e?.refreshToken,
                    user: e?.user
                })
            );
            navigate("/users")


            return e;
        },
        (e) => {

            NotificationAlert(
                "error", e?.message
            );
            return e?.response ?? true;
        }
    );


    // Form submission handler
    const SubmitHandler = (e) => {
        e.preventDefault();
        console.log("dfgdg");

        let isEmailValidator = EmailValidator(EmailInput.enteredValue)
        let isPasswordValidator = PasswordValidator(PasswordInput.enteredValue)

        if (!isEmailValidator || !isPasswordValidator) {
            console.log("wrong EmailInput and password")
        } else {


            LoginFetchHandler({
                body: {
                    email: EmailInput.enteredValue.toLowerCase(),
                    password: PasswordInput.enteredValue,
                    role_type: "admin"
                }
            })
        }

    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img style={{ width: "200px", marginLeft: "40px" }} src={logo} />
                <h2 className="mb-5 font-bold" >Plate Storage & Pickup Admin Panel</h2>
                <Form className="login-form mt-5" onSubmit={SubmitHandler}>
                    <InputWithAddOn
                        name="EmailInput"
                        id="EmailInput"
                        placeholder=""
                        className="login-input"
                        value={EmailInput.enteredValue}
                        setValue={EmailInput.setEnteredValue}
                        setIsTouched={EmailInput.setIsTouched}
                        feedbackMessage={EmailInput.feedbackMessage}
                        feedbackType={EmailInput.messageType}
                        isTouched={EmailInput.isTouched}
                        reset={EmailInput.reset}
                        label="Email ID"
                        validateHandler={EmailValidator}

                    />
                    <InputWithAddOn
                        name="Password"
                        id="Password"
                        placeholder=""
                        className="login-input"
                        type={showPassword ? "text" : "password"}
                        value={PasswordInput.enteredValue}
                        setValue={PasswordInput.setEnteredValue}
                        setIsTouched={PasswordInput.setIsTouched}
                        feedbackMessage={PasswordInput.feedbackMessage}
                        feedbackType={PasswordInput.messageType}
                        isTouched={PasswordInput.isTouched}
                        reset={PasswordInput.reset}
                        label="Password"
                        validateHandler={PasswordValidator}
                        hasAddOn={{
                            right: showPassword ? (
                                <FaEyeSlash
                                    className="input_addon_icon_right"
                                    onClick={() => {
                                        setShowPassword(false);
                                    }}
                                />
                            ) : (
                                <FaEye
                                    className="input_addon_icon_right"
                                    onClick={() => {
                                        setShowPassword(true);
                                    }}
                                />
                            ),
                        }}
                    />
                    <div className="login-button-wrapper">
                        <button className="login-button" type="submit">
                            Login
                        </button>
                    </div>
                </Form>
            </div>
            {<div className="login-right">

                <div className="login-rig   ">
                    {/* <p className="small-text">Logging in is quick and easy!</p>
                    <h3>
                        Need help with your account? <br />
                        We're here to assist you.
                    </h3> */}

                </div>
            </div>}
        </div>
    );
};

export default LoginUser;
