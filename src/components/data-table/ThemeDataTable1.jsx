import { Row } from "reactstrap";
import "./ThemeDataTable.css";
import PaginationComponent from "./PaginationComponent";
import DataTableListComponent from "./DataTableListComponent";
import TableDefaultError from "./TableDefaultError";
const ThemeDataTable1 = ({
  isLoading = false,
  isError = false,
  ErrorComponent = null,
  NoDataMessage = "No records found",
  totalRows = 0,
  currentPage = 1,
  currentRows = 10,
  changeRowPage = null,
  dataRows = [],
  selectable = false,
  selectedRows = {},
  setSelectedRows = () => { },


  selectedViewOption = "list",


  listComponent = null,

  retryAction = null,
  errorConfig = { hasRetry: true },
  selectableRowSelected = null,
  isSelectAbleColumns2 = false,
  selectPrimaryField = null,
  sortAction = () => { },
  sortField = null,
  sortDirection = null,
  setSelectedRowsData = () => { },
}) => {


  const pageNoChangeHandler = (newPage) => {
    let totalPages = Math.ceil(totalRows / currentRows);
    if (
      changeRowPage &&
      newPage !== currentPage &&
      newPage > 0 &&
      newPage < totalPages + 1 &&
      newPage
    ) {
      changeRowPage(newPage, currentRows);
    }
  };
  const selectableCheckHandler = (selectedRow) => {
    let newSelectedRows = [];
    let alreadySelected = selectedRows?.selectedRows
      ? selectedRows?.selectedRows.some(
        (item) => item[selectPrimaryField] === selectedRow[selectPrimaryField]
      )
      : false;
    if (alreadySelected) {
      newSelectedRows = selectedRows?.selectedRows
        ? selectedRows?.selectedRows.filter(
          (item) =>
            item[selectPrimaryField] !== selectedRow[selectPrimaryField]
        )
        : [];

      setSelectedRowsData(newSelectedRows);
    } else {
      const existingSelectedRows = selectedRows?.selectedRows || [];
      newSelectedRows = [...existingSelectedRows, selectedRow];
      setSelectedRowsData(newSelectedRows);
    }
    setSelectedRows({
      allSelected: totalRows === newSelectedRows.length,
      selectedCount: newSelectedRows.length,
      selectedRows: newSelectedRows,
    });
  };
  const selectableCheckHandlerHeader = (e) => {
    let isAlredyChecked = e?.target?.checked;

    let newSelectedRows = selectedRows?.selectedRows ?? [];
    if (isAlredyChecked) {
      (dataRows ?? []).forEach((row1) => {
        let rowExists = (selectedRows?.selectedRows ?? []).some(
          (row2) => row2[selectPrimaryField] === row1[selectPrimaryField]
        );
        if (!rowExists) {
          newSelectedRows.push(row1);
        }
      });
    } else {
      newSelectedRows = newSelectedRows.filter(
        (row1) =>
          !(dataRows ?? []).some(
            (row2) => row2[selectPrimaryField] === row1[selectPrimaryField]
          )
      );
    }
    setSelectedRowsData(newSelectedRows);
    setSelectedRows({
      allSelected: totalRows === newSelectedRows.length,
      selectedCount: newSelectedRows.length,
      selectedRows: newSelectedRows,
    });
  };

  return (
    <div className="w-full" style={{ overflow: "hidden" }}>
      {isError && !isLoading && (
        <>
          {ErrorComponent ? (
            <ErrorComponent />
          ) : (
            <TableDefaultError errorMessage={errorConfig?.errorMessage} hasRetry={errorConfig?.hasRetry} retryAction={retryAction} />
          )}
        </>
      )}
      {isLoading && (
        <div className="w-full text-center default-loading-component">
          <p className="text-dark text-center w-full">Loading...</p>
        </div>
      )}

      {!isError && !isLoading && (dataRows ?? []).length === 0 && (
        <div className="w-full text-center default-no-data-component">
          <p className="text-dark text-center w-full">{NoDataMessage ?? "No records found"}</p>
        </div>
      )}
      {!isError && !isLoading && (dataRows ?? []).length > 0 && (
        <>
          {selectedRows?.selectedRows &&
            selectedRows?.selectedRows.length > 0 &&
            isSelectAbleColumns2 && (
              <div
                className="w-full justify-between d-flex p-2 px-3"
                style={{ backgroundColor: "rgb(227, 242, 253)" }}
              >
                <span>
                  {selectedRows?.selectedRows.length}/{totalRows} Item
                  {selectedRows?.selectedRows.length === 1 ? "" : "s"} Selected
                </span>
                <span
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedRows({
                      allSelected: false,
                      selectedCount: 0,
                      selectedRows: [],
                    });
                  }}
                >
                  Clear
                </span>
              </div>
            )}
          {selectedViewOption === "list" ? (
            <DataTableListComponent
              onSort={sortAction}
              sortField={sortField}
              sortDirection={sortDirection}
              data={dataRows}
              columns={
                isSelectAbleColumns2
                  ? [
                    {
                      name: (
                        <input
                          type="checkbox"
                          onChange={selectableCheckHandlerHeader}
                          checked={
                            selectedRows?.selectedRows
                              ? dataRows.every((obj2) =>
                                (selectedRows?.selectedRows ?? []).some(
                                  (obj1) =>
                                    obj1[selectPrimaryField] ===
                                    obj2[selectPrimaryField]
                                )
                              )
                              : false
                          }
                        />
                      ),
                      selector: (row) => (
                        <input
                          type="checkbox"
                          checked={
                            selectedRows?.selectedRows
                              ? selectedRows?.selectedRows.some(
                                (item) =>
                                  item[selectPrimaryField] ===
                                  row[selectPrimaryField]
                              )
                              : false
                          }
                          onChange={() => {
                            selectableCheckHandler(row);
                          }}
                        />
                      ),
                      sortable: false,
                      width: "50px",
                      minWidth: "20px",
                    },
                    ...listComponent,
                  ]
                  : listComponent
              }
              selectable={isSelectAbleColumns2 ? false : selectable}
              setSelectedRows={setSelectedRows}
              selectableRowSelected={selectableRowSelected}
            />
          ) : (
            <Row className="p-0 m-0 py-1 ">
              {dataRows &&
                dataRows.map((item, index) => {
                  return (
                    <CardComponent
                      item={item}
                      index={index}
                      key={index + "index_key"}
                      selectable={selectable}
                      setSelectedRows={setSelectedRows}
                      selectedRows={selectedRows}
                    />
                  );
                })}
            </Row>
          )}
          {totalRows > currentRows && (
            <div className="w-full datatable-pagination-div">
              <PaginationComponent
                totalRows={totalRows}
                changePage={pageNoChangeHandler}
                currentRows={currentRows}
                currentPage={currentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};


export default ThemeDataTable1;
