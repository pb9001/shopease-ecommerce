import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("shopease_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("shopease_token") || null;
  });

  // ==============================
  // LOGIN
  // ==============================

  const login = async (email, password) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save user and token
      localStorage.setItem(
        "shopease_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "shopease_token",
        data.token
      );

      setUser(data.user);
      setToken(data.token);

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // ==============================
  // LOGOUT
  // ==============================

  const logout = () => {
    localStorage.removeItem("shopease_user");
    localStorage.removeItem("shopease_token");

    setUser(null);
    setToken(null);
  };

  // ==============================
  // AUTH STATUS
  // ==============================

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ==============================
// CUSTOM HOOK
// ==============================

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider };