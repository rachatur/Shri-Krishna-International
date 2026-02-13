import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("hotel_logged_in") === "true";
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("hotel_user_email") ?? localStorage.getItem("hotel_last_email");
  });

  const login = (email?: string) => {
    const normalizedEmail = (email ?? "").trim() || "admin@srikrishna.com";
    localStorage.setItem("hotel_logged_in", "true");
    localStorage.setItem("hotel_user_email", normalizedEmail);
    localStorage.setItem("hotel_last_email", normalizedEmail);
    setIsLoggedIn(true);
    setUserEmail(normalizedEmail);
  };

  const logout = () => {
    localStorage.removeItem("hotel_logged_in");
    localStorage.removeItem("hotel_user_email");
    setIsLoggedIn(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
