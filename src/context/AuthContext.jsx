// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { login, register, logout as apiLogout } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // You might want to add an endpoint to get current user
          // const userData = await getCurrentUser();
          // setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signIn = (credentials) => {
    return login(credentials)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response;
      })
      .catch((error) => {
        throw error;
      });
  };

  const signUp = (userData) => {
    return register(userData)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response;
      })
      .catch((error) => {
        throw error;
      });
  };

  const logout = async () => {
    try {
      await apiLogout();
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
