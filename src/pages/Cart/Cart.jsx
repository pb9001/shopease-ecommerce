import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();

  const { wishlistItems } = useWishlist();

  const deliveryCharge = cartItems.length > 0 ? 49 : 0;
  const discount = cartTotal >= 3000 ? 600 : 0;
  const finalTotal = cartTotal - discount + deliveryCharge;

  return (
    <div className="cart-page">

      {/* HEADER */}
      <header className="cart-header">

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

      {/* CART CONTENT */}
      <main className="cart-content">

        <section className="cart-items">

          <h2>Shopping Cart</h2>

          <p>
            {cartCount} Item{cartCount !== 1 ? "s" : ""}
          </p>

          {cartItems.length === 0 ? (

            <div className="empty-cart">

              <h3>Your cart is empty</h3>

              <p>
                Add some products to your cart and
                they will appear here.
              </p>

              <Link to="/catalogue">
                <button>
                  Browse Products
                </button>
              </Link>

            </div>

          ) : (

            cartItems.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                <div className="cart-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>

                <div className="cart-details">

                  <h3>{item.name}</h3>

                  <p>{item.brand}</p>

                  <p>
                    ⭐ {item.rating}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

                <div className="quantity">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>

                </div>

                <strong>
                  ₹
                  {(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            ))

          )}

        </section>

        {/* PRICE SUMMARY */}
        {cartItems.length > 0 && (

          <aside className="price-summary">

            <h2>Price Summary</h2>

            <p>
              Price
              <span>
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </p>

            <p>
              Discount
              <span>
                −₹{discount.toLocaleString("en-IN")}
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
              Total Amount
              <span>
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </h3>

            <Link to="/place-order">
              <button
                type="button"
                className="checkout-btn"
              >
                Proceed to Checkout
              </button>
            </Link>

            <Link to="/catalogue">
              <button
                type="button"
                className="continue-btn"
              >
                Continue Shopping
              </button>
            </Link>

          </aside>

        )}

      </main>

    </div>
  );
}

export default Cart;