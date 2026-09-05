import { Link } from "react-router-dom";

import { useOrders } from "../../context/OrderContext";
import "./OrderSuccess.css";

function OrderSuccess() {
  const { orders } = useOrders();

  const latestOrder =
    orders.length > 0
      ? orders[orders.length - 1]
      : null;

  return (
    <div className="order-success-page">

      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>
          Order Placed Successfully!
        </h1>

        <p className="success-message">
          Thank you for shopping with ShopEase.
          Your order has been received successfully.
        </p>

        {latestOrder && (
          <div className="order-info">

            <p>
              <strong>Order ID:</strong>{" "}
              {latestOrder.id}
            </p>

            <p>
              <strong>Order Status:</strong>{" "}
              {latestOrder.status}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              {latestOrder.paymentStatus}
            </p>

            <p>
              <strong>Total Amount:</strong>{" "}
              ₹
              {latestOrder.totalAmount.toLocaleString(
                "en-IN"
              )}
            </p>

            <p>
              <strong>Estimated Delivery:</strong>{" "}
              3–5 Business Days
            </p>

          </div>
        )}

        <div className="success-actions">

          <Link to="/catalogue">
            <button type="button">
              Continue Shopping
            </button>
          </Link>

          <Link to="/orders">
            <button
              type="button"
              className="secondary-btn"
            >
              View My Orders
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;