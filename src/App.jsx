import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// User Pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Catalogue from "./pages/Catalogue/Catalogue";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Wishlist from "./pages/Wishlist/Wishlist";
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import Orders from "./pages/Orders/Orders";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts/AdminProducts";
import AdminInventory from "./pages/Admin/AdminInventory/AdminInventory";
import AdminOrders from "./pages/Admin/AdminOrders/AdminOrders";
import AdminReturns from "./pages/Admin/AdminReturns/AdminReturns";
import AdminUsers from "./pages/Admin/AdminUsers/AdminUsers";

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>

                {/* ==================== */}
                {/* PUBLIC USER ROUTES    */}
                {/* ==================== */}

                <Route
                  path="/"
                  element={<Login />}
                />

                <Route
                  path="/register"
                  element={<Register />}
                />

                <Route
                  path="/forgot-password"
                  element={<ForgotPassword />}
                />

                {/* ==================== */}
                {/* PROTECTED USER ROUTES */}
                {/* ==================== */}

                <Route
                  path="/catalogue"
                  element={
                    <ProtectedRoute>
                      <Catalogue />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/place-order"
                  element={
                    <ProtectedRoute>
                      <PlaceOrder />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/order-success"
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />

                {/* ==================== */}
                {/* ADMIN ROUTES          */}
                {/* ==================== */}

                {/* Admin Login */}
                <Route
                  path="/admin/login"
                  element={<AdminLogin />}
                />

                {/* Admin Dashboard */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />

                {/* Admin Products */}
                <Route
                  path="/admin/products"
                  element={
                    <AdminProtectedRoute>
                      <AdminProducts />
                    </AdminProtectedRoute>
                  }
                />

                {/* Admin Inventory */}
                <Route
                  path="/admin/inventory"
                  element={
                    <AdminProtectedRoute>
                      <AdminInventory />
                    </AdminProtectedRoute>
                  }
                />

                {/* Admin Orders */}
                <Route
                  path="/admin/orders"
                  element={
                    <AdminProtectedRoute>
                      <AdminOrders />
                    </AdminProtectedRoute>
                  }
                />

                {/* Admin Returns */}
                <Route
                  path="/admin/returns"
                  element={
                    <AdminProtectedRoute>
                      <AdminReturns />
                    </AdminProtectedRoute>
                  }
                />

                {/* Admin Users */}
                <Route
                  path="/admin/users"
                  element={
                    <AdminProtectedRoute>
                      <AdminUsers />
                    </AdminProtectedRoute>
                  }
                />

              </Routes>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;