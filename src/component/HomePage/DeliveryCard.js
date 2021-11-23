import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import ReactTimeAgo from "react-time-ago";
import themeContext from "../../state/theme/themeContext";
import { Link } from "gatsby";

import priceFormatter from "../utils/priceFormatter";
import getModeIcon from "../utils/getModeIcon";

const DeliveryCard = (props) => {
  const {
    _id,
    price,
    distance,
    locations,
    from,
    to,
    dateCreated,
    status,
    mode,
    showStatus,
  } = props;
  const { lightMode } = React.useContext(themeContext);

  const loc = locations || [from, to];

  const Icon = getModeIcon(mode);

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Paper variant={lightMode ? "outlined" : "elevation"}>
        <Box
          sx={{ textDecoration: "none" }}
          component={Link}
          to={`/delivery?q=${_id}`}
        >
          <Box p={4} overflow="hidden" textOverflow="hidden">
            <Stack direction="row" spacing={2} display="flex" mb={2}>
              <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
              >
                <Typography variant="body2" color="text.secondary">
                  From
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{
                    height: { sm: "100%", md: "4.5em" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {loc[0].address}
                </Typography>
              </Box>
              <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Icon sx={{ fontSize: 30, color: "primary.light" }} />
                <Typography variant="body2" color="text.secondary">
                  {distance.replace(" ", "")}
                </Typography>
              </Box>
              <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                textAlign="right"
              >
                <Typography variant="body2" color="text.secondary">
                  To
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{
                    height: { sm: "100%", md: "4.5em" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {loc[loc.length - 1].address}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack
              mt={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {dateCreated && (
                <Typography variant="body2" color="text.secondary">
                  <ReactTimeAgo date={new Date(dateCreated)} />
                </Typography>
              )}
              {showStatus && (
                <Chip
                  label={status}
                  size="small"
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    textTransform: "capitalize",
                  }}
                />
              )}
              <Typography variant="h5" color="text.primary">
                {priceFormatter(parseFloat(price || "0"))}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export const LoadingCard = () => {
  const { lightMode } = React.useContext(themeContext);
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Paper variant={lightMode ? "outlined" : "elevation"}>
        <Box p={4} overflow="hidden" textOverflow="hidden">
          <Stack direction="row" spacing={2} display="flex" mb={2}>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <Skeleton variant="text" width={50} height={15} />
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={70} />
            </Box>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
              textAlign="right"
            >
              <Skeleton variant="text" width={50} height={15} />
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={70} />
            </Box>
          </Stack>
          <Divider />
          <Stack
            mt={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Skeleton variant="text" width={70} />
            <Skeleton variant="text" width={90} height={50} />
          </Stack>
        </Box>
      </Paper>
    </Grid>
  );
};

export default DeliveryCard;
