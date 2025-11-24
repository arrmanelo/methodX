// app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import styles from '@/styles/pages/home.module.css'

export default async function Home() {
  const supabase = await createClient()

  // Получаем статистику
  const [lecturesCount, videosCount, photosCount, experiencesCount] = await Promise.all([
    supabase.from('lectures').select('*', { count: 'exact', head: true }),
    supabase.from('videos').select('*', { count: 'exact', head: true }),
    supabase.from('photos').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className={styles.container}>
      {/* Hero секция */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Добро пожаловать в StudyHub</h1>
          <p className={styles.heroDescription}>
            Платформа для обмена учебными материалами. Лекции, видео, фото и опыт преподавателей в одном месте.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/lectures">
              <Button size="lg">Смотреть лекции</Button>
            </Link>
            <Link href="/experiences/new">
              <Button variant="secondary" size="lg">
                Поделиться опытом
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{lecturesCount.count || 0}</div>
          <div className={styles.statLabel}>Лекций</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{videosCount.count || 0}</div>
          <div className={styles.statLabel}>Видео</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{photosCount.count || 0}</div>
          <div className={styles.statLabel}>Фото</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{experiencesCount.count || 0}</div>
          <div className={styles.statLabel}>Статей</div>
        </div>
      </section>

      {/* Категории */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Разделы</h2>
        <div className={styles.categoriesGrid}>
          <Link href="/lectures">
            <Card hoverable>
              <CardHeader>
                <h3>📚 Лекции</h3>
              </CardHeader>
              <CardContent>
                <p>Текстовые материалы и документы для обучения</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/videos">
            <Card hoverable>
              <CardHeader>
                <h3>🎥 Видео</h3>
              </CardHeader>
              <CardContent>
                <p>Видеоуроки и записи лекций</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/photos">
            <Card hoverable>
              <CardHeader>
                <h3>📷 Фото</h3>
              </CardHeader>
              <CardContent>
                <p>Наглядные материалы и иллюстрации</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/experiences">
            <Card hoverable>
              <CardHeader>
                <h3>💡 Обмен опытом</h3>
              </CardHeader>
              <CardContent>
                <p>Делитесь опытом и обсуждайте с коллегами</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  )
}