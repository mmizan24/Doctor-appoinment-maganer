"use client";

import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext({
  toggleTheme: () => {},
});

const getStoredTheme = () => {
  return localStorage.getItem("theme") || "light";
};

const applyTheme = (nextTheme) => {
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
};

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
