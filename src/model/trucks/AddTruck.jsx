import useFetchAPI from "../../hooks/useFetchAPI";
import useInputComponent from "../../hooks/useInputComponent";
import { useNavigate, useParams } from "react-router-dom";
import NotificationAlert from "../../hooks/NotificationAlert";
import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import InputWithAddOnMultiple from "../../components/forminputs/InputWithAddOnMultiple";

export function AddTruck() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // Form fields
    const truckTypeInput = useInputComponent();
    const descriptionInput = useInputComponent();
    const truckCodeInput = useInputComponent();

    // Fetch truck details if in edit mode
    const [getTruckDetailsResponse, getTruckDetailsHandler] = useFetchAPI(
        {
            url: `/trucks/gettruckdetails/${id}`,
            method: "GET",
            authRequired: true,
        },
        (e) => {
            setLoading(false);
            return e;
        },
        (e) => {
            setLoading(false);
            if (e?.response?.status === 404) {
                setNotFound(true);
            }
            return e?.response ?? true;
        }
    );

    useEffect(() => {
        if (getTruckDetailsResponse?.data?.truck && id) {
            const truck = getTruckDetailsResponse.data.truck;
            truckTypeInput.setEnteredValue(truck.name || '');
            descriptionInput.setEnteredValue(truck.description || '');
            truckCodeInput.setEnteredValue(truck.truck_code || '');
        }
    }, [getTruckDetailsResponse?.data]);

    useEffect(() => {
        if (id) {
            setLoading(true);
            setNotFound(false);
            getTruckDetailsHandler();
        } else {
            // Reset form when not in edit mode
            truckTypeInput.reset();
            descriptionInput.reset();
            truckCodeInput.reset();
        }
    }, [id]);

    // Validators
    const validateTruckType = (value) => {
        if (!value || value.trim() === "") {
            truckTypeInput.setFeedbackMessage("Truck type is required");
            truckTypeInput.setMessageType("error");
            return false;
        }
        truckTypeInput.setFeedbackMessage("");
        truckTypeInput.setMessageType("none");
        return true;
    };



    // Create truck API
    const [createTruckResponse, createTruckHandler] = useFetchAPI(
        {
            url: "/trucks/createtrucktype",
            method: "POST",
        },
        (e) => {
            NotificationAlert("success", "Truck has been created successfully.");
            navigate("/trucks");
            return e;
        },
        (e) => {
            let message = "Something went wrong while creating truck. Please try again.";
            if (typeof e?.response?.data === "string") {
                message = e?.response?.data;
            } else if (typeof e?.response?.data?.message === "string") {
                message = e?.response?.data?.message;
            }
            NotificationAlert("error", message);
        }
    );

    // Edit truck API
    const [editTruckResponse, editTruckHandler] = useFetchAPI(
        {
            url: "/trucks/updatetruck",
            method: "POST",
        },
        (e) => {
            NotificationAlert("success", "Truck has been updated successfully.");
            navigate("/trucks");
            return e;
        },
        (e) => {
            let message = "Something went wrong while updating truck. Please try again.";
            if (typeof e?.response?.data === "string") {
                message = e?.response?.data;
            } else if (typeof e?.response?.data?.message === "string") {
                message = e?.response?.data?.message;
            }
            NotificationAlert("error", message);
        }
    );

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isTruckTypeValid = validateTruckType(truckTypeInput.enteredValue);
 
        
        if (!isTruckTypeValid ) {
            NotificationAlert("error", "Please fill all required fields correctly");
            return;
        }
        
        if (id) {
            // Edit existing truck
            await editTruckHandler({
                body: {
                    truckId:id,
                    name: truckTypeInput.enteredValue,
                    description: descriptionInput.enteredValue,
                    truck_code: truckCodeInput.enteredValue
                },
            });
        } else {
            // Create new truck
            await createTruckHandler({
                body: {
                    name: truckTypeInput.enteredValue,
                    description: descriptionInput.enteredValue,
                    truck_code: truckCodeInput.enteredValue
                },
            });
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center" }}><Spinner /></div>;
    }

    if (notFound) {
        return (
            <div className="w-full p-5">
                <div className="text-center py-10">
                    <p className="text-red-500">Truck not found</p>
                    <button 
                        onClick={() => navigate("/trucks")} 
                        className="mt-4 px-4 py-2 bg-gray-200 rounded"
                    >
                        Back to Trucks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-5">
            <p className="text-lg font-semibold">{id ? "Edit" : "Add New"} Truck</p>
            <p className="text-sm text-gray-500 mb-4">
                {id ? "Edit" : "Create a new"} truck here. Click save when you're done.
            </p>
            
            <form onSubmit={handleSubmit}>
                <div className="my-5 grid grid-cols-1 gap-4">
                    {/* Truck Type Input */}
                    <div>
                        <InputWithAddOnMultiple
                            label="Truck Name"
                            placeholder="Enter truck Name"
                            className="loginInputs w-full"
                            value={truckTypeInput.enteredValue ?? ''}
                            setValue={truckTypeInput.setEnteredValue}
                            setIsTouched={truckTypeInput.setIsTouched}
                            feedbackMessage={truckTypeInput.feedbackMessage}
                            feedbackType={truckTypeInput.messageType}
                            isTouched={truckTypeInput.isTouched}
                            validateHandler={validateTruckType}
                            reset={truckTypeInput.reset}
                            extraProps={{ style: { height: "32px" } }}
                            isRequired={true}
                        />
                    </div>
                    

                    {/* Description Textarea - No Validation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            rows={4}
                            value={descriptionInput.enteredValue ?? ''}
                            onChange={(e) => descriptionInput.setEnteredValue(e.target.value)}
                            placeholder="Enter truck description"
                        />
                    </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={() => navigate("/trucks")} 
                        type="button" 
                        className="px-4 mb-5 border rounded py-1 text-[16px]"
                    >
                        Cancel
                    </button>
                    
                    <button
                        type="submit"
                        disabled={createTruckResponse?.fetching || editTruckResponse?.fetching}
                        className="px-4 mb-5 bg-black text-white text-[16px] font-bold rounded disabled:opacity-50"
                    >
                        {createTruckResponse?.fetching || editTruckResponse?.fetching ? (
                            <Spinner size="sm" color="light" />
                        ) : id ? "Update" : "Save changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
