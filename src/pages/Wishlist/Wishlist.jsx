import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import "./Wishlist.css";

function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart, cartCount } = useCart();

  return (
    <div className="wishlist-page">

      {/* HEADER */}
      <header className="wishlist-header">

        <Link to="/catalogue">
          <h1>ShopEase</h1>
        </Link>

        <nav>
          <Link to="/profile">
            👤 Profile
          </Link>

          <Link to="/wishlist">
            ♥ Wishlist ({wishlistItems.length})
          </Link>

          <Link to="/cart">
            🛒 Cart ({cartCount})
          </Link>
        </nav>

      </header>

      {/* CONTENT */}
      <main className="wishlist-content">

        <div className="wishlist-top">

          <div>
            <h2>My Wishlist</h2>

            <p>
              {wishlistItems.length} saved product
              {wishlistItems.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Link
            to="/catalogue"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>

        </div>

        {/* EMPTY WISHLIST */}
        {wishlistItems.length === 0 ? (

          <div className="empty-wishlist">

            <div className="empty-icon">♡</div>

            <h3>Your wishlist is empty</h3>

            <p>
              Save products you love and find them here later.
            </p>

            <Link
              to="/catalogue"
              className="browse-products"
            >
              Browse Products
            </Link>

          </div>

        ) : (

          <div className="wishlist-grid">

            {wishlistItems.map((product) => (

              <div
                className="wishlist-card"
                key={product.id}
              >

                <div className="wishlist-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>

                <div className="wishlist-details">

                  <h3>{product.name}</h3>

                  <p className="wishlist-brand">
                    {product.brand}
                  </p>

                  <p className="wishlist-rating">
                    ⭐ {product.rating}
                  </p>

                  <strong>
                    ₹{product.price.toLocaleString("en-IN")}
                  </strong>

                  <div className="wishlist-actions">

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                    >
                      + Add to Cart
                    </button>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Wishlist;