import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useOrders } from "../../context/OrderContext";

import "./PlaceOrder.css";

function PlaceOrder() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    cartCount,
    clearCart,
  } = useCart();

  const { wishlistItems } = useWishlist();
  const { addOrder } = useOrders();

  const [addresses, setAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  useEffect(() => {
    const savedAddresses =
      localStorage.getItem("shopease_addresses");

    if (savedAddresses) {
      const parsedAddresses =
        JSON.parse(savedAddresses);

      setAddresses(parsedAddresses);

      if (parsedAddresses.length > 0) {
        const firstAddress = parsedAddresses[0];

        setSelectedAddressId(firstAddress.id);

        setFormData({
          fullName: firstAddress.name,
          address: firstAddress.address,
          city: firstAddress.city,
          state: firstAddress.state,
          pin: firstAddress.pin,
        });
      }
    }
  }, []);

  const deliveryCharge =
    cartItems.length > 0 ? 49 : 0;

  const discount =
    cartTotal >= 3000 ? 600 : 0;

  const finalTotal =
    cartTotal -
    discount +
    deliveryCharge;

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address.id);

    setFormData({
      fullName: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      pin: address.pin,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSelectedAddressId(null);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/catalogue");
      return;
    }

    const form = e.target;

    const newOrder = {
      id: `ORD-${Date.now()}`,

      items: cartItems,

      subtotal: cartTotal,

      discount: discount,

      deliveryCharge: deliveryCharge,

      totalAmount: finalTotal,

      paymentMethod: form.payment.value,

      paymentStatus: "Pending",

      status: "Confirmed",

      shippingAddress: {
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pin: formData.pin,
      },

      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);

    clearCart();

    navigate("/order-success");
  };

  return (
    <div className="place-order-page">

      <header className="place-order-header">

        <Link to="/catalogue">
          <h1>ShopEase</h1>
        </Link>

        <Link to="/profile">
          👤 Profile
        </Link>

        <Link to="/wishlist">
          ♥ Wishlist ({wishlistItems.length})
        </Link>

        <Link to="/cart">
          🛒 Cart ({cartCount})
        </Link>

      </header>

      <main className="place-order-content">

        <h2>Place Your Order</h2>

        <div className="order-progress">
          <span>1. Cart</span>
          <span>→</span>
          <span>2. Address</span>
          <span>→</span>
          <span>3. Payment</span>
          <span>→</span>
          <span>4. Confirm</span>
        </div>

        {cartItems.length === 0 ? (

          <div className="empty-order">

            <h3>Your cart is empty</h3>

            <p>
              Add products to your cart before
              placing an order.
            </p>

            <Link to="/catalogue">
              Browse Products
            </Link>

          </div>

        ) : (

          <form onSubmit={handlePlaceOrder}>

            <div className="order-layout">

              <section className="order-form">

                {addresses.length > 0 && (

                  <div className="saved-addresses">

                    <div className="saved-address-heading">
                      <h3>Saved Addresses</h3>

                      <Link to="/profile">
                        Manage Addresses
                      </Link>
                    </div>

                    <div className="saved-address-list">

                      {addresses.map((address) => (

                        <button
                          type="button"
                          key={address.id}
                          className={
                            selectedAddressId ===
                            address.id
                              ? "saved-address selected"
                              : "saved-address"
                          }
                          onClick={() =>
                            handleAddressSelect(
                              address
                            )
                          }
                        >

                          <strong>
                            {address.name}
                          </strong>

                          <span>
                            {address.address}
                          </span>

                          <span>
                            {address.city},{" "}
                            {address.state} -{" "}
                            {address.pin}
                          </span>

                          {selectedAddressId ===
                            address.id && (
                            <small>
                              ✓ Selected
                            </small>
                          )}

                        </button>

                      ))}

                    </div>

                  </div>

                )}

                <h3>Shipping Address</h3>

                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="address">
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="state">
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="pin">
                  PIN Code
                </label>

                <input
                  id="pin"
                  name="pin"
                  type="text"
                  placeholder="Enter PIN code"
                  value={formData.pin}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  maxLength="6"
                  title="Please enter a valid 6-digit PIN code"
                  required
                />

                <h3>Payment Method</h3>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    required
                  />

                  Cash on Delivery

                </label>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="payment"
                    value="card"
                  />

                  Credit / Debit Card

                </label>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                  />

                  UPI

                </label>

              </section>

              <aside className="order-summary">

                <h3>Order Summary</h3>

                {cartItems.map((item) => (

                  <p key={item.id}>

                    <span>
                      {item.name} ×{" "}
                      {item.quantity}
                    </span>

                    <span>
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </span>

                  </p>

                ))}

                <hr />

                <p>
                  Subtotal
                  <span>
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </p>

                <p>
                  Discount
                  <span>
                    −₹
                    {discount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </p>

                <p>
                  Delivery
                  <span>
                    ₹{deliveryCharge}
                  </span>
                </p>

                <hr />

                <h3>
                  Total
                  <span>
                    ₹
                    {finalTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </h3>

                <button type="submit">
                  Place Order
                </button>

              </aside>

            </div>

          </form>

        )}

      </main>

    </div>
  );
}

export default PlaceOrder;