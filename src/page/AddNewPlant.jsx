import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PlantSelectionAction, SetPlantsAction } from "../store/slices/LoginSlice";
import useFetchAPI from "../hooks/useFetchAPI";
import { useNavigate } from "react-router-dom";

import "./LoginUser.css"; // Import your new CSS for the background
import useInputComponent from "../hooks/useInputComponent";
import { City, State } from "country-state-city";
import NotificationAlert from "../hooks/NotificationAlert";
import InputWithAddOnMultiple from "../components/forminputs/InputWithAddOnMultiple";
import InputSelect from "../components/forminputs/Select/InputSelect";

export function AddNewPlant() {
    const dispatch = useDispatch();
    const navigate = useNavigate();





    const reset = () => {
        Name.reset()
        PinCode.reset()

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

    const [PlantsFetchResponse, PlantsFetchHandler] = useFetchAPI(
        {
            url: `/plant`,
            method: "GET"
        },
        (e) => {
            dispatch(SetPlantsAction(e?.Plant));
            dispatch(PlantSelectionAction(e?.Plant?.[0]));
            console.log(e?.Plant);
            
            navigate("/users")

            return e;
        },
        (e) => {
            return e?.response ?? true;
        }
    );


    const [CreatePlantResponse, CreatePlantHandler] =
        useFetchAPI(
            {
                url: "/plant",
                method: "POST",
            },
            (e) => {
                NotificationAlert(
                    "success",
                    "Plant has been created successfully."
                );
                reset()
                PlantsFetchHandler()

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

    let Name = useInputComponent();
    let NameValidator = (value) => {
        if (value === "" || !value) {
            Name.setFeedbackMessage("Field Required!");
            Name.setMessageType("error");
            return false;
        }
        Name.setFeedbackMessage("");
        Name.setMessageType("none");
        return true;
    };


    let PinCode = useInputComponent();
    let PinCodeValidator = (value) => {
        if (value === "" || !value) {
            PinCode.setFeedbackMessage("Field Required!");
            PinCode.setMessageType("error");
            return false;
        }
        PinCode.setFeedbackMessage("");
        PinCode.setMessageType("none");
        return true;
    };



    // Handle Submit 
    const handleSubmit = async (e) => {
        e.preventDefault();

        let isNameValidator = NameValidator(Name.enteredValue)
        let isPinCodeValidator = PinCodeValidator(PinCode.enteredValue)
        let isStateSelectValidater = StateSelectValidater(selectedState)
        let isCitySelectValidater = CitySelectValidater(selectedCity)




        if (!isNameValidator || !isStateSelectValidater || !isCitySelectValidater || !isPinCodeValidator
        ) {
            NotificationAlert(
                "error",
                "Please enter all information before proceeding."
            );
        } else {


            await CreatePlantHandler({
                body: {
                    "name": Name?.enteredValue,
                    "city": selectedCity,
                    "state": selectedState,
                    "pin_code": PinCode?.enteredValue

                },
            });



        }

    };


    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('IN');

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
        if (selectedCountry) {
            // Get states for the selected country
            setStates(State?.getStatesOfCountry(selectedCountry));
            setSelectedState(''); // Reset the state selection when country changes
            setCities([]); // Reset cities
        }
    }, []);


    useEffect(() => {
        if (selectedState) {
            // Get cities for the selected state
            setCities(City?.getCitiesOfState(selectedCountry, selectedState));
            // setSelectedCity(''); // Reset city selection when state changes
        }
    }, [selectedState]);

    console.log('///////////////////////////////');


    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">

            {/* Background Image */}
            <div className="plant-selector-background "></div>

            {/* Centered selection box */}
            <div className="flex flex-col items-center justify-center flex-1 px-4 z-10">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-xl min-h-[250px] flex flex-col justify-center">
                    <h2 className="text-xl font-semibold mb-1 text-center">Add Plant</h2>
                    <p className="text-gray-600 text-center mb-4">to continue to your account</p>

                    <form onSubmit={handleSubmit} >

                        <div className="my-5 grid grid-cols-2 gap-4" >

                            <div className="mb-5" >
                                <InputWithAddOnMultiple
                                    label="Name"
                                    placeholder=""
                                    className="loginInputs  w-full"
                                    value={Name.enteredValue ?? ''}
                                    setValue={Name.setEnteredValue}
                                    setIsTouched={Name.setIsTouched}
                                    feedbackMessage={Name.feedbackMessage}
                                    feedbackType={Name.messageType}
                                    isTouched={Name.isTouched}
                                    validateHandler={NameValidator}
                                    reset={Name.reset}
                                    extraProps={{ style: { height: "32px" } }}
                                    onBlurAction={(e) => { return e }}
                                    isRequired={true}
                                    disabled={false}
                                />
                            </div>

                            <div className="mb-5" >
                                <InputWithAddOnMultiple
                                    label="Pin Code"
                                    placeholder=""
                                    className="loginInputs  w-full"
                                    value={PinCode.enteredValue ?? ''}
                                    setValue={PinCode.setEnteredValue}
                                    setIsTouched={PinCode.setIsTouched}
                                    feedbackMessage={PinCode.feedbackMessage}
                                    feedbackType={PinCode.messageType}
                                    isTouched={PinCode.isTouched}
                                    validateHandler={PinCodeValidator}
                                    reset={PinCode.reset}
                                    extraProps={{ style: { height: "32px" } }}
                                    onBlurAction={(e) => { return e }}
                                    isRequired={true}
                                    disabled={false}
                                />
                            </div>


                            <div className="mb-5" >
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


                            <div className="mb-5" >
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

                        <div className="flex justify-end space-x-2">

                            <button
                                type="submit"

                                className={`mt-4 w-full py-2 rounded text-white font-semibold  
                                   bg-[#1f2221] text-white border-none  
                                     `}
                            >
                                Save changes
                            </button>

                        </div>
                    </form>




                </div>
            </div>
        </div>
    );
}
