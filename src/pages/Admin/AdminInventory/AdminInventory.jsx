import { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";

import "./AdminInventory.css";

function AdminInventory() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products",
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
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // LOAD PRODUCTS
  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  // UPDATE STOCK
  const handleStockChange = async (id, value) => {
    const newStock = Number(value);

    if (newStock < 0) {
      return;
    }

    try {
      const product = products.find(
        (product) => product._id === id
      );

      if (!product) {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: product.name,
            price: product.price,
            category: product.category,
            stock: newStock,
            image: product.image,
            description: product.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update stock"
        );
      }

      setProducts(
        products.map((product) =>
          product._id === id
            ? data.product
            : product
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-inventory-page">

      <div className="admin-inventory-header">

        <div>
          <h1>Inventory</h1>

          <p>
            View and update product stock
          </p>
        </div>

      </div>

      <div className="inventory-table-card">

        <div className="inventory-count">
          Total Products:{" "}
          <strong>{products.length}</strong>
        </div>

        {loading && (
          <p>Loading inventory...</p>
        )}

        {error && (
          <p className="admin-inventory-error">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Update Stock</th>
                </tr>
              </thead>

              <tbody>

                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (

                    <tr key={product._id}>

                      <td>
                        {product._id}
                      </td>

                      <td>
                        {product.name}
                      </td>

                      <td>
                        {product.category}
                      </td>

                      <td>
                        <span
                          className={
                            (product.stock ?? 0) <= 5
                              ? "low-stock"
                              : "available-stock"
                          }
                        >
                          {product.stock ?? 0}
                        </span>
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          value={product.stock ?? 0}
                          onChange={(e) =>
                            handleStockChange(
                              product._id,
                              e.target.value
                            )
                          }
                        />
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

export default AdminInventory;