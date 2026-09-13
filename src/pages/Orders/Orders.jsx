import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useWishlist } from "../../context/WishlistContext";

import { useCart } from "../../context/CartContext";

import { useOrders } from "../../context/OrderContext";

import "./Orders.css";

function Orders() {
  const { wishlistItems } = useWishlist();
  const { cartCount } = useCart();

  const {
    orders,
    loading,
    error,
  } = useOrders();

  const [returns, setReturns] = useState([]);
  const [returnLoading, setReturnLoading] = useState(true);

  // FETCH USER RETURN REQUESTS
  const fetchReturns = async () => {
    try {
      const token = localStorage.getItem(
        "shopease_token"
      );

      const response = await fetch(
        "http://localhost:5000/api/returns/my-returns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setReturns(data.returns || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch returns:",
        error
      );
    } finally {
      setReturnLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // REQUEST RETURN
  const handleRequestReturn = async (orderId) => {
    const reason = window.prompt(
      "Please enter the reason for return:"
    );

    if (!reason || !reason.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem(
        "shopease_token"
      );

      const response = await fetch(
        "http://localhost:5000/api/returns",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId,
            reason: reason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to request return");
        return;
      }

      alert("Return request submitted successfully!");

      // Refresh return requests
      fetchReturns();
    } catch (error) {
      alert(
        "Something went wrong while requesting the return."
      );
    }
  };

  // FIND RETURN FOR AN ORDER
  const getReturnForOrder = (orderId) => {
    return returns.find(
      (item) =>
        item.order?._id === orderId ||
        item.order === orderId
    );
  };

  return (
    <div className="orders-page">
      <header className="orders-header">
        <Link to="/catalogue">
          <h1>ShopEase</h1>
        </Link>

        <nav>
          <Link to="/catalogue">
            🛍 Catalogue
          </Link>

          <Link to="/wishlist">
            ♥ Wishlist ({wishlistItems.length})
          </Link>

          <Link to="/cart">
            🛒 Cart ({cartCount})
          </Link>

          <Link to="/profile">
            👤 Profile
          </Link>
        </nav>
      </header>

      <main className="orders-content">
        <div className="orders-heading">
          <div>
            <h2>My Orders</h2>

            <p>
              Track and manage your recent orders
            </p>
          </div>

          <Link to="/catalogue">
            ← Continue Shopping
          </Link>
        </div>

        {loading && (
          <div className="empty-orders">
            <h3>Loading Orders...</h3>

            <p>
              Please wait while we fetch your orders.
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="empty-orders">
            <div className="orders-icon">
              ⚠️
            </div>

            <h3>Unable to Load Orders</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="empty-orders">
              <div className="orders-icon">
                📦
              </div>

              <h3>No Orders Yet</h3>

              <p>
                You haven't placed any orders yet.
                Start shopping and your orders will
                appear here.
              </p>

              <Link to="/catalogue">
                Start Shopping
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => {
                const returnRequest =
                  getReturnForOrder(order._id);

                return (
                  <div
                    className="order-card"
                    key={order._id}
                  >
                    {/* ORDER HEADER */}
                    <div className="order-card-header">
                      <div>
                        <h3>
                          Order #
                          {order._id
                            .slice(-6)
                            .toUpperCase()}
                        </h3>

                        <p>
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <span className="order-status">
                        ✓ {order.status}
                      </span>
                    </div>

                    {/* ORDER ITEMS */}
                    <div className="order-items">
                      {order.items.map(
                        (item, index) => (
                          <div
                            className="order-item"
                            key={
                              item._id ||
                              `${item.product}-${index}`
                            }
                          >
                            <div>
                              <h4>
                                {item.name}
                              </h4>

                              <p>
                                Quantity:{" "}
                                {item.quantity}
                              </p>

                              <p>
                                Price: ₹
                                {Number(
                                  item.price
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>

                            <strong>
                              ₹
                              {(
                                item.price *
                                item.quantity
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </div>
                        )
                      )}
                    </div>

                    {/* ORDER FOOTER */}
                    <div className="order-card-footer">
                      <div>
                        <span>
                          Payment
                        </span>

                        <strong>
                          Cash on Delivery
                        </strong>
                      </div>

                      <div>
                        <span>
                          Payment Status
                        </span>

                        <strong>
                          {order.paymentStatus}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Total Amount
                        </span>

                        <strong className="order-total">
                          ₹
                          {Number(
                            order.totalAmount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Delivery Address
                        </span>

                        <strong>
                          {order.shippingAddress
                            ? `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pin}`
                            : "Address not available"}
                        </strong>
                      </div>
                    </div>

                    {/* FULL SHIPPING ADDRESS */}
                    {order.shippingAddress && (
                      <div className="order-shipping-address">
                        <h4>
                          📍 Shipping Address
                        </h4>

                        <p>
                          <strong>
                            {
                              order.shippingAddress
                                .fullName
                            }
                          </strong>
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              .address
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              .city
                          }
                          ,{" "}
                          {
                            order.shippingAddress
                              .state
                          }{" "}
                          -{" "}
                          {
                            order.shippingAddress
                              .pin
                          }
                        </p>
                      </div>
                    )}

                    {/* RETURN SECTION */}
                    <div className="order-return-section">
                      {returnLoading ? (
                        <span>
                          Checking return status...
                        </span>
                      ) : returnRequest ? (
                        <div>
                          <strong>
                            Return Request:
                          </strong>{" "}
                          <span>
                            {returnRequest.status}
                          </span>

                          {returnRequest.adminNote && (
                            <p>
                              Admin Note:{" "}
                              {
                                returnRequest.adminNote
                              }
                            </p>
                          )}
                        </div>
                      ) : order.status ===
                        "Delivered" ? (
                        <button
                          type="button"
                          className="request-return-btn"
                          onClick={() =>
                            handleRequestReturn(
                              order._id
                            )
                          }
                        >
                          ↩ Request Return
                        </button>
                      ) : (
                        <span>
                          Return available after
                          delivery
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}

export default Orders;