import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const { token, logout } = useAuth();

  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [pendingReturnsCount, setPendingReturnsCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // FETCH DASHBOARD DATA
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // FETCH PRODUCTS
      const productsResponse = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const productsData = await productsResponse.json();

      if (!productsResponse.ok) {
        throw new Error(
          productsData.message || "Failed to fetch products"
        );
      }

      setProductsCount(
        productsData.products?.length || 0
      );

      // FETCH ORDERS
      const ordersResponse = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersData = await ordersResponse.json();

      if (!ordersResponse.ok) {
        throw new Error(
          ordersData.message || "Failed to fetch orders"
        );
      }

      const allOrders = ordersData.orders || [];

      // Total number of orders
      setOrdersCount(allOrders.length);

      // Show only latest 5 orders
      setOrders(allOrders.slice(0, 5));

      // FETCH USERS
      const usersResponse = await fetch(
        "http://localhost:5000/api/auth/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const usersData = await usersResponse.json();

      if (!usersResponse.ok) {
        throw new Error(
          usersData.message || "Failed to fetch users"
        );
      }

      setUsersCount(
        usersData.users?.length || 0
      );

      // FETCH RETURNS
      const returnsResponse = await fetch(
        "http://localhost:5000/api/returns",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const returnsData = await returnsResponse.json();

      if (!returnsResponse.ok) {
        throw new Error(
          returnsData.message || "Failed to fetch returns"
        );
      }

      // Count only Pending returns
      const pendingReturns =
        (returnsData.returns || []).filter(
          (item) => item.status === "Pending"
        ).length;

      setPendingReturnsCount(pendingReturns);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>ShopEase</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          <button
            className="admin-nav-item active"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            Products
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/inventory")
            }
          >
            Inventory
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            Orders
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/returns")
            }
          >
            Returns
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/users")
            }
          >
            Users
          </button>
        </nav>

        <button
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome to ShopEase Admin Panel
            </p>
          </div>

          <div className="admin-profile">
            Admin
          </div>
        </header>

        {/* Statistics */}
        <section className="admin-stats">
          <div className="admin-stat-card">
            <span>Total Products</span>
            <strong>
              {loading ? "..." : productsCount}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Orders</span>
            <strong>
              {loading ? "..." : ordersCount}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Users</span>
            <strong>
              {loading ? "..." : usersCount}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>Pending Returns</span>
            <strong>
              {loading ? "..." : pendingReturnsCount}
            </strong>
          </div>
        </section>

        {error && (
          <p className="admin-dashboard-error">
            {error}
          </p>
        )}

        {/* Recent Orders */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Recent Orders</h2>

            <button
              onClick={() =>
                navigate("/admin/orders")
              }
            >
              View All
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
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
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span
                          className={`status ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Quick Actions</h2>
          </div>

          <div className="admin-quick-actions">
            <button
              onClick={() =>
                navigate("/admin/products")
              }
            >
              Manage Products
            </button>

            <button
              onClick={() =>
                navigate("/admin/inventory")
              }
            >
              Check Inventory
            </button>

            <button
              onClick={() =>
                navigate("/admin/returns")
              }
            >
              Manage Returns
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;  