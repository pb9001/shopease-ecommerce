import { useState } from "react";

import { Link } from "react-router-dom";

import products from "../../data/products";

import { useCart } from "../../context/CartContext";

import { useWishlist } from "../../context/WishlistContext";

import "./Catalogue.css";

function Catalogue() {
  const { addToCart, cartCount } = useCart();

  const {
    toggleWishlist,
    isWishlisted,
    wishlistItems,
  } = useWishlist();

  const maxPrice = Math.max(
    ...products.map((product) => product.price)
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All Products");

  const [priceRange, setPriceRange] =
    useState(maxPrice);

  const [selectedRating, setSelectedRating] =
    useState(0);

  const [selectedBrand, setSelectedBrand] =
    useState("All");

  const [selectedDiscount, setSelectedDiscount] =
    useState(0);

  // SORTING

  const [sortOption, setSortOption] =
    useState("relevance");

  const categories = [
    "All Products",
    "Men's Clothing",
    "Women's Clothing",
    "Footwear",
    "Bags",
    "Accessories",
    "Electronics",
    "Sports",
  ];

  // FILTER PRODUCTS

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch =
        `${product.name} ${product.category} ${product.brand}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;

      const matchesPrice =
        product.price <= priceRange;

      const matchesRating =
        product.rating >= selectedRating;

      const matchesBrand =
        selectedBrand === "All" ||
        product.brand === selectedBrand;

      const matchesDiscount =
        product.discount >= selectedDiscount;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesBrand &&
        matchesDiscount
      );
    }
  );

  // SORT PRODUCTS

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => {
      if (sortOption === "price-low") {
        return a.price - b.price;
      }

      if (sortOption === "price-high") {
        return b.price - a.price;
      }

      if (sortOption === "rating") {
        return b.rating - a.rating;
      }

      return a.id - b.id;
    }
  );

  // CLEAR FILTERS

  const clearAllFilters = () => {
    setSearchTerm("");

    setSelectedCategory("All Products");

    setPriceRange(maxPrice);

    setSelectedRating(0);

    setSelectedBrand("All");

    setSelectedDiscount(0);

    setSortOption("relevance");
  };

  return (
    <div className="catalogue-page">

      {/* HEADER */}

      <header className="catalogue-header">

        <Link to="/catalogue">
          <h1>ShopEase</h1>
        </Link>

        <input
          type="text"
          placeholder="Search for products, brands, categories..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

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

      {/* CATEGORIES */}

      <nav className="categories">

        {categories.map((category) => (

          <button
            key={category}
            type="button"
            className={
              selectedCategory === category
                ? "category-btn active"
                : "category-btn"
            }
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>

        ))}

      </nav>

      {/* MAIN CONTENT */}

      <div className="catalogue-content">

        {/* FILTERS */}

        <aside className="filters">

          <h2>Filters</h2>

          {/* PRICE */}

          <h3>Price Range</h3>

          <input
            type="range"
            min="100"
            max={maxPrice}
            step="100"
            value={priceRange}
            onChange={(e) =>
              setPriceRange(
                Number(e.target.value)
              )
            }
          />

          <p>
            ₹100 — ₹
            {priceRange.toLocaleString("en-IN")}
          </p>

          {/* RATING */}

          <h3>Rating</h3>

          <label>
            <input
              type="radio"
              name="rating"
              checked={selectedRating === 4}
              onChange={() =>
                setSelectedRating(4)
              }
            />

            {" "}4★ & above
          </label>

          <label>
            <input
              type="radio"
              name="rating"
              checked={selectedRating === 3}
              onChange={() =>
                setSelectedRating(3)
              }
            />

            {" "}3★ & above
          </label>

          <label>
            <input
              type="radio"
              name="rating"
              checked={selectedRating === 0}
              onChange={() =>
                setSelectedRating(0)
              }
            />

            {" "}All Ratings
          </label>

          {/* BRAND */}

          <h3>Brand</h3>

          <label>
            <input
              type="radio"
              name="brand"
              checked={selectedBrand === "Nike"}
              onChange={() =>
                setSelectedBrand("Nike")
              }
            />

            {" "}Nike
          </label>

          <label>
            <input
              type="radio"
              name="brand"
              checked={selectedBrand === "Adidas"}
              onChange={() =>
                setSelectedBrand("Adidas")
              }
            />

            {" "}Adidas
          </label>

          <label>
            <input
              type="radio"
              name="brand"
              checked={selectedBrand === "Puma"}
              onChange={() =>
                setSelectedBrand("Puma")
              }
            />

            {" "}Puma
          </label>

          <label>
            <input
              type="radio"
              name="brand"
              checked={selectedBrand === "All"}
              onChange={() =>
                setSelectedBrand("All")
              }
            />

            {" "}All Brands
          </label>

          {/* DISCOUNT */}

          <h3>Discount</h3>

          <label>
            <input
              type="radio"
              name="discount"
              checked={selectedDiscount === 10}
              onChange={() =>
                setSelectedDiscount(10)
              }
            />

            {" "}10%+ off
          </label>

          <label>
            <input
              type="radio"
              name="discount"
              checked={selectedDiscount === 20}
              onChange={() =>
                setSelectedDiscount(20)
              }
            />

            {" "}20%+ off
          </label>

          <label>
            <input
              type="radio"
              name="discount"
              checked={selectedDiscount === 0}
              onChange={() =>
                setSelectedDiscount(0)
              }
            />

            {" "}All Discounts
          </label>

          {/* CLEAR FILTERS */}

          <button
            type="button"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </button>

        </aside>

        {/* PRODUCTS */}

        <main className="products">

          <div className="products-top">

            <h2>
              {selectedCategory}
            </h2>

            {/* SORTING */}

            <div className="sort-section">

              <span>
                {sortedProducts.length} products
              </span>

              <label htmlFor="sort">
                Sort by:
              </label>

              <select
                id="sort"
                value={sortOption}
                onChange={(e) =>
                  setSortOption(
                    e.target.value
                  )
                }
              >

                <option value="relevance">
                  Relevance
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Rating: High to Low
                </option>

              </select>

            </div>

          </div>

          {/* PRODUCT GRID */}

          <div className="product-grid">

            {sortedProducts.length > 0 ? (

              sortedProducts.map((product) => (

                <div
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <button
                      type="button"
                      className="wishlist-btn"
                      onClick={() =>
                        toggleWishlist(product)
                      }
                      aria-label="Toggle wishlist"
                    >
                      {isWishlisted(product.id)
                        ? "♥"
                        : "♡"}
                    </button>

                  </div>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    ⭐ {product.rating}
                  </p>

                  <strong>
                    ₹
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    + Add to Cart
                  </button>

                </div>

              ))

            ) : (

              <p>
                No products found matching your
                filters.
              </p>

            )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default Catalogue;