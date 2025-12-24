// app/categories/page.tsx
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import styles from './categories.module.css'

export const metadata = {
  title: 'Все разделы | MethodX',
  description: 'Обзор всех разделов платформы MethodX',
}

export default function CategoriesPage() {
  const categories = [
    {
      id: 'lectures',
      name: 'Лекции',
      icon: '📚',
      description: 'Методические разработки, учебные материалы и лекции для учителей',
      link: '/lectures',
      color: '#2196F3',
    },
    {
      id: 'videos',
      name: 'Видеоматериалы',
      icon: '🎥',
      description: 'Обучающие видео, вебинары и видеолекции',
      link: '/videos',
      color: '#E91E63',
    },
    {
      id: 'photos',
      name: 'Фотогалерея',
      icon: '📷',
      description: 'Фотографии с мероприятий, наглядные материалы',
      link: '/photos',
      color: '#9C27B0',
    },
    {
      id: 'experiences',
      name: 'Обмен опытом',
      icon: '💬',
      description: 'Делитесь педагогическим опытом и читайте статьи коллег',
      link: '/experiences',
      color: '#FF9800',
    },
    {
      id: 'npa',
      name: 'НПА',
      icon: '📋',
      description: 'Нормативно-правовые акты в сфере образования Казахстана',
      link: '/npa',
      color: '#3F51B5',
      highlight: true,
    },
    {
      id: 'goso',
      name: 'ГОСО',
      icon: '📖',
      description: 'Государственные образовательные стандарты по всем предметам',
      link: '/goso',
      color: '#4CAF50',
      highlight: true,
    },
    {
      id: 'inclusive',
      name: 'Инклюзивное образование',
      icon: '🤝',
      description: 'Методики и материалы для работы с детьми с особыми образовательными потребностями',
      link: '/inclusive-education',
      color: '#9C27B0',
      highlight: true,
    },
    {
      id: 'qa',
      name: 'Вопросы и ответы',
      icon: '❓',
      description: 'Задавайте вопросы и получайте ответы от сообщества учителей',
      link: '/qa',
      color: '#00BCD4',
    },
    {
      id: 'faq',
      name: 'FAQ',
      icon: '💡',
      description: 'Часто задаваемые вопросы о платформе',
      link: '/faq',
      color: '#FFC107',
    },
  ]

  const highlightedCategories = categories.filter(c => c.highlight)
  const regularCategories = categories.filter(c => !c.highlight)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Все разделы платформы</h1>
        <p className={styles.subtitle}>
          MethodX — полный набор инструментов и ресурсов для современного учителя
        </p>
      </header>

      {highlightedCategories.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🌟 Новые разделы</h2>
          <div className={styles.highlightedGrid}>
            {highlightedCategories.map((category) => (
              <Link href={category.link} key={category.id} className={styles.cardLink}>
                <Card className={styles.highlightedCard} style={{ borderColor: category.color }}>
                  <CardHeader>
                    <div className={styles.cardIcon} style={{ background: category.color }}>
                      {category.icon}
                    </div>
                    <h3 className={styles.cardTitle}>{category.name}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className={styles.cardDescription}>{category.description}</p>
                    <div className={styles.cardAction}>
                      Перейти →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📂 Все разделы</h2>
        <div className={styles.grid}>
          {regularCategories.map((category) => (
            <Link href={category.link} key={category.id} className={styles.cardLink}>
              <Card className={styles.card}>
                <CardHeader>
                  <div className={styles.cardIcon} style={{ background: category.color }}>
                    {category.icon}
                  </div>
                  <h3 className={styles.cardTitle}>{category.name}</h3>
                </CardHeader>
                <CardContent>
                  <p className={styles.cardDescription}>{category.description}</p>
                  <div className={styles.cardAction}>
                    Перейти →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>✨ Возможности платформы</h2>
        <div className={styles.featuresGrid}>
          <Card>
            <CardHeader>
              <h3>🤖 Виртуальный помощник</h3>
            </CardHeader>
            <CardContent>
              <p>Получайте мгновенные ответы на вопросы о работе платформы</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3>🎯 Генератор тестов с AI</h3>
            </CardHeader>
            <CardContent>
              <p>Автоматически создавайте тесты на основе ваших лекций</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3>📊 Статистика просмотров</h3>
            </CardHeader>
            <CardContent>
              <p>Отслеживайте популярность ваших материалов</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3>💾 Хранение файлов</h3>
            </CardHeader>
            <CardContent>
              <p>Загружайте документы, видео и изображения до 100 МБ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3>🌙 Темная тема</h3>
            </CardHeader>
            <CardContent>
              <p>Переключайтесь между светлой и темной темой</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3>📱 Мобильная версия</h3>
            </CardHeader>
            <CardContent>
              <p>Пользуйтесь платформой с любого устройства</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
