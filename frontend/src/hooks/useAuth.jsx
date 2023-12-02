import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      setAuth({
        token: storedToken,
        user: {
          id: decodedToken.id,
          username: decodedToken.username,
          role: decodedToken.role,
        },
      });
    }
  }, []);

  const updateAuth = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken.token);
      const decodedToken = jwtDecode(newToken.token);
      setAuth({
        token: newToken.token,
        user: {
          id: decodedToken.id,
          username: decodedToken.username,
          role: decodedToken.role,
        },
      });
    } else {
      localStorage.removeItem("token");
      setAuth(null);
    }
  };

  const value = {
    auth,
    setAuth: updateAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
