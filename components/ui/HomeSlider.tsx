"use client";
import { useState } from "react";
import styles from "../../styles/pages/home.module.css";

export default function HomeSlider() {
  const slides = [
    {
      id: 1,
      img: "/placeholder.jpg",
      text: "Методическая копилка — это современный образовательный ресурс...",
    },
    {
      id: 2,
      img: "/placeholder.jpg",
      text: "Платформа помогает педагогам найти нужные ресурсы...",
    },
    {
      id: 3,
      img: "/placeholder.jpg",
      text: "Методическая копилка объединяет педагогов...",
    },
  ];

  const [current, setCurrent] = useState(0);
  const prev = () =>
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const next = () =>
    setCurrent(current === slides.length - 1 ? 0 : current + 1);

  return (
    <div className={styles.slider}>
      <div className={styles.slideRow}>
        <img src={slides[current].img} className={styles.slideImg} />
        <p className={styles.slideText}>{slides[current].text}</p>
      </div>

      <div className={styles.sliderNav}>
        <span className={styles.slideIndex}>
          {current + 1}/{slides.length}
        </span>

        <div className={styles.sliderButtons}>
          <button onClick={prev} className={styles.navBtn}>
            ‹
          </button>
          <button onClick={next} className={styles.navBtn}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
