import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN } from "../graphql/mutations/RefreshToken";
import { DELETE_REFRESH_TOKEN } from "../graphql/mutations/DeleteRefreshToken";
import { useMutation } from "@apollo/client";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [refreshToken] = useMutation(REFRESH_TOKEN);
  const [deleteRefreshToken] = useMutation(DELETE_REFRESH_TOKEN);

  const updateAuth = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken.token);
      const decodedToken = jwtDecode(newToken.token);
      setAuth({
        token: newToken.token,
        user: {
          id: decodedToken.id,
          role: decodedToken.role,
        },
      });
    } else {
      localStorage.removeItem("token");
      setAuth(null);
    }
  }, [setAuth]);

  const refreshAuthToken = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = new Date().getTime();
        const timeToExpiration = expirationTime - currentTime;

        if (timeToExpiration < 10000) {
          const response = await refreshToken();
          const newToken = response.data.refreshToken.token;

          updateAuth({ token: newToken });
        } else {
          updateAuth({ token: storedToken });
        }
      }
    } catch (refreshError) {
      deleteRefreshToken();
      updateAuth(null);
    }
  }, [refreshToken, updateAuth, deleteRefreshToken]);

  useEffect(() => {
    const refreshInterval = setInterval(refreshAuthToken, 1000);

    refreshAuthToken();

    return () => clearInterval(refreshInterval);
  }, [refreshAuthToken]);

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
