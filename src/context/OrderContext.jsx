import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { token, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // FETCH ORDERS FROM BACKEND
  const fetchOrders = async () => {
    if (!token) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
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
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // FETCH ORDERS WHEN USER LOGS IN
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    } else {
      setOrders([]);
      setError("");
    }
  }, [isAuthenticated, token]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}