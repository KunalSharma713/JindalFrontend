import useFetchAPI from "../../hooks/useFetchAPI";
import useInputComponent from "../../hooks/useInputComponent"
import InputWithAddOnMultiple from "../../components/forminputs/InputWithAddOnMultiple"
import { useLocation, useNavigate } from "react-router-dom";
import NotificationAlert from "../../hooks/NotificationAlert";
import CheckboxInput from "../../components/forminputs/CheckboxInput"
import DateTimeInputMultiple from "../../components/date-time/DateTimeInputMultiple";
import { Label } from "reactstrap";
import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { Country, State, City } from 'country-state-city';
import InputSelect from "../../components/forminputs/Select/InputSelect"
import uuid from "react-uuid";
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "../../components/ui/button";
import ThemeDataTable1 from "../../components/data-table/ThemeDataTable1";
import moment from "moment";

export function AddCompany() {
    const navigate = useNavigate();
    const location = useLocation();


    // USER DEATAILS
    const [users, setusers] = useState([])
    const [isModalOpen, setisModalOpen] = useState(false)


    // COMPANY INFORMATION ID
    const [CompanyId, setCompanyId] = useState(null)
    useEffect(() => {
        const match = location?.pathname.match(/:([a-f0-9]{24})/);
        if (match) {
            setCompanyId(match[1])
        } else {
            setCompanyId(null)
        }

    }, [location])

    const [getCompanyDetailsFetchHandler, getCompanyFetchHandler] = useFetchAPI(
        {
            url: `/company/${CompanyId}`,
            method: "GET",
            authRequired: true,

        },
        (e) => {
            if ((e?.user ?? [])?.length > 0) {
                setusers(e?.user)
            }
            return e;
        },
        (e) => {
            return e?.response ?? true;
        }
    );

    useEffect(() => {
        if (getCompanyDetailsFetchHandler?.data) {
            let company = getCompanyDetailsFetchHandler?.data?.transport_company
            CompanyNameInput.setEnteredValue(company?.company_name)
            SapIDInput.setEnteredValue(company?.sap_id)

            setSelectedState(company?.state)
            setSelectedCity(company?.city)
        }
    }, [getCompanyDetailsFetchHandler?.data])


    useEffect(() => {
        if (CompanyId !== null) {
            getCompanyFetchHandler()
        }
    }, [CompanyId])

    // CompanyName
    let CompanyNameInput = useInputComponent();
    let CompanyNameValidator = (value) => {
        if (value === "" || !value) {
            CompanyNameInput.setFeedbackMessage("Field Required!");
            CompanyNameInput.setMessageType("error");
            return false;
        }
        CompanyNameInput.setFeedbackMessage("");
        CompanyNameInput.setMessageType("none");
        return true;
    };


    let SapIDInput = useInputComponent();
    let SapIDValidator = (value) => {
        if (value === "" || !value) {
            SapIDInput.setFeedbackMessage("Field Required!");
            SapIDInput.setMessageType("error");
            return false;
        }
        SapIDInput.setFeedbackMessage("");
        SapIDInput.setMessageType("none");
        return true;
    };




    const reset = () => {
        CompanyNameInput.reset()
        SapIDInput.reset()

        setSelectedState()
        setselectedStateischeck(false)
        setStateFeedBackMessage({
            type: "info",
            message: "",
        })

        setSelectedCity()
        setselectedCityischeck(false)
        setCityFeedBackMessage({
            type: "info",
            message: "",
        })

    }

    useEffect(() => {
        reset()
    }, [])

    const [CreateCompanyResponse, CreateCompanyHandler] = useFetchAPI(
        {
            url: "/company/create",
            method: "POST",
        },
        (e) => {
            NotificationAlert(
                "success",
                "Transport Vendor has been created successfully."
            );
            navigate("/companies")
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


    const [UpdateCompanyResponse, UpdateCompanyHandler] = useFetchAPI(
        {
            url: "/company/update",
            method: "POST",
        },
        (e) => {
            NotificationAlert(
                "success",
                "Transport Vendor has been updated successfully."
            );
            navigate("/companies")
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



    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);


    const [selectedState, setSelectedState] = useState('');
    const [selectedStateischeck, setselectedStateischeck] = useState(false);
    const [StateFeedbackMessage, setStateFeedBackMessage] = useState({
        type: "info",
        message: "",
    });
    const StateSelectValidater = (value) => {
        if (value === "" || !value) {
            setStateFeedBackMessage({
                type: "error",
                message: "This field is required!",
            });
            return false;
        }
        setStateFeedBackMessage({ type: "info", message: "" });

        return true;
    };


    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCityischeck, setselectedCityischeck] = useState(false);
    const [CityFeedbackMessage, setCityFeedBackMessage] = useState({
        type: "info",
        message: "",
    });
    const CitySelectValidater = (value) => {
        if (value === "" || !value) {
            setCityFeedBackMessage({
                type: "error",
                message: "This field is required!",
            });
            return false;
        }
        setCityFeedBackMessage({ type: "info", message: "" });

        return true;
    };

    useEffect(() => {
        setStates(State.getStatesOfCountry("IN"));
        setSelectedState(''); // Reset the state selection when country changes
        setCities([]); // Reset cities
    }, []);


    useEffect(() => {
        if (selectedState) {
            // Get cities for the selected state
            setCities(City.getCitiesOfState("IN", selectedState));
            // setSelectedCity(''); // Reset city selection when state changes
        }
    }, [selectedState]);






    const closeModal = () => {
        setisModalOpen(!isModalOpen)
    }
    const [customColumns, setCustomColumns] = useState([]);

    const [savedTableColumns, setSavedTableColumns] = useState([
        { name: "ACTION", key: "action" },
        { name: "USERNAME", key: "username" },
        { name: "FIRST NAME", key: "first_name" },
        { name: "TLAST NAME", key: "last_name" },
        { name: "EMAIL", key: "email" },
        { name: "PASSWORD", key: "password" },
        { name: "MOBILE NUMBER", key: "mobile_no" },
        { name: "DATE OF BIRTH", key: "dob" },
        { name: "GENDER", key: "gender" }
    ]);


    const [usermodelopenid, setusermodelopenid] = useState(null)
    const [type, setype] = useState(null)

    const addnewuser = () => {
        if (users?.length < 4) {

            let id = uuid();
            setusermodelopenid(id)
            setusers([...users, {
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                mobile_no: "",
                gender: "",
                dob: "",
                avatar: "",
                username: "",
                _id: id,
                type: "new"
            }])
            closeModal()
            setype("add")
        }
    }



    // Remove only selected user or mark user as deleted based on type
    const removeuser = (idToRemove, type) => {
        if (!idToRemove) {
            console.warn("No user ID provided for removal.");
            return;
        }

        setusers((prevUsers) =>
            prevUsers?.map((user) => {
                // If `type` is present and equals "new", remove the user from the listing
                if (type === "new") {
                    if (String(user?._id).trim() === String(idToRemove).trim()) {
                        console.log("Removed user:", user);
                        return null; // Remove this user
                    }
                }
                // If `type` is not "new" or `type` is absent, mark the user as deleted
                else {
                    if (String(user?._id).trim() === String(idToRemove).trim()) {
                        return { ...user, isdelete: true }; // Mark the user as deleted
                    }
                }
                return user; // Return user if not removed or marked as deleted
            }).filter(user => user !== null) // Filter out any null values (removed users)
        );
    };



    useEffect(() => {
        setCustomColumns(
            (savedTableColumns ?? []).map((obj) => {

                return {
                    name: obj?.name?.toUpperCase(),
                    selector: (row) => {
                        switch (obj?.key) {
                            case "action":
                                return (
                                    <>
                                        <span
                                            onClick={() => {
                                                setusermodelopenid(row["_id"]);
                                                closeModal();
                                                setype("update");
                                            }}
                                            className="small cursor-pointer"
                                            style={{ marginRight: '10px' }}
                                        >
                                            Edit
                                        </span>
                                        <span
                                            onClick={() => {
                                                if (row["type"] == "new") {
                                                    removeuser(row["_id"], "new")
                                                } else {
                                                    removeuser(row["_id"], "")
                                                }
                                            }}
                                            className="text-sm cursor-pointer text-red-600"
                                        >
                                            Remove
                                        </span>
                                    </>
                                );

                            case "dob":
                                return moment(row[obj?.key]).format("YYYY-MM-DD")

                            default:
                                return (
                                    <span>
                                        {
                                            row[obj?.key] == null ||
                                                row[obj?.key] == "" ||
                                                row[obj?.key] == undefined
                                                ? ""
                                                : row[obj?.key]
                                        }
                                    </span >
                                );
                        }
                    },

                    sortable: false,
                    minWidth: () => {
                        if (obj?.key === "name") {
                            return "250px"
                        }
                        if (obj?.key === "actions") {
                            return "100px"
                        }
                        let width = "200px";
                        return width;
                    },
                };
            })
        );
    }, [savedTableColumns]);



    // Handle Submit 
    const handleSubmit = async (e) => {
        e.preventDefault();

        let isCompanyNameValidator = CompanyNameValidator(CompanyNameInput.enteredValue)
        let isSapIDValidator = SapIDValidator(SapIDInput.enteredValue)

        let isStateSelectValidater = StateSelectValidater(selectedState)
        let isCitySelectValidater = CitySelectValidater(selectedCity)



        if (users?.length == 0) {
            NotificationAlert(
                "error",
                "Please add at least one user before proceeding."
            );
        } else {
            if (!isCompanyNameValidator || !isStateSelectValidater || !isCitySelectValidater || !isSapIDValidator
            ) {
                NotificationAlert(
                    "error",
                    "Please enter all information before proceeding."
                );
            } else {

                if (CompanyId) {
                    await UpdateCompanyHandler({
                        body: {
                            company_id: CompanyId,
                            company_name: CompanyNameInput.enteredValue,
                            sap_id: SapIDInput.enteredValue,

                            city: selectedCity,
                            state: selectedState,
                            country: "IN",
                            users: users

                        },
                    });
                } else {

                    await CreateCompanyHandler({
                        body: {
                            company_name: CompanyNameInput.enteredValue,
                            sap_id: SapIDInput.enteredValue,
                            city: selectedCity,
                            state: selectedState,
                            country: "IN",
                            users: users
                        },
                    });
                }


            }

        }


    };
    return getCompanyDetailsFetchHandler?.fetching ? <div style={{ textAlign: "center" }}> <Spinner /> </div> : <div className="w-full p-5" >
        <p className="text-lg font-semibold"> {CompanyId ? "Edit" : "Add New"} Transport Vendor</p>
        <p className="text-sm text-gray-500 mb-4">
            {CompanyId ? "Edit" : "Create a new"} Transport Vendor here. Click save when you’re done.
        </p>
        <form onSubmit={handleSubmit} >

            <div className="my-5 grid grid-cols-2 gap-4" >

                <div className="mb-3" >
                    <InputWithAddOnMultiple
                        label="Transport Vendor Name"
                        placeholder=""
                        className="loginInputs  w-full"
                        value={CompanyNameInput.enteredValue ?? ''}
                        setValue={CompanyNameInput.setEnteredValue}
                        setIsTouched={CompanyNameInput.setIsTouched}
                        feedbackMessage={CompanyNameInput.feedbackMessage}
                        feedbackType={CompanyNameInput.messageType}
                        isTouched={CompanyNameInput.isTouched}
                        validateHandler={CompanyNameValidator}
                        reset={CompanyNameInput.reset}
                        extraProps={{ style: { height: "32px" } }}
                        onBlurAction={(e) => { return e }}
                        isRequired={true}
                        disabled={false}
                    />
                </div>

                <div className="mb-3" >
                    <InputWithAddOnMultiple
                        label="Sap ID"
                        placeholder=""
                        className="loginInputs  w-full"
                        value={SapIDInput.enteredValue ?? ''}
                        setValue={SapIDInput.setEnteredValue}
                        setIsTouched={SapIDInput.setIsTouched}
                        feedbackMessage={SapIDInput.feedbackMessage}
                        feedbackType={SapIDInput.messageType}
                        isTouched={SapIDInput.isTouched}
                        validateHandler={SapIDValidator}
                        reset={SapIDInput.reset}
                        extraProps={{ style: { height: "32px" } }}
                        onBlurAction={(e) => { return e }}
                        isRequired={true}
                        disabled={false}
                    />
                </div>



                <div className="mb-3" >
                    <InputSelect
                        setValue={setSelectedState}
                        label="Select State"
                        value={selectedState}
                        options={states?.map((item) => {
                            return {
                                value: item?.isoCode,
                                label: item?.name
                            }
                        })}
                        isTouched={selectedStateischeck}
                        setIsTouched={setselectedStateischeck}
                        labelClassName="text-weight-bold h6"
                        className="py-1 "
                        isRequired={true}
                        feedbackMessage={StateFeedbackMessage?.message}
                        feedbackType={StateFeedbackMessage?.type}
                        validateHandler={StateSelectValidater}
                    />
                </div>


                <div className="mb-3" >
                    <InputSelect
                        setValue={setSelectedCity}
                        label="Select City"
                        value={selectedCity}
                        options={(cities ?? [])?.map((item) => {
                            return {
                                value: item?.name,
                                label: item?.name
                            }
                        }) ?? []}
                        isTouched={selectedCityischeck}
                        setIsTouched={setselectedCityischeck}
                        labelClassName="text-weight-bold h6"
                        className="py-1 "
                        isRequired={true}
                        feedbackMessage={CityFeedbackMessage?.message}
                        feedbackType={CityFeedbackMessage?.type}
                        validateHandler={CitySelectValidater}
                    />
                </div>




            </div>


            <div className="flex justify-between items-center mb-3 mt-4 sm:flex-row sm:justify-between sm:items-center" >
                <div>
                    <p className="text-lg font-semibold"> {CompanyId ? "Edit" : "Add"} User</p>
                    <p className="text-sm text-gray-500 mb-4">
                        {CompanyId ? "Edit user" : "Create a new user"} here and connect with Transport Vendor.
                    </p>
                </div>

                {users?.length < 4 && <div>
                    <Button onClick={addnewuser} type="button" className="sm-w-[100%]">
                        Add Transport Vendor User
                    </Button>
                </div>}
            </div>



            <ThemeDataTable1
                dataRows={users?.filter((item) => !item?.isdelete)}
                listComponent={customColumns}
            />

            <Munshiuser
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                CompanyId={CompanyId}
                usermodelopenid={usermodelopenid}
                setusers={setusers}
                users={users}
                type={type}
            />


            <div className="flex justify-end space-x-2 my-3">
                <button onClick={() => { navigate("/companies") }} type="button" className="px-4 mb-3 border rounded">Cancel</button>

                <button
                    type="submit"
                    disabled={UpdateCompanyResponse?.fetching || CreateCompanyResponse?.fetching}
                    className="px-4 mb-3 bg-black text-white text-[16px] font-bold rounded disabled:opacity-50"
                >
                    {CompanyId ? "Update" : "Save changes"}
                </button>
            </div>
        </form>
    </div>
}






const Munshiuser = ({ isModalOpen, closeModal, CompanyId, usermodelopenid, users, setusers, type }) => {





    // add user details 

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



    const reset = () => {

        UserNameInput.reset()
        FirstNameInput.reset()
        LastNameInput.reset()
        EmailInput.reset()
        PhoneNumberInput.reset()
        PasswordInput.reset()
        DobInput.reset()

    }

    useEffect(() => {
        let user = users?.find((item) => item?._id == usermodelopenid)
        FirstNameInput.setEnteredValue(user?.first_name ?? "")
        LastNameInput.setEnteredValue(user?.last_name ?? "")
        EmailInput.setEnteredValue(user?.email ?? "")
        PasswordInput.setEnteredValue(user?.password ?? "")
        PhoneNumberInput.setEnteredValue(user?.mobile_no ?? "")
        DobInput.setEnteredValue(user?.dob ?? "")
        UserNameInput.setEnteredValue(user?.username ?? "")
        setGender(user?.gender)

    }, [isModalOpen])

    const updateUserDetails = () => {


        let isFirstNameValidator = FirstNameValidator(FirstNameInput.enteredValue)
        let isLastNameValidator = LastNameValidator(LastNameInput.enteredValue)
        let isEmailValidator = EmailValidator(EmailInput.enteredValue)
        let isPhoneNumberValidator = PhoneNumberValidator(PhoneNumberInput.enteredValue)
        let isPasswordValidator = PasswordValidator(PasswordInput.enteredValue)
        let isDobValidator = DobValidator(DobInput.enteredValue)
        let isUserNameValidator = UserNameValidator(UserNameInput.enteredValue)



        if (
            !isFirstNameValidator || !isLastNameValidator || !isEmailValidator ||
            !isPhoneNumberValidator || !isPasswordValidator || !isDobValidator || !isUserNameValidator || !Gender
        ) {
            NotificationAlert(
                "error",
                "Please enter all information before proceeding."
            );
        } else {
            setusers(
                (users ?? [])?.map(item =>
                    item?._id === usermodelopenid
                        ? {
                            ...item,
                            first_name: FirstNameInput.enteredValue,
                            last_name: LastNameInput.enteredValue,
                            email: EmailInput.enteredValue,
                            password: PasswordInput.enteredValue,
                            mobile_no: PhoneNumberInput.enteredValue,
                            gender: Gender,
                            dob: DobInput.enteredValue,
                            avatar: "",
                            username: UserNameInput.enteredValue
                        }
                        : item
                )
            );
            reset()
            closeModal()
        }

    };



    const cancelmodel = () => {
        if (type == "add") {
            setusers((users ?? [])?.filter(item => item?._id != usermodelopenid));
        }
        closeModal()
        reset()
    }


    return (
        <Dialog.Root open={isModalOpen} >
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="dialog-content !max-w-[70%] !min-w-[70%]  !max-g-[90%] !min-g-[90%] !h-[90%] !left-[15%]  !top-[15%]  !p-0">
                <div className="my-2 p-4 ">
                    <div>
                        <p className="text-lg font-semibold"> {type == "add" ? "Add" : "Edit"} User</p>
                        <p className="text-sm text-gray-500 mb-4">
                            {CompanyId ? "Edit user" : "Create a new user"} here and connect with Transport Vendor.
                        </p>
                    </div>

                    <div className="my-5 grid grid-cols-2 gap-4 " >
                        <div className="mb-3" >
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
                            />
                        </div>
                        <div className="mb-3" >
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

                        <div className="mb-3" >
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
                        <div className="mb-3" >
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






                        <div className="mb-3" >
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
                        <div className="mb-3" >
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


                        <div className="mb-3" >
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
                                onBlurAction={(e) => { return e }}

                                momentFormat={"YYYY-MM-DD"}
                            />

                        </div>
                        <div className="mb-3" >
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
                    <div className="float-right" >

                        <Button type="button" onClick={() => {
                            cancelmodel()
                        }}
                            className="sm-w-[100%] mx-2 bg-green-800">
                            Cancel
                        </Button>

                        <Button type="button" onClick={() => updateUserDetails()} className="sm-w-[100%]">
                            Update
                        </Button>
                    </div>

                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
}
