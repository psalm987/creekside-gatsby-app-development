import React from "react";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import LightModeIcon from "@mui/icons-material/Brightness4";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import themeContext from "../../state/theme/themeContext";
import userContext from "../../state/user/userContext";
import { Link } from "gatsby";
import notificationContext from "../../state/notification/notificationContext";

import MenuIcon from "@mui/icons-material/Menu";

const MyIconButton = ({ ...rest }) => (
  <IconButton sx={{ mx: { xs: 0.5, md: 1 } }} {...rest} />
);

const MyDrawerContent = () => {
  const { logout, user } = React.useContext(userContext);

  return (
    <List sx={{ p: 0 }}>
      <Toolbar>
        <Avatar
          sx={{ width: { xs: 52, md: 40 }, height: { xs: 52, md: 40 } }}
          src="/splash.png"
          alt="logo"
          variant="square"
        />
        <Typography
          variant="body1"
          sx={{
            ml: 1,
            color: "text.primary",
            textTransform: "capitalize",
          }}
        >
          Creekside logistics
        </Typography>
      </Toolbar>
      <Divider />
      <ListItem component={Link} to="/profile" button>
        <ListItemText
          sx={{ textTransform: "capitalize" }}
          primary={user.name}
          secondary="View Profile"
        />
      </ListItem>
      <ListItem component={Link} to="/delivery/history" button>
        <ListItemText primary="History" />
      </ListItem>
      <ListItem component="a" href="tel:+2347044455667" button>
        <ListItemText primary="Call us" />
      </ListItem>
      <ListItem component={Link} to="/support" button>
        <ListItemText primary="Support" />
      </ListItem>
      <ListItem button onClick={logout}>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );
};

const drawerWidth = 300;

export const MyPermanentDrawer = () => (
  <Drawer
    sx={{
      display: { xs: "none", lg: "flex" },
      width: drawerWidth,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: drawerWidth,
        boxSizing: "border-box",
      },
    }}
    variant="permanent"
    anchor="left"
  >
    <MyDrawerContent />
  </Drawer>
);

const MySwipeableDrawer = ({ open, onClose, onOpen }) => (
  <SwipeableDrawer
    anchor="left"
    {...{ open, onClose, onOpen }}
    sx={{ display: { xs: "block", lg: "none" } }}
  >
    <MyDrawerContent />
  </SwipeableDrawer>
);

const HomeAppBar = ({ openSearch }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const { toggleTheme, lightMode } = React.useContext(themeContext);
  const { unReadNotificationsLength } = React.useContext(notificationContext);

  const trigger = useScrollTrigger({ threshold: 500 });

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(open);
  };
  return (
    <Slide in={!trigger} direction="down">
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          bgcolor: "background.default",
          borderBottom: 1,
          borderBottomColor: "divider",
        }}
      >
        <Toolbar>
          <Stack
            width={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <MyIconButton onClick={toggleDrawer(true)}>
              <MenuIcon />
            </MyIconButton>
            <MySwipeableDrawer
              {...{
                open: openDrawer,
                onClose: toggleDrawer(false),
                onOpen: toggleDrawer(true),
              }}
            />
            <Stack direction="row" alignItems="center">
              <Button
                variant="text"
                onClick={openSearch}
                sx={{
                  bgcolor: lightMode ? "grey.100" : "grey.900",
                  border: 1,
                  borderColor: "divider",
                  m: 1,
                }}
              >
                <SearchIcon sx={{ mr: 1 }} />
                <Typography
                  variant="subtitle1"
                  color={"text.secondary"}
                  sx={{
                    textTransform: "none",
                    width: { xs: "150px", md: "180px" },
                  }}
                  textAlign="left"
                >
                  Track delivery...
                </Typography>
              </Button>
              <MyIconButton component={Link} to="/notifications">
                <Badge
                  badgeContent={unReadNotificationsLength}
                  max={9}
                  color="primary"
                >
                  <NotificationsIcon />
                </Badge>
              </MyIconButton>
              <MyIconButton onClick={toggleTheme}>
                {lightMode ? <LightModeIcon /> : <DarkModeIcon />}
              </MyIconButton>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

export default HomeAppBar;
