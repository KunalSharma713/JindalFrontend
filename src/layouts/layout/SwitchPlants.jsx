import React, { useEffect, useState } from "react";
import {
    ChevronsUpDown,
    Building2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { PlantSelectionAction } from "../../store/slices/LoginSlice";

export function SwitchPlants() {
    const dispatch = useDispatch();

    // Get current and registered plants from Redux
    const { currentPlant, registeredPlants } = useSelector(
        (state) => state.LoginReducer
    );

    const [selectedCompany, setSelectedCompany] = useState(currentPlant || null);

    // Sync local state when Redux state changes
    useEffect(() => {
        setSelectedCompany(currentPlant);
    }, [currentPlant]);

    const nameParts = (currentPlant?.name || "").trim().split(" ");

    let result = "";
    if (nameParts.length === 1) {
        result = nameParts[0].charAt(0).toUpperCase() +
            (nameParts[0].charAt(1)?.toUpperCase() || "");
    } else {
        result = nameParts[0].charAt(0).toUpperCase() +
            nameParts[1].charAt(0).toUpperCase();
    }


    const handleCompanySelect = (plant) => {
        dispatch(PlantSelectionAction(plant));
        window.location.reload();
    };

    return (
        <DropdownMenu>
            {/* <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg border ps-3 pe-5 py-2 hover:bg-gray-100 transition-colors">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={currentPlant?.avatar} alt={currentPlant?.name} />
                        <AvatarFallback className="rounded-lg">{result}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            {selectedCompany ? selectedCompany?.name : "Select Plant"}
                        </span>
                        <span className="truncate text-xs">
                            {selectedCompany
                                ? [
                                    selectedCompany?.city,
                                    selectedCompany?.state,
                                    selectedCompany?.country ? `(${selectedCompany?.country})` : null
                                ]
                                    .filter(Boolean) // Remove empty/null/undefined values
                                    .join(", ")
                                : ""}
                        </span>

                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="min-w-56 rounded-lg max-h-60 overflow-y-auto"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="px-3 py-2 text-sm">Select Plant</div>
                </DropdownMenuLabel>

                {(registeredPlants || [])?.map((plant) => (
                    <DropdownMenuItem
                        key={plant?._id}
                        onClick={() => handleCompanySelect(plant)}
                        className={
                            selectedCompany?._id === plant?._id
                                ? "font-semibold bg-gray-100"
                                : ""
                        }
                    >
                        <Building2 className="mr-2 h-4 w-4" />
                        {plant?.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent> */}

        </DropdownMenu>
    );
}
