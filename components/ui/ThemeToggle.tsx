"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial = saved ?? (systemDark ? "dark" : "light");

    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "8px 14px",
        borderRadius: "8px",
        background: "var(--background-secondary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
        cursor: "pointer",
      }}
    >
      {theme === "light" ? "☀️" : "🌙"}
    </button>
  );
}
