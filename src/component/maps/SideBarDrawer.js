import React from "react";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/system";
import { Link } from "gatsby";

const SideBarDrawer = ({ children, pageTitle, more }) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        width: 400,
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 400,
          },
        }}
        open
      >
        <Toolbar>
          <IconButton component={Link} to="/">
            <BackIcon />
          </IconButton>
          <Typography
            sx={{ ml: 2, flexGrow: 1 }}
            variant="h6"
            color="text.primary"
            noWrap
          >
            {pageTitle}
          </Typography>
          {more}
        </Toolbar>
        <Divider />
        {children}
      </Drawer>
    </Box>
  );
};

export default SideBarDrawer;
