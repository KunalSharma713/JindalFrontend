import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlantSelectionAction, SetPlantsAction } from "../store/slices/LoginSlice";
import useFetchAPI from "../hooks/useFetchAPI";
import { useNavigate } from "react-router-dom";

import "./LoginUser.css"; // Import your new CSS for the background

export function PlantSelector() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [allPlantsFromAPI, setAllPlantsFromAPI] = useState([]);
    const [selectedPlantId, setSelectedPlantId] = useState(null);

    // Plants API handler
    const [PlantsFetchResponse, PlantsFetchHandler] = useFetchAPI(
        {
            url: `/plant`,
            method: "GET"
        },
        (e) => {
            setAllPlantsFromAPI(e?.Plant);
            dispatch(SetPlantsAction(e?.Plant));
            return e;
        },
        (e) => {
            return e?.response ?? true;
        }
    );

    useEffect(() => {
        PlantsFetchHandler();
    }, []);

    const handleSelect = () => {
        dispatch(PlantSelectionAction(selectedPlantId));
        navigate('/users');
    };

    const getInitials = (name) => {
        return (name || "")
            .split(" ")
            .map(word => word[0]?.toUpperCase())
            .slice(0, 2)
            .join("") || "PL";
    };

    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">

            {/* Background Image */}
            <div className="plant-selector-background "></div>


            {/* Centered selection box */}
            <div className="flex flex-col items-center justify-center flex-1 px-4 z-10">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md min-h-[250px] flex flex-col justify-center">
                    <h2 className="text-xl font-semibold mb-1 text-center">Choose your Plant</h2>
                    <p className="text-gray-600 text-center mb-4">to continue to your account</p>

                    {PlantsFetchResponse?.fetching ? (
                        <div className="flex justify-center items-center min-h-[100px]">
                            <svg className="animate-spin h-8 w-8 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {(allPlantsFromAPI ?? [])?.length > 0 ? (
                                    allPlantsFromAPI.map(plant => (
                                        <button
                                            key={plant?._id}
                                            onClick={() => setSelectedPlantId(plant)}
                                            className={`flex items-center w-full p-3 rounded border ${selectedPlantId?._id === plant?._id
                                                ? "border-[#019875] bg-[#e5efed]"
                                                : "border-gray-300 bg-white"
                                                } transition`}
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded bg-gray-700 text-white font-semibold mr-3">
                                                {getInitials(plant?.name)}
                                            </div>
                                            <span className="text-gray-800 font-medium">{plant?.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-600">No plants found.</p>
                                )}
                            </div>

                            {(allPlantsFromAPI ?? [])?.length > 0 ? (
                                <button
                                    onClick={handleSelect}
                                    disabled={!selectedPlantId}
                                    className={`mt-4 w-full py-2 rounded text-white font-semibold ${selectedPlantId
                                        ? "bg-[#1f2221] text-white border-none hover:bg-[#019875]"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Continue
                                </button>) : (
                                <button
                                    onClick={() => { navigate('/addNewPlant') }}

                                    className={`mt-4 w-full py-2 rounded text-white font-semibold  bg-[#1f2221] text-white border-none hover:bg-[#019875] 
                                        }`}
                                >
                                    Add Plant
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
