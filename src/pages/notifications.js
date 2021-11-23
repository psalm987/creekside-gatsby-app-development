import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import { navigate } from "gatsby";
import notificationContext from "../state/notification/notificationContext";
import PageTemplate from "../component/global/PageTemplate";
import PersonIcon from "@mui/icons-material/Person";
import ReactTimeAgo from "react-time-ago";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Notifications = ({ location }) => {
  const {
    notifications,
    readNotification,
    readAllNotifications,
    unReadNotificationsLength,
  } = React.useContext(notificationContext);
  const length = notifications.length;

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "info.main";

      default:
        return "primary.main";
    }
  };
  const getIcon = (link) => {
    switch (link) {
      case "profile":
        return PersonIcon;
      case "order":
        return AirportShuttleIcon;
      default:
        return Box;
    }
  };

  const Icon = !!unReadNotificationsLength
    ? CheckCircleIcon
    : CheckCircleOutlineIcon;

  const MarkAll = (
    <React.Fragment>
      <IconButton
        size="small"
        onClick={readAllNotifications}
        color={!!unReadNotificationsLength ? "primary" : "inherit"}
        disabled={!unReadNotificationsLength}
      >
        <Icon />
      </IconButton>
      {!!unReadNotificationsLength && (
        <Typography sx={{ ml: 1 }} variant="body1" color="text.primary">
          {unReadNotificationsLength}
        </Typography>
      )}
    </React.Fragment>
  );

  return (
    <PageTemplate location={location} title="Notifications" more={MarkAll}>
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent={length === 0 && "center"}
        width="100%"
        minHeight="100vh"
      >
        {length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No notifications yet
          </Typography>
        ) : (
          <React.Fragment>
            <Toolbar />
            <Container maxWidth="md">
              <List>
                {notifications.map((notice, index) => {
                  const Icon = getIcon(notice.link);
                  const action = () => {
                    if (typeof window !== "undefined") {
                      switch (notice.link) {
                        case "order":
                          notice.payload &&
                            navigate(`/delivery?q=${notice.payload}`);
                          break;
                        case "profile":
                          navigate("/profile");
                          break;
                        default:
                          break;
                      }
                    }
                  };
                  return (
                    <ListItem
                      key={index}
                      button
                      onClick={async () => {
                        !notice.read && (await readNotification(notice._id));
                        action();
                      }}
                    >
                      {notice.type && (
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getColor(notice.type) }}>
                            <Icon />
                          </Avatar>
                        </ListItemAvatar>
                      )}
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {notice.details}
                          </Typography>
                        }
                      />
                      {notice.dateCreated && (
                        <Typography
                          sx={{ ml: 2 }}
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          <ReactTimeAgo
                            date={notice.dateCreated}
                          ></ReactTimeAgo>
                        </Typography>
                      )}
                      {!notice.read && (
                        <FiberManualRecordIcon
                          sx={{ ml: 2 }}
                          fontSize="small"
                          color="primary"
                        />
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </Container>
          </React.Fragment>
        )}
      </Stack>
    </PageTemplate>
  );
};

export default Notifications;
