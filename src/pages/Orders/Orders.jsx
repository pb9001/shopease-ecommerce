import { Link } from "react-router-dom";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";

import "./Orders.css";

function Orders() {
  const { wishlistItems } = useWishlist();
  const { cartCount } = useCart();
  const { orders } = useOrders();

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

        {orders.length === 0 ? (

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

        ) : (

          <div className="orders-list">

            {orders
              .slice()
              .reverse()
              .map((order) => (

                <div
                  className="order-card"
                  key={order.id}
                >

                  {/* ORDER HEADER */}

                  <div className="order-card-header">

                    <div>

                      <h3>
                        Order #{order.id}
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

                    {order.items.map((item) => (

                      <div
                        className="order-item"
                        key={item.id}
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                        />

                        <div>

                          <h4>
                            {item.name}
                          </h4>

                          <p>
                            {item.brand}
                          </p>

                          <p>
                            Quantity:{" "}
                            {item.quantity}
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

                    ))}

                  </div>

                  {/* ORDER FOOTER */}

                  <div className="order-card-footer">

                    <div>

                      <span>
                        Payment
                      </span>

                      <strong>
                        {order.paymentMethod ===
                        "cod"
                          ? "Cash on Delivery"
                          : order.paymentMethod ===
                            "card"
                          ? "Credit / Debit Card"
                          : "UPI"}
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
                        {order.totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                    {/* DELIVERY ADDRESS */}

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
                          {order.shippingAddress.fullName}
                        </strong>
                      </p>

                      <p>
                        {order.shippingAddress.address}
                      </p>

                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                        {" - "}
                        {order.shippingAddress.pin}
                      </p>

                    </div>

                  )}

                </div>

              ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Orders;