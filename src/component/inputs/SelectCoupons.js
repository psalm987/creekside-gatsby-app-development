import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import priceFormatter from "../utils/priceFormatter";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import ReactTimeAgo from "react-time-ago";

const Item = (coupon) => {
  const { _id, type, usages, value, expires } = coupon;
  let text;
  switch (type) {
    case "Flat Rate":
      text = priceFormatter(value) + " flat rate";
      break;
    case "Percentage":
      text = value + "% discount";
      break;
    case "Value":
      text = priceFormatter(value) + " discount";
      break;
    case "None":
      return <MenuItem value={_id}>None</MenuItem>;
    default:
      return null;
  }
  return (
    <MenuItem value={_id}>
      <ListItem
        dense
        disableGutters
        disablePadding
        component="span"
        secondaryAction={
          expires && (
            <Typography variant="caption" color="text.secondary">
              <ReactTimeAgo future date={expires} />
            </Typography>
          )
        }
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "info.main" }}>
            {typeof usages === "number" && usages > 0 ? (
              usages
            ) : (
              <AllInclusiveIcon />
            )}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={text} />
      </ListItem>
    </MenuItem>
  );
};

const SelectCoupons = ({ coupons, onChange }) => {
  const [coupon, setCoupon] = React.useState(0);

  const handleChange = (event) => {
    setCoupon(event.target.value);
    typeof onChange === "function" && onChange(event.target.value);
  };

  const addNone = () => {
    let arr = coupons;
    arr.unshift({ type: "None", _id: 0 });
    return arr;
  };

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="coupon-label">Apply discount</InputLabel>
      <Select
        labelId="coupon-label"
        id="coupon"
        value={coupon}
        label="Apply discount coupon"
        onChange={handleChange}
        size="small"
      >
        {!coupons || coupons.length === 0 ? (
          <MenuItem disabled>No discount available</MenuItem>
        ) : (
          addNone().map((val, index) => Item({ ...val, _id: index }))
        )}
      </Select>
    </FormControl>
  );
};

export default SelectCoupons;
