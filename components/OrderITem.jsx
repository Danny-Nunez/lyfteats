import React from "react";
import generalFormatter from "general-formatter";
import styles from "../styles/MyOrders.module.css";

const OrderITem = ({ orderData, onFocus }) => {
  return (
    <div className={styles.order}>
      <button onClick={() => onFocus(orderData)} className={styles.order_Button}><span className={styles.pointer} >
        {orderData.number}
      </span></button>
      <span>{orderData.restaurantName || ""}</span>
      <span>
        {generalFormatter.convertToDateString(orderData?.date, "en-US") || ""}
      </span>
      <span>
        {generalFormatter.convertToMoneyString(
          orderData?.total,
          "en-US",
          "currency",
          "USD"
        ) || ""}
      </span>
    </div>
  );
};

export default OrderITem;
