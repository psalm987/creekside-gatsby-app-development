import React from "react";
import PrivateRoute from "../../component/global/PrivateRoute";
import MapWithSideBar from "../../component/maps/MapWithSideBar";
import SearchPlaces from "../../component/maps/SearchPlaces";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import SelectMode from "../../component/inputs/SelectMode";
import ConfirmOrder from "../../component/NewDeliveryPage/ConfirmOrder";

import useWindowSize from "../../component/utils/UseWindowSize";

import { fitBounds } from "google-map-react";
import MarkerPoint from "../../component/maps/MarkerPoint";
import userContext from "../../state/user/userContext";
import alertContext from "../../state/alert/alertContext";
import SuccessOrder from "../../component/NewDeliveryPage/SuccessOrder";
import { navigate } from "gatsby-link";

const New = ({ location }) => {
  const [open, setOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState(null);
  const [details, setDetails] = React.useState({});
  const [valid, setValid] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => setOpen(true);

  const { calcPrice } = React.useContext(userContext);
  const { showMessage } = React.useContext(alertContext);

  const [mapSize, setMapSize] = React.useState({ width: 0, height: 0 });

  const [viewProps, setViewProps] = React.useState({
    center: { lat: 4.8156, lng: 7.0498 },
    zoom: 15,
  });

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const windowSize = useWindowSize();

  React.useEffect(() => {
    if (md) {
      setMapSize({
        width: windowSize.width,
        height: windowSize.height - 325,
      });
    } else {
      setMapSize({
        width: windowSize.width - 400,
        height: windowSize.height,
      });
    }
  }, [windowSize, md, setMapSize]);

  const [locationPins, setLocationPins] = React.useState([{}, {}]);

  const setPin = (index) => (location) => {
    setLocationPins(
      locationPins.map((loc, i) => (i === index ? location : loc))
    );
  };

  const exists = (location) => location.latitude && location.longitude;

  React.useEffect(() => {
    let validLocations = false;
    if (exists(locationPins[0]) && exists(locationPins[1])) {
      validLocations = true;
      const bounds = {
        ne: {
          lat: Math.max(locationPins[0].latitude, locationPins[1].latitude),
          lng: Math.max(locationPins[0].longitude, locationPins[1].longitude),
        },
        sw: {
          lat: Math.min(locationPins[0].latitude, locationPins[1].latitude),
          lng: Math.min(locationPins[0].longitude, locationPins[1].longitude),
        },
      };
      setViewProps(fitBounds(bounds, mapSize));
    } else if (exists(locationPins[0]) && !exists(locationPins[1])) {
      setViewProps({
        center: {
          lat: locationPins[0].latitude,
          lng: locationPins[0].longitude,
        },
        zoom: 16,
      });
    } else if (!exists(locationPins[0]) && exists(locationPins[1])) {
      setViewProps({
        center: {
          lat: locationPins[1].latitude,
          lng: locationPins[1].longitude,
        },
        zoom: 16,
      });
    }
    setValid(validLocations && !!mode);
    // eslint-disable-next-line
  }, [locationPins, mode, setValid]);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { distance, duration, price, coupons } = await calcPrice({
        from: locationPins[0],
        to: locationPins[1],
        mode,
      });
      setDetails({ distance, duration, price, coupons });
      handleOpen();
    } catch (err) {
      showMessage("error", "Please try again");
    }
    setLoading(false);
  };

  const mapChildren = locationPins.map(
    ({ longitude, latitude }, index) =>
      longitude &&
      latitude && (
        <MarkerPoint
          key={index}
          {...{
            lat: latitude,
            lng: longitude,
            color: index === 0 ? "secondary.light" : "primary.light",
          }}
        />
      )
  );

  return (
    <PrivateRoute location={location}>
      <MapWithSideBar
        pageTitle="New delivery"
        mapChildren={mapChildren}
        mapProps={viewProps}
      >
        <Stack spacing={{ xs: 2, md: 4 }} pt={4} px={{ xs: 2, lg: 4 }}>
          <SearchPlaces label="Pick up location" onChange={setPin(0)} />
          <SearchPlaces label="Drop off location" onChange={setPin(1)} />
          <SelectMode onChange={setMode} />
          <Button
            onClick={handleClick}
            variant="contained"
            color="primary"
            size="large"
            disabled={!valid || loading}
          >
            {loading ? <CircularProgress size={25} /> : "Continue"}
          </Button>
        </Stack>
      </MapWithSideBar>
      <ConfirmOrder
        locations={locationPins}
        {...details}
        {...{ open, mode, handleClose, setSuccess }}
      />
      <SuccessOrder
        open={success}
        handleClose={() => {
          setSuccess(false);
          typeof window !== "undefined" && navigate("/");
        }}
      />
    </PrivateRoute>
  );
};

export default New;
