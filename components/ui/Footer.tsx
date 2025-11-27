'use client'

import { useState } from 'react'
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        
        {/* Секция 1: Контакты */}
        <div className={styles.contacts}>
          <h3 className={styles.heading}>Наши контакты</h3>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              {/* <FaPhone className={styles.icon} /> */}
              <a href="tel:+77477378092" className={styles.contactLink}>+7 (747) 737-80-92</a>
            </li>
            <li className={styles.contactItem}>
              {/* <FaPhone className={styles.icon} /> */}
              <a href="tel:+77089398060" className={styles.contactLink}>+7 (708) 939-80-60</a>
            </li>
            <li className={styles.contactItem}>
              {/* <FaPhone className={styles.icon} /> */}
              <a href="tel:+77479349238" className={styles.contactLink}>+7 (747) 934-92-38</a>
            </li>
          </ul>
        </div>

        {/* Секция 2: Навигация (Добавьте нужные ссылки) */}
        <div className={styles.navigation}>
          <h3 className={styles.heading}>Навигация</h3>
          <ul className={styles.navList}>
            <li className={styles.navItem}><a href="/about" className={styles.navLink}>Лекции</a></li>
            <li className={styles.navItem}><a href="/materials" className={styles.navLink}>Видео</a></li>
            <li className={styles.navItem}><a href="/faq" className={styles.navLink}>Фото</a></li>
            <li className={styles.navItem}><a href="/policy" className={styles.navLink}>Обмен опытом</a></li>
          </ul>
        </div>

        {/* Секция 3: Социальные сети и Поддержка */}
        <div className={styles.footerRight}>
          <h3 className={styles.heading}>Мы в сети</h3>
          <div className={styles.socials}>
             {/* Добавьте иконки соцсетей здесь */}
             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
               {/* <FaInstagram className={styles.socialIcon} /> */} Instagram
             </a>
             <a href="https://t.me" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
               {/* <FaTelegram className={styles.socialIcon} /> */} Telegram
             </a>
          </div>

          <div className={styles.supportContainer}>
            <div className={styles.support}>При поддержке Gym Coders</div>
            <p>© 2025 Методическая копилка</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;