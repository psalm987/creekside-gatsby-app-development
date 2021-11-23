import {
  SET_DELIVERIES,
  NEW_DELIVERY,
  EDIT_DELIVERY,
  SET_LOADING,
} from "../types";

const deliveryReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_DELIVERIES:
      return { ...state, deliveries: action.payload };
    case NEW_DELIVERY:
      if (
        state.deliveries.find(
          (delivery) =>
            action.payload._id &&
            delivery._id &&
            delivery._id === action.payload._id
        )
      ) {
        console.log("exists...");
        return state;
      } else {
        console.log("does not exist....");
        return { ...state, deliveries: [action.payload, ...state.deliveries] };
      }
    case EDIT_DELIVERY:
      return {
        ...state,
        deliveries: state.deliveries.map((delivery) =>
          delivery._id &&
          action.payload._id &&
          delivery._id === action.payload._id
            ? action.payload
            : delivery
        ),
      };
    default:
      return state;
  }
};
export default deliveryReducer;
