import * as React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "../../src/theme";
import UserState from "../../src/state/user/UserState";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertState from "../../src/state/alert/AlertState";
import alertContext from "../../src/state/alert/alertContext";
import ThemeState from "../../src/state/theme/ThemeState";
import themeContext from "../../src/state/theme/themeContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import userContext from "../../src/state/user/userContext";

import AdapterDateFns from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import SocketState from "../../src/state/socket/SocketState";
import NotificationState from "../../src/state/notification/NotificationState";
import DeliveryState from "../../src/state/delivery/DeliveryState";

TimeAgo.addDefaultLocale(en);

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

if (typeof window !== "undefined") {
  if (!document.querySelector("#google-maps")) {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDOSIWK-C9mSN1Dt8Pb54j_z5N3ZRTrwKI&libraries=places",
      document.querySelector("head"),
      "google-maps"
    );
  }
}

export default function TopLayout(props) {
  return (
    <React.Fragment>
      <Helmet>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css?family=Poppins:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <ThemeState>
        <BodyHolder {...props} />
      </ThemeState>
    </React.Fragment>
  );
}

const BodyHolder = (props) => {
  const { themeMode } = React.useContext(themeContext);

  return (
    <ThemeProvider theme={theme(themeMode)}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AlertState>
          <SocketState>
            <DeliveryState>
              <NotificationState>
                <UserState>
                  {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                  <CssBaseline />
                  <Children>{props.children}</Children>
                </UserState>
              </NotificationState>
            </DeliveryState>
          </SocketState>
        </AlertState>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const Children = ({ children }) => {
  const { open, message, closeAlert } = React.useContext(alertContext);
  const { loadUser, updateUser, isLoggedIn } = React.useContext(userContext);

  React.useEffect(() => {
    loadUser();
    isLoggedIn() && updateUser();
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={(event, reason) => reason !== "clickaway" && closeAlert()}
      >
        <Alert elevation={6} severity={message.type} variant="filled">
          {message.content}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

TopLayout.propTypes = {
  children: PropTypes.node,
};
