import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");
      if (userId) {
        setUser({ id: userId, role });
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData) => {
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("role", userData.role);
    setUser({ id: userData.id, name: userData.name, email: userData.email, role: userData.role });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}