import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import PrivateRoute from "../component/global/PrivateRoute";
import DeliveryHistory from "../component/HomePage/DeliveryHistory";
import SearchDialog from "../component/HomePage/SearchDialog";
import HomeAppBar, {
  MyPermanentDrawer,
} from "../component/HomePage/HomeAppBar";
import Ads from "../component/HomePage/Ads";
import themeContext from "../state/theme/themeContext";
import userContext from "../state/user/userContext";
import deliveryContext from "../state/delivery/deliveryContext";
import AddButton from "../component/NewDeliveryPage/AddButton";

const Index = ({ location }) => {
  const { firstName } = React.useContext(userContext);
  const { lightMode } = React.useContext(themeContext);
  const { pendingDeliveries } = React.useContext(deliveryContext);
  const background = lightMode ? "myBackground.main" : "background.default";

  const params = new URLSearchParams(location.search);
  const search = params.get("search");

  const [openSearch, setOpenSearch] = React.useState(search === "true");

  return (
    <PrivateRoute location={location}>
      <Box sx={{ display: "flex" }}>
        <MyPermanentDrawer />
        <Box
          bgcolor={background}
          minHeight="100vh"
          display="flex"
          flexGrow={1}
          flexDirection="column"
        >
          <HomeAppBar openSearch={() => setOpenSearch(true)} />
          <Toolbar />
          <Container width={1} height={1}>
            <Stack my={4} spacing={1}>
              <Typography
                variant="h3"
                color="text.primary"
                gutterBottom
                sx={{
                  textTransform: "capitalize",
                  letterSpacing: "-0.04em",
                }}
                noWrap
              >
                Hello,{" "}
                <Typography
                  component="span"
                  variant="inherit"
                  color="primary.light"
                  noWrap
                >
                  {firstName}
                </Typography>
              </Typography>
              <Ads />
            </Stack>
          </Container>
          <Container
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                pt: 2,
              }}
              gutterBottom
            >
              Pending
            </Typography>
            <DeliveryHistory history={pendingDeliveries} />
          </Container>
          <AddButton />
        </Box>
      </Box>
      <SearchDialog
        open={openSearch}
        handleClose={() => setOpenSearch(false)}
      />
    </PrivateRoute>
  );
};

export default Index;
