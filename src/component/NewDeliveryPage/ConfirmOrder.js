import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";

import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import themeContext from "../../state/theme/themeContext";

import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import getModeIcon from "../utils/getModeIcon";
import SelectCoupons from "../inputs/SelectCoupons";
import priceFormatter from "../utils/priceFormatter";
import userContext from "../../state/user/userContext";

import DateTimePicker from "@mui/lab/DateTimePicker";

import { phoneValidator } from "../utils/utils";
import MyOutlinedInput from "../global/MyOutlinedInput";
import { TextField } from "@mui/material";

const ConfirmOrder = ({
  open,
  handleClose,
  locations,
  price,
  distance,
  mode,
  setSuccess,
  coupons,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { lightMode } = React.useContext(themeContext);
  const { applyCoupons, placeOrder, user } = React.useContext(userContext);
  const bg = lightMode ? "myBackground.main" : "transparent";

  const [details, setDetails] = React.useState({
    pickup: "",
    dropoff: "",
    note: "",
    schedule: null,
  });

  const [couponList, setCouponList] = React.useState([]);
  const [calculatedPrice, setCalculatedPrice] = React.useState(price);
  const [loadingPrice, setLoadingPrice] = React.useState(false);
  const [priceError, setPriceError] = React.useState(false);

  const chooseOneCoupon = (_id) =>
    _id ? setCouponList([{ _id }]) : setCouponList([]);

  React.useEffect(() => {
    if (!price) {
      return;
    }
    let active = true;
    setLoadingPrice(true);
    (async () => {
      const res = await applyCoupons(price, couponList);
      if (active) {
        setCalculatedPrice(res.price);
        setPriceError(!!res.error);
        setLoadingPrice(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [couponList, price, applyCoupons]);

  const Icon = getModeIcon(mode);

  const key = process.env.GATSBY_FLUTTERWAVE_KEY;

  const handleChange = (e) =>
    e.target
      ? setDetails({ ...details, [e.target.id]: e.target.value })
      : setDetails({ ...details, schedule: e });

  const config = {
    public_key: key,
    tx_ref: Date.now(),
    amount: calculatedPrice,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user.email,
      phonenumber: user.phone,
      name: user.name,
    },
    customizations: {
      title: "Creekside Logistics Payment Gateway",
      description: "Payment for delivery",
      logo: "https://creeksidelogistics.com/splash.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const inValidPhones =
    phoneValidator(details.pickup) || phoneValidator(details.dropoff);

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      {fullScreen && (
        <Box sx={{ position: "relative" }} component="div">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ ml: 2 }} variant="h6" component="div">
              Confirm order
            </Typography>
          </Toolbar>
          <Divider />
        </Box>
      )}

      <DialogContent sx={{ bgcolor: bg }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={5}
          display="flex"
          mt={2}
          mb={4}
          alignItems="stretch"
          position="relative"
        >
          <Paper
            sx={{ flexGrow: 1, width: "100%" }}
            variant={lightMode ? "outlined" : "elevation"}
          >
            <Box px={4} py={2}>
              <Typography variant="subtitle2" color="text.secondary">
                From
              </Typography>
              <Typography variant="body1" color="text.primary">
                {locations && locations[0].address}
              </Typography>
            </Box>
          </Paper>
          <Paper
            sx={{ flexGrow: 1, width: "100%" }}
            variant={lightMode ? "outlined" : "elevation"}
          >
            <Box px={4} py={2}>
              <Typography variant="subtitle2" color="text.secondary">
                To
              </Typography>
              <Typography variant="body1" color="text.primary">
                {locations && locations[locations.length - 1].address}
              </Typography>
            </Box>
          </Paper>

          <Avatar
            sx={{
              transform: { xs: "translate(50%,-50%)" },
              m: "0px !important",
              top: "50%",
              right: "50%",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              padding: 4,
              bgcolor: "primary.light",
              color: "primary.contrastText",
            }}
          >
            <Icon />
            <Typography variant="body2" color="inherit">
              {distance && distance.replace(" ", "")}
            </Typography>
          </Avatar>
        </Stack>

        <Typography variant="subtitle1" color="inherit" gutterBottom>
          Contacts
        </Typography>
        <DialogContentText>
          Provide the phone numbers to call at the pick up and drop off
          locations.
        </DialogContentText>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ my: 2, mb: 4 }}
        >
          <MyOutlinedInput
            id="pickup"
            label="Pick up"
            value={details.pickup}
            onChange={handleChange}
            fullWidth
            required
          />
          <MyOutlinedInput
            id="dropoff"
            label="Drop off"
            value={details.dropoff}
            onChange={handleChange}
            fullWidth
            required
          />
        </Stack>
        <Typography variant="subtitle1" color="inherit" gutterBottom>
          Others{" "}
          <Typography variant="body2" color="text.secondary" component="span">
            (Optional)
          </Typography>
        </Typography>
        <Stack direction={{ xs: "column" }} spacing={2} sx={{ my: 2, mb: 8 }}>
          <SelectCoupons coupons={coupons} onChange={chooseOneCoupon} />
          <DateTimePicker
            id="schedule"
            label="Schedule Delivery"
            value={details.schedule}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <MyOutlinedInput
            id="note"
            multiline
            value={details.note}
            onChange={handleChange}
            label="Note (to the rider)"
            fullWidth
            rows={4}
          />
        </Stack>
        <Stack direction="row" componen="span" position={"relative"}>
          <Typography
            variant="subtitle2"
            position="absolute"
            sx={{
              top: -20,
              left: 5,
              bgcolor: "primary.light",
              color: "primary.contrastText",
              px: 1,
              borderRadius: 10,
              userSelect: "none",
            }}
          >
            Price
          </Typography>
          <Typography variant="h3" color="text.primary">
            {priceFormatter(calculatedPrice)}
          </Typography>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ bgcolor: bg }}>
        <Button
          onClick={() => {
            handleFlutterPayment({
              callback: async (response) => {
                const data = {
                  from: locations[0],
                  to: locations[1],
                  distance,
                  mode,
                  price: calculatedPrice,
                  pickUpNumber: details.pickup,
                  dropOffNumber: details.dropoff,
                  payment: {
                    type: "Flutterwave",
                    ref: response,
                    amount: response.amount,
                  },
                  note: details.note,
                  schedule: details.schedule,
                  coupons: couponList,
                };
                const success = await placeOrder(data);
                if (success) {
                  handleClose();
                  setSuccess(true);
                }
                closePaymentModal();
              },
              onClose: () => {},
            });
          }}
          disabled={loadingPrice || !!priceError || !!inValidPhones}
          color="primary"
        >
          {loadingPrice ? "Please wait..." : "Pay"}
        </Button>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmOrder;
