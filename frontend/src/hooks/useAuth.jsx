import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN } from "../graphql/mutations/RefreshToken";
import { useMutation } from "@apollo/client";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [refreshToken, error] = useMutation(REFRESH_TOKEN);

  const updateAuth = (newToken) => {
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
  };

  const refreshAuthToken = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = new Date().getTime();

        if (currentTime > expirationTime) {
          const timeToExpiration = expirationTime - currentTime;
          const response = await refreshToken();
          const newToken = response.data.refreshToken.token;

          updateAuth({ token: newToken });
        } else {
          updateAuth({ token: storedToken });
        }
      }
    } catch (refreshError) {
      console.error("Error refreshing auth token:", refreshError);
      updateAuth(null);
    }
  };

  useEffect(() => {
    const refreshInterval = setInterval(refreshAuthToken, 1000);

    refreshAuthToken();

    return () => clearInterval(refreshInterval);
  }, []);

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
