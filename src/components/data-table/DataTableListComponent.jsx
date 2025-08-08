import "./ThemeDataTable.css";
import DataTable from "react-data-table-component";
import ReactTableStyles1 from "./ReactTableStyles";
const DataTableListComponent = ({
  data,
  columns,
  selectable = false,
  setSelectedRows,
  selectableRowSelected,
  onSort,
  sortField,
  sortDirection,
}) => {
  return (
    <DataTable
      onSort={onSort}
      sortServer
      defaultSortFieldId={sortField}
      defaultSortAsc={sortDirection === "asc" ? true : false}
      columns={columns}
      data={data}
      customStyles={ReactTableStyles1}
      //   striped
      responsive={true}
      highlightOnHover
      selectableRows={selectable}
      onSelectedRowsChange={setSelectedRows}
      selectableRowSelected={selectableRowSelected}
    />
  );
};
export default DataTableListComponent;

