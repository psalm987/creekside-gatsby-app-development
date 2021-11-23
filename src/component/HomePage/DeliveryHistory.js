import React from "react";
import deliveryContext from "../../state/delivery/deliveryContext";
import DeliveryCardGrid from "./DeliveryCardGrid";

const DeliveryHistory = ({ history, showStatus }) => {
  const { loading } = React.useContext(deliveryContext);
  return (
    <DeliveryCardGrid
      history={history || []}
      showStatus={showStatus}
      loading={loading}
    />
  );
};

export default DeliveryHistory;
