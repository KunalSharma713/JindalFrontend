import { useEffect, useRef } from "react";
import { useState } from "react";
import { FormGroup, Input } from "reactstrap";
const InputTableSearch = ({
  value = "",
  setValue,
  clearable = false,
  placeholder = "",
  disabled = false,
  className = "",
}) => {
  const [inp, setInp] = useState(value);

  const debounceTimeout = useRef(null);
  useEffect(() => {
    setValue("")
    return () => { if (debounceTimeout.current) { clearTimeout(debounceTimeout.current); } };
  }, []);


  return (
    <FormGroup>
      <div style={{ position: "relative" }}>
        <Input
          className={`has_left_add_on ${clearable && "has_right_add_on"
            } ${className} table_search_height`}
          disabled={disabled}
          type="text"
          value={inp}
          onChange={(e) => {
            let textvalue = e.target.value.trim();
            setInp(e.target.value);
            if (debounceTimeout.current) {
              clearTimeout(debounceTimeout.current);
            }
            debounceTimeout.current = setTimeout(() => {
              if (textvalue.length === 0 || textvalue.length > 2 || !textvalue) {
                setValue(textvalue ?? "");
              }
            }, 1000);

          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && debounceTimeout.current) {
              clearTimeout(debounceTimeout.current);
              setValue(inp ?? "");
            }
          }}
          placeholder={
            (placeholder !== "" || placeholder) ? placeholder : "Search..."
          }
        />


      </div>
    </FormGroup>
  );
};


export default InputTableSearch;
