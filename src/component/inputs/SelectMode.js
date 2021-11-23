import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import userContext from "../../state/user/userContext";

const SelectMode = ({ onChange }) => {
  const [mode, setmode] = React.useState("");

  const { modes } = React.useContext(userContext);

  const handleChange = (event) => {
    typeof onChange === "function" && onChange(event.target.value);
    setmode(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="mode-label">Mode of delivery</InputLabel>
        <Select
          labelId="mode-label"
          id="mode"
          value={mode}
          label="Mode of delivery"
          onChange={handleChange}
        >
          {modes.map((mode, index) => (
            <MenuItem value={mode} key={index}>
              {mode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectMode;
