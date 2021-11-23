import React from "react";
import MapContainer from "./MapContainer";
import SideBarDrawer from "./SideBarDrawer";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "gatsby";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Fab,
  useMediaQuery,
  useTheme,
  Skeleton,
  Stack,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import BottomDrawer from "./BottomDrawer";

const MapWithSideBar = ({
  children,
  mapProps,
  mapChildren,
  pageTitle,
  more,
  loading,
  error,
}) => {
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const Container = mdDown ? BottomDrawer : SideBarDrawer;
  return (
    <Box width="100vw" height="100vh" display="flex">
      <Container {...{ pageTitle, more }}>
        {loading ? (
          <Stack
            direction="column"
            spacing={1}
            width="100%"
            py={2}
            px={{ xs: 2, lg: 4 }}
          >
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="rectangle" height={40} />
          </Stack>
        ) : error ? (
          <Stack direction="column" spacing={2} width="100%" py={2} px={4}>
            <Typography
              variant="body1"
              color="text.primary"
              gutterBottom
              textAlign="center"
            >
              {error}
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
              Go to Homepage
            </Button>
          </Stack>
        ) : (
          children
        )}
      </Container>
      <MapContainer {...mapProps}>{mapChildren}</MapContainer>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          top: 10,
          left: 10,
        }}
      >
        <Fab component={Link} to="/" color="primary" size="medium">
          <BackIcon />
        </Fab>
      </Box>
    </Box>
  );
};

MapWithSideBar.propTypes = {
  mapProps: PropTypes.object,
  mapChildren: PropTypes.node,
  children: PropTypes.node.isRequired,
  pageTitle: PropTypes.string.isRequired,
};

export default MapWithSideBar;
