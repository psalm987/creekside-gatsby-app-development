import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

import PageTemplate from "../../component/global/PageTemplate";
import DeliveryHistory from "../../component/HomePage/DeliveryHistory";
import AddButton from "../../component/NewDeliveryPage/AddButton";
import deliveryContext from "../../state/delivery/deliveryContext";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const filterOpt = [
  { title: "All", status: ["Pending", "Processing", "Delivered", "Cancelled"] },
  { title: "Ongoing", status: ["Pending", "Processing"] },
  { title: "Delivered", status: ["Delivered"] },
  { title: "Cancelled", status: ["Cancelled"] },
];

const History = ({ location }) => {
  const { deliveries } = React.useContext(deliveryContext);
  const [display, setDisplay] = React.useState(deliveries);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filter, setFilter] = React.useState(0);
  const length = display.length;

  const open = !!anchorEl;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    setDisplay(
      deliveries.filter((val) => filterOpt[filter].status.includes(val.status))
    );
    // return () => {
    //   cleanup
    // }
  }, [filter, deliveries, setDisplay]);

  const DropdownButton = (
    <React.Fragment>
      <Button
        disableElevation
        variant="text"
        onClick={handleClick}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        {filterOpt[filter].title}
      </Button>
      <Menu
        elevation={2}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {filterOpt.map(({ title }, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              setFilter(index);
              handleClose();
            }}
            disableRipple
          >
            {title}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );

  return (
    <PageTemplate location={location} title="Deliveries" more={DropdownButton}>
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent={length === 0 && "center"}
      >
        <Container>
          {!!length && <Toolbar />}
          <DeliveryHistory history={display} showStatus />
        </Container>
      </Box>
      <AddButton />
    </PageTemplate>
  );
};

export default History;
