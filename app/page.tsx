// app/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HomeSlider from "../components/ui/HomeSlider";
import styles from "../styles/pages/home.module.css";
import Footer from "../components/ui/Footer";
import { use } from "react";

export default async function HomePage() {
  const supabase = await createClient();

  // Статистика
  const [lecturesCount, videosCount, photosCount, experiencesCount] =
    await Promise.all([
      supabase.from("lectures").select("*", { count: "exact", head: true }),
      supabase.from("videos").select("*", { count: "exact", head: true }),
      supabase.from("photos").select("*", { count: "exact", head: true }),
      supabase.from("experiences").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div className={styles.wrapper}>
      {/* HERO */}
      <section className={styles.hero}>
        <video
          className={styles.videoBg}
          autoPlay
          muted
          loop
          playsInline
          src="../main2.mp4"
        />
        <div className={styles.overlay} />

        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBox}>
              <h1 className={styles.heroTitle}>
                <span>МЕТОДИЧЕСКАЯ</span>
                <span className={styles.orange}>КОПИЛКА</span>
                <span className={styles.green}>ДЛЯ УЧИТЕЛЕЙ</span>
              </h1>

              <p className={styles.heroSubtitle}>
                Полезный ресурс для обмена педагогическим опытом
              </p>

              {/* Слайдер новостей */}
              <HomeSlider />
            </div>
          </div>

          {/* СПРАВА — статистика + блоки */}
          <div className={styles.rightSide}>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  {lecturesCount.count || 0}
                </div>
                <div className={styles.statLabel}>Лекций</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  {videosCount.count || 0}
                </div>
                <div className={styles.statLabel}>Видео</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  {photosCount.count || 0}
                </div>
                <div className={styles.statLabel}>Фото</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  {experiencesCount.count || 0}
                </div>
                <div className={styles.statLabel}>Статей</div>
              </div>
            </div>

            {/* Категории */}
            <div className={styles.categories}>
              <Link href="/lectures" className={styles.categoryCard}>
                <h3>📚 Лекции</h3>
                <p>Текстовые материалы и документы</p>
              </Link>

              <Link href="/photos" className={styles.categoryCard}>
                <h3>📷 Фото</h3>
                <p>Иллюстрации и наглядные материалы</p>
              </Link>

              <Link href="/videos" className={styles.categoryCard}>
                <h3>🎥 Видео</h3>
                <p>Видеоуроки и лекции</p>
              </Link>

              <Link href="/experiences" className={styles.categoryCard}>
                <h3>💡 Обмен опытом</h3>
                <p>Обсуждения и публикации коллег</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
