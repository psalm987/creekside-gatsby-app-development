import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { TextField } from "@mui/material";

const autocompleteService = { current: null };
let geocoder;

export default function GoogleMaps({ onChange, label }) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const fetch2 = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  function getLatLng(newValue) {
    setValue(newValue);
    if (newValue) {
      geocoder.geocode(
        {
          placeId: newValue.place_id,
        },
        (results, response) => {
          if (response !== "OK") {
            console.error("Error...", response);
            return;
          }
          const locationObj = results[0].geometry.location;
          const location = {
            latitude: locationObj.lat(),
            longitude: locationObj.lng(),
            address: newValue.description,
          };
          typeof onChange === "function" && onChange(location);
        }
      );
    } else {
      typeof onChange === "function" && onChange({});
    }
  }

  React.useEffect(() => {
    let active = true;

    if (typeof window === "undefined") return;

    if (
      (!autocompleteService.current || !autocompleteService.geocoder) &&
      window.google
    ) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      geocoder = new window.google.maps.Geocoder();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    const ph_latLng = new window.google.maps.LatLng(4.8156, 7.0498);

    fetch2(
      { input: inputValue, location: ph_latLng, radius: 24 },
      (results) => {
        if (active) {
          let newOptions = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch2]);

  return (
    <Autocomplete
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      options={options}
      autoComplete
      value={value}
      noOptionsText="Location not available"
      onChange={async (event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        getLatLng(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || "Add a location"}
          variant="outlined"
          fullWidth
        />
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <li {...props}>
            <Stack direction="row" p={2}>
              <LocationOnIcon
                sx={{ color: "text.secondary", mr: 2, mt: 0.3 }}
              />
              <Typography variant="subtitle1" color="text.primary">
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Typography>
            </Stack>
          </li>
        );
      }}
    />
  );
}
