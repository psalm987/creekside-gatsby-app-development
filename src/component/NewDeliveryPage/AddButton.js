import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "gatsby";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";

const AddButton = () => {
  return (
    <Box
      position="fixed"
      zIndex="tooltip"
      bottom={{ xs: 20, md: 30, lg: 50 }}
      right={{ xs: 20, md: 30, lg: 100, xl: 300 }}
    >
      <Fab color="primary" aria-label="add" component={Link} to="/delivery/new">
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default AddButton;
