import React from "react";
import PrivateRoute from "../../component/global/PrivateRoute";
import Typography from "@mui/material/Typography";
import MapWithSideBar from "../../component/maps/MapWithSideBar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ReactTimeAgo from "react-time-ago";

import capitalize from "@mui/utils/capitalize";

import { fitBounds } from "google-map-react";

import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import PersonIcon from "@mui/icons-material/Person";
import MoreHorizIcon from "@mui/icons-material/MoreVert";

import getModeIcon from "../../component/utils/getModeIcon";
import priceFormatter from "../../component/utils/priceFormatter";

import useWindowSize from "../../component/utils/UseWindowSize";

import MarkerPoint from "../../component/maps/MarkerPoint";
import axios from "axios";
import { navigate } from "gatsby-link";
import socketContext from "../../state/socket/socketContext";
import DialogMenu from "../../component/delivery/DialogMenu";
import userContext from "../../state/user/userContext";
import IconButton from "@mui/material/IconButton";

const IdLocationHolder = ({
  _id,
  locations,
  distance,
  price,
  timestamp,
  status,
}) => {
  const Primary = ({ text }) => (
    <Typography variant="body2" color="text.secondary">
      {text}
    </Typography>
  );
  const Secondary = ({ text, variant }) => (
    <Typography variant={variant || "subtitle1"} color="text.primary">
      {text}
    </Typography>
  );
  return (
    <List dense>
      <ListItem>
        <ListItemText
          primary={
            <Stack direction="row" spacing={2} mb={1} alignItems="flex-end">
              <Primary text="Delivery ID" />
              <Chip color="primary" size="small" label={capitalize(status)} />
            </Stack>
          }
          secondary={
            _id && (
              <Secondary variant="h6" text={("CSL-" + _id).toUpperCase()} />
            )
          }
        />
        <Typography variant="caption" color="text.secondary">
          {timestamp && <ReactTimeAgo timeStyle="twitter" date={timestamp} />}
        </Typography>
      </ListItem>
      <ListItem>
        <ListItemText
          primary={<Primary text="From" />}
          secondary={
            <Secondary
              text={
                locations &&
                locations.map &&
                locations.length > 0 &&
                locations[0].address
              }
            />
          }
        />
      </ListItem>
      <Divider textAlign="right">
        <Typography variant="subtitle1" color="primary.text">
          {priceFormatter(price)}
        </Typography>
        <Chip size="small" label={distance} />
      </Divider>
      <ListItem>
        <ListItemText
          primary={<Primary text="To" />}
          secondary={
            <Secondary
              text={
                locations &&
                locations.map &&
                locations.length > 0 &&
                locations[locations.length - 1].address
              }
            />
          }
        />
      </ListItem>
    </List>
  );
};

const DriverHolder = ({ driver, mode }) => {
  const Icon = getModeIcon(mode);
  const { name, phone, photoUrl } = driver || {};

  if (!driver) {
    return (
      <Box px={2}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Rider Information
        </Typography>
        <Stack mt={2} spacing={2} direction="row" alignItems="center">
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: "divider",
              fontSize: 45,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="subtitle1" color="text.primary">
              Not assigned
            </Typography>
          </Box>
          <Icon sx={{ color: "primary.light" }} />
        </Stack>
      </Box>
    );
  }
  return (
    <Box px={2}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Rider Information
      </Typography>
      <Stack mt={2} spacing={2} direction="row" alignItems="center">
        <Avatar alt={name} src={photoUrl} sx={{ width: 70, height: 70 }} />
        <Box flexGrow={1}>
          <Typography variant="subtitle1" color="text.primary">
            {name}
          </Typography>
          <Typography
            component="a"
            href={"tel:" + driver.phone}
            sx={{ textDecoration: "none" }}
            variant="body2"
            color="text.secondary"
          >
            {phone}
          </Typography>
        </Box>
        <Icon sx={{ color: "primary.light" }} />
      </Stack>
    </Box>
  );
};

const NoteHolder = ({ text }) => {
  const display = typeof text === "string" && text !== "" ? text : "No note";
  return (
    <Box px={2}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Note
      </Typography>
      <Typography variant="body1" color="text.primary">
        {display}
      </Typography>
    </Box>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  if (value !== index) return null;

  return (
    <Stack flexGrow={2} spacing={2} hidden={value !== index} {...other}>
      {value === index && children}
    </Stack>
  );
}

const icons = [GpsFixedIcon, PersonIcon];

const TabHolder = ({ panels, actionList }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    if (actionList && actionList.map) {
      let handled = false;
      actionList.map(({ index, handleClick }) => {
        if (index === newValue) {
          console.log(index, newValue);
          handled = true;
          typeof handleClick === "function" && handleClick();
        }
        return "";
      });
      if (handled) return;
    }
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        height: 270,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
      >
        {panels.map((panel, index) => {
          const Icon = icons[index];
          return <Tab icon={<Icon />} />;
        })}
        <Tab icon={<MoreHorizIcon />} />
      </Tabs>
      {panels.map((panel, index) => (
        <TabPanel value={value} index={index} key={index}>
          {panel}
        </TabPanel>
      ))}
    </Box>
  );
};

