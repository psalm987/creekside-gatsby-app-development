import React from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeliveryCard, { LoadingCard } from "./DeliveryCard";

const DeliveryCardGrid = ({ history, showStatus, loading }) => {
  if (!history || history.length === 0) {
    if (loading) {
      return (
        <Grid container spacing={{ xs: 4, lg: 6 }} py={3}>
          {new Array(3).fill("").map((val, i) => (
            <LoadingCard key={i} />
          ))}
        </Grid>
      );
    }
    return (
      <Stack
        flexGrow={1}
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="body1" color="text.secondary">
          Click + to request a delivery
        </Typography>
      </Stack>
    );
  }

  return (
    <Grid container spacing={{ xs: 4, lg: 6 }} py={3}>
      {history.map((val, index) => (
        <DeliveryCard {...val} key={index} showStatus={showStatus} />
      ))}
    </Grid>
  );
};

export default DeliveryCardGrid;
