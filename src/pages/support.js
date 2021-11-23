import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const Support = () => {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div>
      <Stack
        component="iframe"
        height="100vh"
        width="100vw"
        src="https://creeksidelogistics.tawk.help/"
        title="Creekside Support"
        frameBorder="0"
        position="relative"
        onLoad={() => {
          setLoaded(true);
        }}
      />
      <Stack
        position="absolute"
        top="50%"
        right="50%"
        spacing={2}
        direction="row"
        sx={{
          transform: "translate(50%, -50%)",
          justifyContent: "center",
          alignItems: "center",
          display: loaded && "none",
        }}
      >
        <CircularProgress size={30} color="primary" />
        <Typography variant="subtitle1" color="text.primary">
          Please wait...
        </Typography>
      </Stack>
    </div>
  );
};

export default Support;
