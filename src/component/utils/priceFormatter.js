import "intl";
import "intl/locale-data/jsonp/en";

const priceFormatter = (price) => {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    })
      .formatToParts(price)
      .map(({ type, value }) => {
        switch (type) {
          case "currency":
            return `₦${value} `;
          default:
            return value;
        }
      })
      .reduce((string, part) => string + part)
      .replace("NGN ", "")
      .replace("₦₦", "₦")
      .replace(".00", "");
  } catch (err) {
    return `₦${price}`;
  }
};
export default priceFormatter;
