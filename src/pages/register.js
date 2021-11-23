import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import userContext from "../state/user/userContext";
import { navigate, Link } from "gatsby";
import alertContext from "../state/alert/alertContext";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  phoneValidator,
} from "../component/utils/utils";
import MyOutlinedInput from "../component/global/MyOutlinedInput";

const Register = () => {
  const { handleRegister, url, isLoggedIn } = React.useContext(userContext);
  const { showMessage } = React.useContext(alertContext);
  const [auth, setAuth] = React.useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);

  const [showPassword, setshowPassword] = React.useState(false);

  const holder = React.useRef();

  React.useEffect(() => {
    holder.current = `rgba(0,0,0,0) url('/mockups/${
      ["phone", "tab", "computer"][Math.floor(Math.random() * 3)]
    }.jpg') center center/cover no-repeat local padding-box border-box`;
  }, []);

  const background = holder.current;
  if (isLoggedIn() && typeof window !== "undefined") {
    navigate(url || "/");
  }

  const handleChang = (event) => {
    setAuth({
      ...auth,
      [`${event.target.id}`]: event.target.value,
    });
  };

  const handleClickShowPassword = () => {
    setshowPassword(!showPassword);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const inValid =
      nameValidator(auth.name) ||
      phoneValidator(auth.phone) ||
      emailValidator(auth.email) ||
      passwordValidator(auth.password);

    if (inValid) {
      showMessage("warning", inValid);
      return;
    }
    setLoading(true);
    handleRegister(auth);
    setLoading(false);
  };

  return (
    <Stack direction={{ xs: "column", lg: "row" }}>
      <Box
        width={1}
        p={2}
        height="100vh"
        minHeight="700px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        <Stack
          width={1}
          direction="column"
          maxWidth="500px"
          spacing={2}
          component="form"
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
            Sign up
          </Typography>
          <MyOutlinedInput
            value={auth.name}
            onChange={(event) => setAuth({ ...auth, name: event.target.value })}
            label="Name"
            id="name"
            fullWidth
          />
          <MyOutlinedInput
            value={auth.phone}
            onChange={(event) =>
              setAuth({ ...auth, phone: event.target.value })
            }
            label="Phone Number"
            id="phone"
            fullWidth
          />
          <MyOutlinedInput
            value={auth.email}
            onChange={(event) =>
              setAuth({ ...auth, email: event.target.value })
            }
            label="Email"
            id="email"
            fullWidth
          />
          <MyOutlinedInput
            value={auth.password}
            onChange={(event) =>
              setAuth({ ...auth, password: event.target.value })
            }
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleClick}
            disabled={Boolean(
              !(auth.email && auth.password && auth.name && auth.phone) ||
                loading
            )}
          >
            {loading ? <CircularProgress size={25} /> : "Register"}
          </Button>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ position: "absolute", bottom: 20 }}
          component={Link}
          to="/login"
        >
          Already have an account?
        </Typography>
      </Box>
      <Box
        display={{ xs: "none", lg: "block" }}
        width={1}
        sx={{ background }}
        p={20}
      />
    </Stack>
  );
};

export default Register;
