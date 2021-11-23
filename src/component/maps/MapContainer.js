import React from "react";
import GoogleMap from "google-map-react";

import Box from "@mui/material/Box";

const containerStyle = {
  height: "100%",
  width: "100%",
};

const center = {
  lat: 4.8156,
  lng: 7.0498,
};

const MapContainer = (props) => {
  return (
    <Box
      flexGrow={1}
      height={{ xs: "calc(100vh - 350px + 25px)", md: "100vh" }}
    >
      <GoogleMap
        options={{ disableDefaultUI: true }}
        bootstrapURLKeys={{
          key: "AIzaSyAVa67y3wWEBxeAR5Q0p4PZtVknjarOlhQ",
          libraries: [],
        }}
        mapContainerStyle={containerStyle}
        defaultCenter={center}
        defaultZoom={15}
        {...props}
      />
    </Box>
  );
};

export default MapContainer;
