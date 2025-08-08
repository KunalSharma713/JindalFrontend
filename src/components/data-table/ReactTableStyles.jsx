import { defaultThemes } from "react-data-table-component";
const ReactTableStyles1 = {
  header: {
    style: {
      minHeight: "0px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "0px",
      borderBottomWidth: "0px",
      borderTopColor: defaultThemes.default.divider.default,
      backgroundColor: "#F5F6FA",
      minHeight: "32px",
      justifyContent: "space-between",
      borderRadius: "8px",
    },
  },
  rows: {
    style: {
      minHeight: "40px",
      fontSize: "13px",
      borderRadius: "8px",
      fontStyle: "400",
      justifyContent: "space-between",
      "&:not(:last-of-type)": {
        borderBottomWidth: "0px",
      },
    },
  },
  headCells: {
    style: {
      justifyContent: "left",
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "0px",
        borderRightColor: defaultThemes.default.divider.default,
      },
      overflow: "hidden",
      fontWeight: "500",
      color: "#31454C",
      fontSize: "12px",
      fontStyle: "normal",
      margin: "5px 0px",
      lineHeight: "14px",
    },
  },
  cells: {
    style: {
      justifyContent: "left",
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "0px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  checkbox: {
    checked: {
      style: {
        backgroundColor: "red",
      },
    },
  },
};
export default ReactTableStyles1;
