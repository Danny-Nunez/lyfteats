import { useEffect, useState, useContext } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import OrderITem from "../../components/OrderITem";
import dynamic from "next/dynamic";
import FocusedOrder from "../../components/FocusedOrder";
import styles from "../../styles/MyOrders.module.css";
import AuthContext from "../../context/AuthProvider";

const StoreOrders = () => {
  const [orders, setOrders] = useState([]);
  const [targetOrder, setTargetOrder] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const getOrders = async () => {
      console.log("Fetching orders...");
      const response = await axiosPrivate.get("/api/order/restaurantOrders");
      console.log("Orders response:", response.data);
      const filteredOrders = response.data.orders.filter(
        (order) => order.restaurantName === currentUser
      );
      setOrders(filteredOrders);
    };

    if (currentUser) {
      getOrders();
      console.log("User:", currentUser);
    }
  }, [axiosPrivate, currentUser]);

  const focusOrder = (orderData) => {
    setTargetOrder(orderData);
  };

  const ordersList = orders.length === 0 ? (
    <p>No orders have been placed yet</p>
  ) : (
    orders.map((order) => (
      <OrderITem key={order._id} orderData={order} onFocus={focusOrder} />
    ))
  );

  const totalOrders = orders.length;
  const maxOrders = 100; // Set the maximum number of orders as desired
  const percent = totalOrders / maxOrders; // Calculate the percentage

  const chartStyle = {
    height: 100,
    width: 250,
  };

  const totalSales = orders.reduce((total, order) => total + order.total, 0);
  const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false });

  return (
    <div className={styles.main}>
       <div>
      <GaugeChart
        id="gauge-chart2"
        style={chartStyle}
        nrOfLevels={20}
        percent={percent}
        hideText={true}
        textColor="#000000"
        colors={['#EA4228', '#F5CD19', '#5BE12C']}
        
      />
      <span className={styles.meter}>Total Sales: ${totalSales}</span>
    </div>
      <h1 className={styles.title}>Store Orders</h1>
      <div className={styles.content}>
        <div>
          <div className={styles.list_headers}>
            <div className={styles.headers}>
              <span>Order Number</span>
              <span>Restaurant</span>
              <span>Date</span>
              <span>Total</span>
            </div>
            <div className={styles.divider}> </div>
          </div>
          <div className={styles.list_container}>{ordersList}</div>
        </div>
        {targetOrder && <FocusedOrder orderData={targetOrder} />}
      </div>
    </div>
  );
};

export default StoreOrders;

