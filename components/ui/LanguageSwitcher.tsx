// components/ui/LanguageSwitcher.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/components/LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("ru");

  useEffect(() => {
    // Загружаем сохраненный язык
    const saved = localStorage.getItem("language") || "ru";
    setLanguage(saved);
    document.documentElement.setAttribute("lang", saved);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "ru" ? "kk" : "ru";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.setAttribute("lang", newLang);
    window.location.reload(); // Перезагрузка для применения переводов
    
  };

  return (
    <button onClick={toggleLanguage} className={styles.langBtn}>
      {language === "ru" ? "ҚАЗ" : "РУС"}
    </button>
  );
}