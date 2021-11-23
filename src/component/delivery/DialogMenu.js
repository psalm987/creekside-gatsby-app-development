import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import axios from "axios";
import alertContext from "../../state/alert/alertContext";
import ReactTimeAgo from "react-time-ago";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: "Very Satisfied",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

function RadioGroupRating({ handleChange }) {
  const [value, setValue] = React.useState(null);
  React.useEffect(() => {
    if (typeof handleChange === "function") handleChange(value);
  }, [value, handleChange]);
  return (
    <Rating
      name="review-rating"
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      IconContainerComponent={IconContainer}
      highlightSelectedOnly
    />
  );
}

const CancelOrderMenu = ({ open, onClose, id }) => {
  const { showMessage } = React.useContext(alertContext);
  const cancelOrder = async () => {
    try {
      if (!id) throw Error();
      await axios.post(`/api/delivery/cancel/${id}`);
      showMessage("success", "Order cancelled successfully");
    } catch (err) {
      showMessage("error", "Could not cancel this order");
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancel</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you would like to cancel this delivery?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            cancelOrder();
            onClose();
          }}
        >
          Yes
        </Button>
        <Button onClick={onClose}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

const TrackDelivery = ({ track, open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} scroll="paper">
      <DialogTitle>Track Delivery</DialogTitle>
      <List sx={{ width: 400 }}>
        {track.map(({ action, timestamp }, index) => (
          <ListItem key={index}>
            <UpdateOutlinedIcon sx={{ mr: 2, color: "text.secondary" }} />
            <ListItemText primary={action} />
            {timestamp && (
              <Typography variant="caption" color="text.secondary">
                <ReactTimeAgo date={timestamp} />
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const ReviewMenu = ({ open, onClose, id }) => {
  const { showMessage } = React.useContext(alertContext);
  const [remarkValue, setRemarkValue] = React.useState("");
  const [ratingValue, setRatingValue] = React.useState(null);
  const review = async () => {
    try {
      if (!id) throw Error();
      await axios({
        method: "post",
        url: `/api/delivery/review/${id}`,
        data: { rating: ratingValue, remark: remarkValue },
      });
      setRemarkValue("");
      setRatingValue(null);
      showMessage("success", "Order reviewed successfully");
    } catch (err) {
      showMessage("error", "Could not review this order");
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Review</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please give an honest review and rating on our service
        </DialogContentText>
        <Input
          value={remarkValue}
          onChange={(event) => {
            setRemarkValue(event.target.value);
          }}
          fullWidth
        />
      </DialogContent>
      <Box width={1} display="flex" alignItem="center" justifyContent="center">
        <RadioGroupRating handleChange={(value) => setRatingValue(value)} />
      </Box>
      <DialogActions>
        <Button
          disabled={!ratingValue || !remarkValue}
          onClick={() => {
            review();
            onClose();
          }}
        >
          Submit
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogMenu = ({ open, handleClose, delivery }) => {
  const [openCancelOrder, setOpenCancelOrder] = React.useState(false);
  const [openTrackOrder, setOpenTrackOrder] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);

  const id = delivery._id;
  const cancelled = delivery.status && delivery.status === "Cancelled";
  const phone = delivery.driver && delivery.driver.phone;

  const track = delivery.track;
  const hasTrack = track && track.map && !!track.length;

  const canReview = ["Cancelled", "Delivered"].includes(delivery.status);

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Options</DialogTitle>
        <List sx={{ width: 400 }}>
          {phone && (
            <ListItem
              onClick={handleClose}
              button
              component="a"
              href={`tel:${phone}`}
            >
              <ListItemText primary="Call driver" />
            </ListItem>
          )}
          {hasTrack && (
            <ListItem
              button
              onClick={() => {
                handleClose();
                setOpenTrackOrder(true);
              }}
            >
              <ListItemText primary="Track delivery" />
            </ListItem>
          )}
          {canReview && (
            <ListItem
              button
              onClick={() => {
                handleClose();
                setOpenReview(true);
              }}
            >
              <ListItemText primary="Review" />
            </ListItem>
          )}
          {cancelled === false && (
            <ListItem
              button
              onClick={() => {
                handleClose();
                setOpenCancelOrder(true);
              }}
            >
              <ListItemText primary="Cancel order" />
            </ListItem>
          )}
        </List>
      </Dialog>
      <CancelOrderMenu
        id={id}
        driverPhone={phone}
        open={openCancelOrder}
        onClose={() => setOpenCancelOrder(false)}
      />
      {canReview && (
        <ReviewMenu
          id={id}
          driverPhone={phone}
          canReview={canReview}
          open={openReview}
          onClose={() => setOpenReview(false)}
        />
      )}
      {hasTrack && (
        <TrackDelivery
          open={openTrackOrder}
          handleClose={() => setOpenTrackOrder(false)}
          track={track}
        />
      )}
    </React.Fragment>
  );
};

export default DialogMenu;
