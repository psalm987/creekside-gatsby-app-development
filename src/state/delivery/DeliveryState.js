import React, { useReducer } from "react";
import DeliveryContext from "./deliveryContext";
import deliveryReducer from "./deliveryReducer";

import {
  SET_DELIVERIES,
  NEW_DELIVERY,
  EDIT_DELIVERY,
  SET_LOADING,
} from "../types";
import axios from "axios";
import alertContext from "../alert/alertContext";

const DeliveryState = ({ children, ...rest }) => {
  const initialState = {
    deliveries: [],
    loading: true,
  };

  const [state, dispatch] = useReducer(deliveryReducer, initialState);
  const { showMessage } = React.useContext(alertContext);

  const addNewDelivery = (delivery) =>
    dispatch({
      type: NEW_DELIVERY,
      payload: delivery,
    });

  const updateDelivery = (delivery) =>
    dispatch({
      type: EDIT_DELIVERY,
      payload: delivery,
    });

  const setLoading = (val) =>
    dispatch({
      type: SET_LOADING,
      payload: val,
    });

  const getDeliveries = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/delivery");
      setDeliveries(res.data);
    } catch (err) {
      showMessage("error", "Cannot retreive deliveries");
      clearDeliveries();
    }
    setLoading(false);
  };

  const clearDeliveries = () => setDeliveries([]);

  const setDeliveries = (deliveries) => {
    dispatch({
      type: SET_DELIVERIES,
      payload: deliveries,
    });
  };

  return (
    <DeliveryContext.Provider
      {...rest}
      value={{
        deliveries: state.deliveries,
        pendingDeliveries: state.deliveries.filter(
          (delivery) =>
            delivery.status === "Pending" || delivery.status === "Processing"
        ),
        loading: state.loading,
        getDeliveries,
        clearDeliveries,
        addNewDelivery,
        updateDelivery,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};
export default DeliveryState;
