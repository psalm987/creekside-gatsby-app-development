import React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import RoomIcon from "@mui/icons-material/Room";

import Box from "@mui/material/Box";

function MarkerEcho(props) {
  return (
    <SvgIcon sx={{ transform: "scale(300%)" }} viewBox="0 0 100 100" {...props}>
      <g
        fill="none"
        fillRule="evenodd"
        strokeWidth="1"
        stroke="black"
        strokeOpacity="0.3"
      >
        <circle cx="50" cy="50" r="50">
          <animate
            attributeName="r"
            begin="0s"
            dur="3s"
            values="0;50"
            keyTimes="0;1"
            keySplines="0.1,0.2,0.3,1"
            calcMode="spline"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="stroke-opacity"
            begin="0s"
            dur="3s"
            values="0;.3;.3;0"
            repeatCount="indefinite"
          ></animate>
        </circle>
        <circle cx="50" cy="50" r="30">
          <animate
            attributeName="r"
            begin="-1s"
            dur="3s"
            values="0;50"
            keyTimes="0;1"
            keySplines="0.1,0.2,0.3,1"
            calcMode="spline"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="stroke-opacity"
            begin="-1s"
            dur="3s"
            values="0;.3;.3;0"
            repeatCount="indefinite"
          ></animate>
        </circle>
      </g>
    </SvgIcon>
  );
}

export default function Marker(props) {
  return (
    <Box sx={{ position: "relative", transform: "translate(-50%, -50%)" }}>
      <MarkerEcho />
      <RoomIcon
        sx={{
          color: props.color || "primary",
          fontSize: 36,
          m: 0,
          p: 0,
          position: "absolute",
          top: "50%",
          right: "50%",
          transform: "translate(80%, -90%)",
        }}
      />
    </Box>
  );
}
