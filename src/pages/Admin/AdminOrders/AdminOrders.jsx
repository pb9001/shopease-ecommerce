import { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";

import "./AdminOrders.css";

function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // FETCH ALL ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // FETCH WHEN ADMIN LOGS IN
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // UPDATE ORDER STATUS
  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order status"
        );
      }

      setOrders(
        orders.map((order) =>
          order._id === id
            ? data.order
            : order
        )
      );

      alert("Order status updated successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-orders-page">

      <div className="admin-orders-header">

        <div>

          <h1>Orders</h1>

          <p>
            View and manage customer orders
          </p>

        </div>

      </div>

      <div className="orders-table-card">

        <div className="orders-count">

          Total Orders:{" "}

          <strong>
            {orders.length}
          </strong>

        </div>

        {loading && (
          <p>
            Loading orders...
          </p>
        )}

        {error && (
          <p className="admin-orders-error">
            {error}
          </p>
        )}

        {!loading &&
          !error && (

            <div className="orders-table-wrapper">

              <table className="admin-orders-table">

                <thead>

                  <tr>

                    <th>
                      Order ID
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Payment
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Update Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders.length === 0 ? (

                    <tr>

                      <td colSpan="6">
                        No orders found.
                      </td>

                    </tr>

                  ) : (

                    orders.map((order) => (

                      <tr
                        key={order._id}
                      >

                        <td>
                          #
                          {order._id
                            .slice(-6)
                            .toUpperCase()}
                        </td>

                        <td>
                          {order.user?.name ||
                            "Unknown User"}
                        </td>

                        <td>
                          ₹
                          {Number(
                            order.totalAmount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          Cash on Delivery
                        </td>

                        <td>

                          <span
                            className={`order-status ${order.status.toLowerCase()}`}
                          >
                            {order.status}
                          </span>

                        </td>

                        <td>

                          <select
                            value={
                              order.status
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target.value
                              )
                            }
                          >

                            <option value="Confirmed">
                              Confirmed
                            </option>

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Shipped">
                              Shipped
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                          </select>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>

    </div>
  );
}

export default AdminOrders;