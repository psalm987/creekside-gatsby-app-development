import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import CircularProgress from "@mui/material/CircularProgress";

import userContext from "../state/user/userContext";

import { navigate, Link } from "gatsby";
import { emailValidator } from "../component/utils/utils";
import axios from "axios";

import alertContext from "../state/alert/alertContext";
import MyOutlinedInput from "../component/global/MyOutlinedInput";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { url, isLoggedIn } = React.useContext(userContext);
  const { showMessage } = React.useContext(alertContext);

  const send = async () => {
    setLoading(true);
    try {
      await axios({
        method: "post",
        url: "/api/users/forgotpassword",
        data: { email },
      });
      showMessage(
        "success",
        "Password reset successful, check your email inbox"
      );
      setEmail("");
    } catch (err) {
      console.log(err.response.data.msg);
      const msg =
        (err && err.response && err.response.data && err.response.data.msg) ||
        "Could not retrieve password for this email";
      showMessage("error", msg);
    }
    setLoading(false);
  };

  if (isLoggedIn() && typeof window !== "undefined") {
    navigate(url || "/");
  }
  return (
    <Container maxWidth="sm">
      <Stack
        height="100vh"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        display="relative"
      >
        <Avatar
          src="/splash.png"
          variant="square"
          alt="logo"
          sx={{ alignSelf: "center", height: 100, width: 100 }}
        />
        <Typography
          variant="h4"
          color="text.primary"
          gutterBottom
          textAlign="center"
        >
          Forgot password
        </Typography>
        <MyOutlinedInput
          label="Email"
          color="primary"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          fullWidth
        />
        <Button
          disabled={Boolean(emailValidator(email) || loading)}
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={send}
        >
          {loading ? <CircularProgress size={25} /> : "Submit"}
        </Button>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ position: "absolute", bottom: 20 }}
          component={Link}
          to="/login"
        >
          Back to login
        </Typography>
      </Stack>
    </Container>
  );
};

export default ForgotPassword;
