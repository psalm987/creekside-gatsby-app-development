import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

const BottomDrawer = ({ children, height }) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        display: { xs: "block", md: "none" },
      }}
    >
      <Drawer
        anchor="bottom"
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            boxSizing: "border-box",
            height: height || 350,
          },
        }}
        open
      >
        <Box sx={{ pt: 3, px: { xs: 0, sm: 2 } }}>{children}</Box>
      </Drawer>
    </Box>
  );
};

export default BottomDrawer;
