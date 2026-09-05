import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { isLoggedIn } = useAuth();

  const getCurrentUserKey = () => {
    const savedUser =
      localStorage.getItem("shopease_user");

    if (!savedUser) {
      return null;
    }

    const user = JSON.parse(savedUser);

    return user.email
      ? `shopease_orders_${user.email.toLowerCase()}`
      : null;
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      setOrders([]);
      return;
    }

    const userKey = getCurrentUserKey();

    if (!userKey) {
      setOrders([]);
      return;
    }

    const savedOrders =
      localStorage.getItem(userKey);

    setOrders(
      savedOrders
        ? JSON.parse(savedOrders)
        : []
    );
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const userKey = getCurrentUserKey();

    if (!userKey) {
      return;
    }

    localStorage.setItem(
      userKey,
      JSON.stringify(orders)
    );
  }, [orders, isLoggedIn]);

  const addOrder = (order) => {
    setOrders((currentOrders) => [
      ...currentOrders,
      order,
    ]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}