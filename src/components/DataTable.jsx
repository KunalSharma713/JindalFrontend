import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { ChevronUp, ChevronDown, Edit2, Check, X, Filter } from "lucide-react";

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
  onSort,
  onFilter,
  onEdit,
  sortConfig = { key: null, direction: "asc" },
  filters = {},
  editable = false,
  resizable = true,
  emptyMessage = "No data available",
  totalPages = 1,
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [columnWidths, setColumnWidths] = useState({});
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [resizing, setResizing] = useState(null);

  const debounceRef = useRef(null);

  // Sync external filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Initialize column widths
  useEffect(() => {
    const initialWidths = {};
    columns.forEach((col) => {
      initialWidths[col.key] = col.width || 150;
    });
    setColumnWidths(initialWidths);
  }, [columns]);

  // Sorting
  const handleSort = useCallback(
    (key) => {
      if (onSort) {
        const direction =
          sortConfig.key === key && sortConfig.direction === "asc"
            ? "desc"
            : "asc";
        onSort({ key, direction });
      }
    },
    [onSort, sortConfig]
  );

  // Filtering
  const handleFilterChange = useCallback(
    (key, value) => {
      const newFilters = { ...localFilters, [key]: value };
      setLocalFilters(newFilters);

      if (onFilter) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onFilter(newFilters); // trigger API fetch
        }, 300);
      }
    },
    [localFilters, onFilter]
  );

  // Inline editing
  const handleCellEdit = useCallback(
    (rowIndex, columnKey, currentValue) => {
      if (!editable) return;

      setEditingCell({ rowIndex, columnKey });
      setEditValue(currentValue || "");
    },
    [editable]
  );

  const handleEditSave = useCallback(() => {
    if (editingCell && onEdit) {
      onEdit(editingCell.rowIndex, editingCell.columnKey, editValue);
    }
    setEditingCell(null);
    setEditValue("");
  }, [editingCell, editValue, onEdit]);

  const handleEditCancel = useCallback(() => {
    setEditingCell(null);
    setEditValue("");
  }, []);

  // Column resizing
  const handleMouseDown = useCallback(
    (e, columnKey) => {
      if (!resizable) return;
      e.preventDefault();
      setResizing({
        columnKey,
        startX: e.clientX,
        startWidth: columnWidths[columnKey],
      });
    },
    [resizable, columnWidths]
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizing) return;
      const newWidth = Math.max(
        50,
        resizing.startWidth + (e.clientX - resizing.startX)
      );
      setColumnWidths((prev) => ({ ...prev, [resizing.columnKey]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    if (resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);

  // Local filtering (only if onFilter is not provided)
  const filteredData = useMemo(() => {
    if (onFilter) return data; // API-controlled mode
    return data.filter((row) => {
      return Object.keys(localFilters).every((key) => {
        const filterValue = localFilters[key];
        if (!filterValue || filterValue.trim() === "") return true;
        const cellValue = row[key];
        if (cellValue === null || cellValue === undefined) return false;
        return String(cellValue)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    });
  }, [data, localFilters, onFilter]);

  // Pagination calculations

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    onFilter ? totalItems : filteredData.length
  );

  // Pagination rendering
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const addPage = (page, active = false) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-1 border rounded-md mx-1 text-sm ${
          active
            ? "bg-primary text-white border-primary-600"
            : "bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-300"
        }`}
      >
        {page}
      </button>
    );

    pages.push(
      <button
        key="prev"
        disabled={currentPage === 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className="px-2 py-1 mx-1 text-sm border rounded-md bg-white hover:bg-neutral-25 text-neutral-700 border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
    );

    if (startPage > 1) {
      pages.push(addPage(1));
      if (startPage > 2)
        pages.push(
          <span key="ellipsis1" className="mx-1">
            ...
          </span>
        );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(addPage(i, i === currentPage));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        pages.push(
          <span key="ellipsis2" className="mx-1">
            ...
          </span>
        );
      pages.push(addPage(totalPages));
    }

    pages.push(
      <button
        key="next"
        disabled={currentPage === totalPages}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        className="px-2 py-1 mx-1 text-sm border rounded-md bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    );

    return pages;
  };

  // Cell content rendering
  const renderCellContent = (row, column, rowIndex) => {
    const isEditing =
      editingCell?.rowIndex === rowIndex &&
      editingCell?.columnKey === column.key;
    const value = row[column.key];

    // Handle editing state
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type={column.type || "text"}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSave();
              if (e.key === "Escape") handleEditCancel();
            }}
            className="border rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-200"
            autoFocus
          />
          <button
            className="p-1 bg-success-500 text-white rounded hover:bg-success-600 transition-colors"
            onClick={handleEditSave}
          >
            <Check size={14} />
          </button>
          <button
            className="p-1 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors"
            onClick={handleEditCancel}
          >
            <X size={14} />
          </button>
        </div>
      );
    }

    if (column.render) {
      return column.render(value, row, rowIndex);
    }

    if (column.type === "badge") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
          {value}
        </span>
      );
    }

    // Default cell rendering
    const displayValue = value == null ? "-" : value;
    return (
      <div
        className={`${
          editable && column.editable !== false
            ? "cursor-pointer hover:bg-gray-50 p-1 rounded"
            : ""
        }`}
        onClick={() =>
          editable &&
          column.editable !== false &&
          handleCellEdit(rowIndex, column.key, value)
        }
      >
        {displayValue}
        {editable && column.editable !== false && (
          <Edit2 size={12} className="inline ml-2 text-gray-400" />
        )}
      </div>
    );
  };

  // Count active filters
  const activeFilterCount = Object.keys(localFilters).filter(
    (key) => localFilters[key] && localFilters[key].trim() !== ""
  ).length;

  return (
    <div className="space-y-4 p-4 ">
      {/* Filter Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-sm border rounded bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300 flex items-center gap-1 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} /> Filters
          </button>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="text-sm text-neutral-500">
          Showing {startItem} to {endItem} of{" "}
          {onFilter ? totalItems : filteredData.length} entries
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-neutral-50 p-3 rounded border border-neutral-200">
          {columns
            .filter(
              (col) =>
                col.filterable !== false &&
                col.key !== "select" &&
                col.key !== "actions"
            )
            .map((column) => (
              <div key={column.key} className="flex flex-col text-sm">
                <label className="mb-1 text-neutral-700 font-medium">
                  {column.title}
                </label>
                <input
                  type="text"
                  placeholder={`Filter ${column.title}...`}
                  value={localFilters[column.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(column.key, e.target.value)
                  }
                  className="border border-neutral-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                />
              </div>
            ))}
          {activeFilterCount > 0 && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  const cleared = {};
                  setLocalFilters(cleared); // clear internal filters
                  if (onFilter) onFilter(cleared); // notify parent
                }}
                className="px-3 py-1 text-sm bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    style={{ width: columnWidths[column.key] }}
                    className={`px-3 py-2 text-left font-semibold ${
                      column.sortable !== false
                        ? "cursor-pointer select-none hover:bg-neutral-200"
                        : ""
                    } transition-colors relative`}
                    onClick={() =>
                      column.sortable !== false && handleSort(column.key)
                    }
                  >
                    <div className="flex justify-between items-center">
                      {column.title}
                      {column.sortable !== false && (
                        <div className="flex flex-col ml-2">
                          <ChevronUp
                            size={12}
                            className={`${
                              sortConfig.key === column.key &&
                              sortConfig.direction === "asc"
                                ? "text-primary-500"
                                : "text-neutral-400"
                            }`}
                          />
                          <ChevronDown
                            size={12}
                            className={`${
                              sortConfig.key === column.key &&
                              sortConfig.direction === "desc"
                                ? "text-primary-500"
                                : "text-neutral-400"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                    {resizable && (
                      <div
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-primary-300 active:bg-primary-500"
                        onMouseDown={(e) => handleMouseDown(e, column.key)}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 text-neutral-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 text-neutral-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIndex) => (
                  <tr
                    key={row.id || rowIndex}
                    className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-3 py-2 align-middle">
                        {renderCellContent(row, column, rowIndex)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-600">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onPageChange(1, Number(e.target.value))}
              className="border border-neutral-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 bg-white"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Page buttons */}
          <div className="flex flex-wrap justify-center gap-1">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
