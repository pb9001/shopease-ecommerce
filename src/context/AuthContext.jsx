import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("shopease_logged_in") === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser =
      localStorage.getItem("shopease_current_user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const login = (user) => {
    localStorage.setItem(
      "shopease_logged_in",
      "true"
    );

    localStorage.setItem(
      "shopease_current_user",
      JSON.stringify(user)
    );

    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem(
      "shopease_logged_in"
    );

    localStorage.removeItem(
      "shopease_current_user"
    );

    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}