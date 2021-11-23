import { red, green, grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = (mode) =>
  createTheme({
    palette: {
      primary: {
        main: "#ff0600",
      },
      secondary: {
        main: grey[900],
      },
      error: {
        main: red.A400,
      },
      info: {
        main: green[500],
      },
      mode,
      myBackground: {
        main: grey.A100,
      },
    },
    typography: {
      fontFamily: "Poppins",
    },
  });

export default theme;