const getDelivery = async (setError, setLoading, active, setDelivery, q) => {
  if (!q) {
    setError("This delivery is not available");
    return;
  }
  setError("");
  setLoading(true);
  try {
    const res = await axios.get(`/api/delivery/${q}`);
    active.current && setDelivery(res.data);
  } catch (err) {
    console.log(err);
    setError("This delivery is not available");
  }
  setLoading(false);
};

const View = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const q = params.get("q");

  if (!q && typeof window !== "undefined") navigate("/delivery/history");

  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  const [openOption, setOpenOption] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [delivery, setDelivery] = React.useState({});

  const [mapSize, setMapSize] = React.useState({ width: 0, height: 0 });

  const { socket } = React.useContext(socketContext);
  const { user } = React.useContext(userContext);

  const active = React.useRef();

  React.useEffect(() => {
    if (socket) {
      socket.on("EditDelivery", (newDelivery) => {
        if (delivery._id && delivery._id === newDelivery._id) {
          setDelivery(newDelivery);
        }
      });
    }
  }, [socket, delivery._id]);

  const windowSize = useWindowSize();
  const [viewProps, setViewProps] = React.useState({
    center: { lat: 4.8156, lng: 7.0498 },
    zoom: 10,
  });

  React.useEffect(() => {
    if (mdDown) {
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
  }, [windowSize, mdDown, setMapSize]);

  active.current = true;

  React.useEffect(() => {
    user.user && getDelivery(setError, setLoading, active, setDelivery, q);
    return () => {
      active.current = false;
    };
    // eslint-disable-next-line
  }, [user.user]);

  const {
    _id,
    locations,
    to,
    from,
    distance,
    price,
    dateCreated,
    driver,
    mode,
    note,
    status,
  } = delivery;

  const loc = locations || (from && to && [from, to]) || [];

  const exists = (location) => location.latitude && location.longitude;

  React.useEffect(() => {
    if (!loc || !loc.map || !loc.length) return;
    if (exists(loc[0]) && exists(loc[1])) {
      const bounds = {
        ne: {
          lat: Math.max(loc[0].latitude, loc[1].latitude),
          lng: Math.max(loc[0].longitude, loc[1].longitude),
        },
        sw: {
          lat: Math.min(loc[0].latitude, loc[1].latitude),
          lng: Math.min(loc[0].longitude, loc[1].longitude),
        },
      };
      setViewProps(fitBounds(bounds, mapSize));
    } else if (exists(loc[0]) && !exists(loc[1])) {
      setViewProps({
        center: {
          lat: loc[0].latitude,
          lng: loc[0].longitude,
        },
        zoom: 16,
      });
    } else if (!exists(loc[0]) && exists(loc[1])) {
      setViewProps({
        center: {
          lat: loc[1].latitude,
          lng: loc[1].longitude,
        },
        zoom: 16,
      });
    }
    // eslint-disable-next-line
  }, [delivery, loading]);

  const mapChildren = loc.map(
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

  const moreButton = (
    <IconButton onClick={() => setOpenOption(true)}>
      <MoreHorizIcon />
    </IconButton>
  );

  return (
    <PrivateRoute location={location}>
      <MapWithSideBar
        pageTitle="Delivery details"
        mapChildren={mapChildren}
        mapProps={viewProps}
        loading={loading}
        error={error}
        more={delivery._id && moreButton}
      >
        <Stack spacing={{ xs: 2, md: 8 }} pt={4} px={{ xs: 2, lg: 4 }}>
          {mdDown ? (
            <TabHolder
              actionList={[
                {
                  index: 2,
                  handleClick: () => {
                    setOpenOption(true);
                  },
                },
              ]}
              panels={[
                <IdLocationHolder
                  key={0}
                  {...{
                    _id,
                    locations: loc,
                    distance,
                    price,
                    timestamp: dateCreated,
                    status,
                  }}
                />,
                <React.Fragment key={1}>
                  <DriverHolder {...{ driver, mode, note }} />
                  <NoteHolder text={note} />
                </React.Fragment>,
              ]}
            />
          ) : (
            <React.Fragment>
              <IdLocationHolder
                {...{
                  _id,
                  locations: loc,
                  distance,
                  price,
                  timestamp: dateCreated,
                  status,
                  from,
                  to,
                }}
              />
              <DriverHolder {...{ driver, mode, note }} />
              <NoteHolder text={note} />
            </React.Fragment>
          )}
        </Stack>
      </MapWithSideBar>
      <DialogMenu
        delivery={delivery}
        open={openOption}
        handleClose={() => {
          setOpenOption(false);
        }}
      />
    </PrivateRoute>
  );
};

export default View;
