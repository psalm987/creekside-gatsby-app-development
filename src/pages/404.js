import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "gatsby";

const Page404 = () => {
  return (
    <Stack
      height="100vh"
      width="100vw"
      spacing={2}
      alignItems="center"
      justifyContent="center"
    >
      <Typography
        variant="subtitle1"
        color="text.secondary"
        gutterBottom
        textAlign="center"
      >
        Page Not Found
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Back to Home
      </Button>
    </Stack>
  );
};

export default Page404;
