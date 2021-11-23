import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const MyOutlinedInput = ({
  label,
  id,
  value,
  onChange,
  fullWidth,
  endAdornment,
  type,
  color,
  required,
}) => {
  return (
    <FormControl color={color || "primary"}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        value={value}
        onChange={onChange}
        label={label}
        fullWidth={Boolean(fullWidth)}
        endAdornment={endAdornment}
        type={type}
        required={required}
      />
    </FormControl>
  );
};

export default MyOutlinedInput;
