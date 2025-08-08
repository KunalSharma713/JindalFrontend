import useFetchAPI from "../../hooks/useFetchAPI";
import useInputComponent from "../../hooks/useInputComponent"
import InputWithAddOnMultiple from "../../components/forminputs/InputWithAddOnMultiple"
import { useLocation, useNavigate } from "react-router-dom";
import NotificationAlert from "../../hooks/NotificationAlert";

import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { State, City } from 'country-state-city';
import InputSelect from "../../components/forminputs/Select/InputSelect"
import { SetPlantsAction } from "../../store/slices/LoginSlice";
import { useDispatch } from "react-redux";

export function AddPlant() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [PlantId, setPlantId] = useState(null)
    useEffect(() => {
        const match = location?.pathname?.match(/:([a-f0-9]{24})/);
        if (match) {
            setPlantId(match[1])
        } else {
            setPlantId(null)
        }

    }, [location])

    const [getPlantDetailsFetchHandler, getPlantFetchHandler] = useFetchAPI(
        {
            url: `/plant/${PlantId}`,
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
        if (getPlantDetailsFetchHandler?.data) {
            let plant = getPlantDetailsFetchHandler?.data?.plant
            Name.setEnteredValue(plant?.name)
            PinCode.setEnteredValue(plant?.pin_code)

            setSelectedState(plant?.state)
            setSelectedCity(plant?.city)

        }
    }, [getPlantDetailsFetchHandler?.data])


    useEffect(() => {
        if (PlantId !== null) {
            getPlantFetchHandler()
        }
    }, [PlantId])

    // CompanyName
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
            navigate("/plants")

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


    const [UpdatePlantResponse, UpdatePlantHandler] =
        useFetchAPI(
            {
                url: "/plant",
                method: "POST",
            },
            (e) => {
                NotificationAlert(
                    "success",
                    "Plant has been updated successfully."
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

            if (PlantId) {

                await UpdatePlantHandler({
                    body: {
                        "name": Name?.enteredValue,
                        "city": selectedCity,
                        "state": selectedState,
                        "pin_code": PinCode?.enteredValue,
                        "plantId": PlantId ?? ''
                    },
                });
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


    return getPlantDetailsFetchHandler?.fetching ? <div style={{ textAlign: "center" }}> <Spinner /> </div> : <div className="w-full p-5" >
        <p className="text-lg font-semibold"> {PlantId ? "Edit" : "Add New"} Plant</p>
        <p className="text-sm text-gray-500 mb-4">
            {PlantId ? "Edit" : "Create a new"} Plant here. Click save when you’re done.
        </p>
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
                <button onClick={() => { navigate("/plants") }} type="button" className="px-4 mb-5 border rounded">Cancel</button>

                <button
                    type="submit"
                    disabled={UpdatePlantResponse?.fetching || CreatePlantResponse?.fetching}
                    className="px-4 mb-5 bg-black text-white text-[16px] font-bold rounded disabled:opacity-50"
                >
                    {PlantId ? "Update" : "Save changes"}
                </button>
            </div>
        </form>
    </div>
}
