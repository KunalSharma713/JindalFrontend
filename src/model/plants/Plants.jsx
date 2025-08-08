
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import useFetchAPI from "../../hooks/useFetchAPI";
import ThemeDataTable1 from "../../components/data-table/ThemeDataTable1";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";
import InputTableSearch from "../../components/forminputs/InputTableSearch";
import { State } from 'country-state-city';

const Plants = () => {
    const navigate = useNavigate();

    // State for search input
    const [inputSearch, setInputSearch] = useState("");
    // Pagination state
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [order, setOrder] = useState({
        orderBy: "name",
        order: "desc",
    });
    // Plants API handler

    const [PlantsFetchResponse, PlantsFetchHandler] = useFetchAPI(
        {
            url: `/plant`,
            method: "GET",
            authRequired: true,
            params: {
                page_size: pageSize,
                page_no: pageNo,
                search: inputSearch,
                order: order.order,
            },
        },
        (e) => {
            return e;
        },
        (e) => {
            return e?.response ?? true;
        }
    );

    const [customColumns, setCustomColumns] = useState([]);
    const retryOrRefreshAction = async () => {
        setPageNo(1)
        setInputSearch()
        await PlantsFetchHandler({
            params: {
                page_size: pageSize,
                page_no: 1,
                search: "",
                order: order.order,
            }
        });
    };

    // Handle page or row size change
    const changePageRowHandle = async (page, pageSizes) => {
        await PlantsFetchHandler({
            params: {
                page_size: pageSizes,
                page_no: page,
                search: inputSearch,
                order: order.order,
            },
        });
        setPageNo(page);
        setPageSize(pageSizes);
    };

    // Table column configuration
    const [savedTableColumns, setSavedTableColumns] = useState([
        { name: "ACTION", key: "actions" },
        { name: "NAME", key: "name" },
        { name: "CITY", key: "city" },
        { name: "STATE", key: "state" },
        { name: "PIN CODE", key: "pin_code" },
    ]);



    useEffect(() => {
        setCustomColumns(
            (savedTableColumns ?? []).map((obj) => {

                return {
                    name: obj?.name?.toUpperCase(),
                    selector: (row) => {


                        switch (obj?.key) {

                            case "actions":
                                return <Popover asChild>
                                    <PopoverTrigger asChild>
                                        <button className="btn">. . .</button>
                                    </PopoverTrigger>

                                    <PopoverContent className="popover-content w-50" >
                                        <div className="mb-2">
                                            <button className="text-sm" onClick={() => navigate(`/editplant/:${row["_id"]}`)}>
                                                Edit Plant
                                            </button>
                                        </div>

                                    </PopoverContent>
                                </Popover>
                            case "state":
                                return State?.getStatesOfCountry("IN").find((item) => item?.isoCode == row["state"])?.name

                            default:
                                return (
                                    <span>
                                        {row[obj?.key] == null ||
                                            row[obj?.key] == "" ||
                                            row[obj?.key] == undefined
                                            ? ""
                                            : row[obj?.key]}
                                    </span>
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



    const tableSearchChange = async (value) => {
        setInputSearch(value);
        setPageNo(1);
        await PlantsFetchHandler({
            params: {
                page_size: 10,
                page_no: 1,
                search: value,
                order: order.order,
            },
        });
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-[22px] font-semibold">Plants</h2>

            <div className="flex justify-between items-center mb-5 mt-4 sm:flex-row sm:justify-between sm:items-center">

                <div>

                </div>



                <div>

                    <Button onClick={() => navigate("/createplant")} className="sm-w-[100%]">
                        Add Plant
                    </Button>
                </div>
            </div>

            <div className="mb-3" >
                <InputTableSearch
                    value={inputSearch}
                    setValue={tableSearchChange}
                    clearable={true}
                    className="inputtable-search"
                />
            </div>
            <ThemeDataTable1
                dataRows={PlantsFetchResponse?.data?.Plant ?? []}
                isLoading={PlantsFetchResponse?.fetching}
                isError={PlantsFetchResponse?.error}
                listComponent={customColumns}
                changeRowPage={changePageRowHandle}
                totalRows={Number(PlantsFetchResponse?.data?.totalCompanyCount)}
                currentPage={pageNo}
                currentRows={pageSize}
                retryAction={retryOrRefreshAction}
            />

        </div>
    );
}
export default Plants





const columnDefinitions = [
    {
        key: "Company Name",
        label: "Company Name",
        type: "String",
        required: true,
        errorMessage: "Company Name is required and must be a non-empty string.",
    },

    {
        key: "State",
        label: "State",
        type: "string",
        required: true,
        errorMessage: "State is required.",
    },
    {
        key: "City",
        label: "City",
        type: "string",
        required: true,
        errorMessage: "City is required and must be a non-empty string.",
    },
    {
        key: "Username",
        label: "Username",
        type: "username",
        required: true,
        errorMessage: "Username is required and must be a non-empty string.",
    },
    {
        key: "First Name",
        label: "First Name",
        type: "name",
        required: true,
        errorMessage: "First Name is required and must be a non-empty string.",
    },
    {
        key: "Last Name",
        label: "Last Name",
        type: "name",
        required: false,
        errorMessage: "Last Name is required and must be a non-empty string.",
    },

    {
        key: "Email",
        label: "Email",
        type: "email",
        required: true,
        errorMessage: "Email is required and must be a non-empty string.",
    },
    {
        key: "Password",
        label: "Password",
        type: "password",
        required: true,
        errorMessage: "Password is required and must be a non-empty string.",
    },
    {
        key: "Mobile Number",
        label: "Mobile Number",
        type: "mobile_number",
        required: false,
        errorMessage: "Mobile Number is required and must be a non-empty string.",
    },
    {
        key: "Gender",
        label: "Gender",
        type: "string",
        required: true,
        errorMessage: "Gender is required and must be a non-empty string.",

    },
    {
        key: "Sap Id",
        label: "Sap Id",
        type: "string",
        required: true,
        errorMessage: "Sap ID is required and must be a non-empty string.",

    }
];


