import React from "react";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import themeContext from "../../state/theme/themeContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const SuccessOrder = ({ open, handleClose }) => {
  const { lightMode } = React.useContext(themeContext);
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="" fullScreen>
      <Stack
        spacing={2}
        sx={{ width: "100vw", height: "100vh" }}
        px={{ xs: 2, md: "20%", lg: "30%" }}
        display="flex"
        postion="relative"
        alignItems="center"
        justifyContent="center"
      >
        <Avatar
          src={
            lightMode ? "/DeliverySuccessLight.gif" : "/DeliverySuccessDark.png"
          }
          sx={{ width: 500, height: 500 }}
          alt="success image"
        />
        <Typography
          variant="body1"
          color="text.primary"
          gutterBottom
          textAlign="center"
        >
          Your order for a delivery is successful. Our Agents would attend to it
          shortly.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ width: 200 }}
          onClick={handleClose}
        >
          Done
        </Button>
      </Stack>
    </Dialog>
  );
};

export default SuccessOrder;
