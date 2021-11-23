import Box from "@mui/material/Box";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";

export default function getModeIcon(mode) {
  switch (mode) {
    case "Motorcycle":
      return DirectionsBikeIcon;
    case "Car":
      return DirectionsCarIcon;
    case "Mini Van":
      return AirportShuttleIcon;
    default:
      return Box;
  }
}
