import connectDb from "../../../config/connectDb";
import Order from "../../../models/orderModel";

const restaurantsOrders = async (req, res) => {
  // Validate request method
  if (req.method !== "GET") {
    return res.status(400).json({
      message: "Only GET method allowed",
    });
  }

  try {
    // Connect to db
    await connectDb();

    // Get target orders
    const targetOrders = await Order.find().lean();

    return res.status(200).json({
      orders: targetOrders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

export default restaurantsOrders;




