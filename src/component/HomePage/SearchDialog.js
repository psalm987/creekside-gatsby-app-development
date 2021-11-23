import React from "react";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import getModeIcon from "../utils/getModeIcon";
import axios from "axios";
import { Link } from "gatsby";
import ReactTimeAgo from "react-time-ago";

const SearchDialog = ({ open, handleClose }) => {
  const [searches, setSearches] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchString, setSearchString] = React.useState("");

  const active = React.useRef();

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    (async () => {
      active.current = true;
      if (!searchString) {
        setSearches([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/delivery/search?q=${encodeURI(searchString)}`
        );
        active.current && setSearches(res.data);
      } catch (err) {
        console.log(err);
        setSearches([]);
      }
      setLoading(false);
    })();
    return () => {
      active.current = false;
    };
  }, [searchString, setLoading, setSearches]);

  React.useEffect(() => {
    open || setSearchString("");
  }, [open]);

  return (
    <Dialog
      fullScreen={md}
      scroll="paper"
      maxWidth="md"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        <InputBase
          id="search"
          autoComplete="off"
          placeholder="Search Deliveries"
          sx={{ p: 1 }}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          startAdornment={
            loading ? (
              <CircularProgress size={30} sx={{ mr: 1 }} />
            ) : (
              <SearchIcon sx={{ mr: 1, color: "primary.light" }} />
            )
          }
          endAdornment={
            <IconButton onClick={handleClose}>
              <ClearIcon />
            </IconButton>
          }
          //eslint-disable-next-line
          autoFocus
          fullWidth
        />
      </DialogTitle>
      <DialogContent dividers sx={{ px: 0 }}>
        <Stack
          width={{ xs: "100%", md: 400 }}
          height={{ xs: "100%", md: 400 }}
          display={searches.length ? "block" : "flex"}
        >
          {!searchString || !searches.length ? (
            <Stack
              height={1}
              width={1}
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="body2" color="text.secondary">
                No search found
              </Typography>
            </Stack>
          ) : (
            <List>
              {searches.map((search, index) => {
                const from =
                  (search.from && search.from.address) ||
                  (search.locations &&
                    search.locations[0] &&
                    search.locations[0].address);
                const to =
                  (search.to && search.to.address) ||
                  (search.locations &&
                    search.locations.length &&
                    search.locations[search.locations.length].address);
                const Icon = getModeIcon(search.mode);
                const { dateCreated, distance } = search;
                return (
                  <ListItem
                    button
                    component={Link}
                    to={`/delivery?q=${search._id}`}
                  >
                    <ListItemAvatar sx={{ mr: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                          display: "flex",
                          flexDirection: "column",
                          width: 55,
                          height: 55,
                        }}
                      >
                        <Icon />
                        <Typography variant="caption" color="inherit">
                          {(distance || "").replace(" ", "")}
                        </Typography>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="column">
                          <Typography
                            variant="subtitle1"
                            color="text.primary"
                            noWrap
                          >
                            <Typography component="span" color="text.secondary">
                              From{" "}
                            </Typography>
                            {from}
                          </Typography>
                          {/* <Icon sx={{ fontSize: 25, color: "primary.main" }} /> */}
                          <Typography
                            variant="subtitle1"
                            color="text.primary"
                            noWrap
                          >
                            <Typography component="span" color="text.secondary">
                              To{" "}
                            </Typography>
                            {to}
                          </Typography>
                        </Stack>
                      }
                    />
                    {dateCreated && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ ml: 1 }}
                      >
                        <ReactTimeAgo date={dateCreated} />
                      </Typography>
                    )}
                  </ListItem>
                );
              })}
            </List>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
