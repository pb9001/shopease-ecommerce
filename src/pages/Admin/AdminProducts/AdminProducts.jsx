import { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";

import "./AdminProducts.css";

function AdminProducts() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    category: "",
    stock: "",
  });

  // FETCH PRODUCTS FROM BACKEND
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

  // FORM CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD OR UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isEditing = !!formData.id;

      const url = isEditing
        ? `http://localhost:5000/api/products/${formData.id}`
        : "http://localhost:5000/api/products";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          stock: Number(formData.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Failed to update product"
              : "Failed to add product")
        );
      }

      if (isEditing) {
        alert("Product updated successfully!");

        setProducts(
          products.map((product) =>
            product._id === formData.id
              ? data.product
              : product
          )
        );
      } else {
        alert("Product added successfully!");

        setProducts([
          data.product,
          ...products,
        ]);
      }

      // RESET FORM
      setFormData({
        id: null,
        name: "",
        price: "",
        category: "",
        stock: "",
      });

      setShowForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  // EDIT PRODUCT
  const handleEdit = (product) => {
    setFormData({
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });

    setShowForm(true);
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      alert("Product deleted successfully!");

      setProducts(
        products.filter(
          (product) => product._id !== id
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-products-page">

      {/* HEADER */}
      <div className="admin-products-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage your ShopEase products
          </p>
        </div>

        <button
          className="add-product-btn"
          onClick={() => {
            setFormData({
              id: null,
              name: "",
              price: "",
              category: "",
              stock: "",
            });

            setShowForm(!showForm);
          }}
        >
          + Add Product
        </button>

      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="product-form-card">

          <h2>
            {formData.id
              ? "Edit Product"
              : "Add New Product"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="product-form-grid">

              <input
                type="text"
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />

            </div>

            <div className="product-form-actions">

              <button
                type="submit"
                className="save-product-btn"
              >
                {formData.id
                  ? "Update Product"
                  : "Save Product"}
              </button>

              <button
                type="button"
                className="cancel-product-btn"
                onClick={() => {
                  setFormData({
                    id: null,
                    name: "",
                    price: "",
                    category: "",
                    stock: "",
                  });

                  setShowForm(false);
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* PRODUCTS TABLE */}
      <div className="products-table-card">

        <div className="products-count">
          Total Products:{" "}
          <strong>{products.length}</strong>
        </div>

        {/* LOADING */}
        {loading && (
          <p>Loading products...</p>
        )}

        {/* ERROR */}
        {error && (
          <p className="admin-products-error">
            {error}
          </p>
        )}

        {/* TABLE */}
        {!loading && !error && (
          <div className="admin-products-table-wrapper">

            <table className="admin-products-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6">
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
                        ₹{product.price}
                      </td>

                      <td>
                        {product.stock ?? 0}
                      </td>

                      <td>

                        <button
                          className="edit-product-btn"
                          onClick={() =>
                            handleEdit(product)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-product-btn"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                        >
                          Delete
                        </button>

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

export default AdminProducts;