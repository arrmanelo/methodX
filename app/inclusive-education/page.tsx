// app/inclusive-education/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { getInclusiveResources } from '@/app/actions/inclusive-education'
import styles from './inclusive.module.css'

export const metadata = {
  title: 'Инклюзивное образование | MethodX',
  description: 'Методические материалы и ресурсы по инклюзивному образованию',
}

async function InclusiveEducationList() {
  const resources = await getInclusiveResources()

  const resourceTypes = Array.from(new Set(resources.map(r => r.resource_type)))

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Инклюзивное образование</h1>
        <p className={styles.subtitle}>
          Методические материалы, руководства и практические рекомендации по организации
          инклюзивного образовательного процесса
        </p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{resources.length}</span>
            <span className={styles.statLabel}>материалов</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{resourceTypes.length}</span>
            <span className={styles.statLabel}>типов ресурсов</span>
          </div>
        </div>
      </header>

      <div className={styles.infoCards}>
        <Card className={styles.infoCard}>
          <CardHeader>
            <h3>🤝 Что такое инклюзивное образование?</h3>
          </CardHeader>
          <CardContent>
            <p>
              Инклюзивное образование — это процесс обеспечения равного доступа к качественному
              образованию для всех учащихся, включая детей с особыми образовательными потребностями.
            </p>
          </CardContent>
        </Card>

        <Card className={styles.infoCard}>
          <CardHeader>
            <h3>🎯 Цели раздела</h3>
          </CardHeader>
          <CardContent>
            <ul>
              <li>Поддержка учителей в работе с детьми с ООП</li>
              <li>Обмен успешными практиками инклюзии</li>
              <li>Методические рекомендации и руководства</li>
              <li>Адаптация учебных программ</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Поиск материалов..."
          className={styles.searchInput}
        />
        <select className={styles.filterSelect}>
          <option value="">Все типы ресурсов</option>
          <option value="article">Статьи</option>
          <option value="guide">Руководства</option>
          <option value="methodology">Методики</option>
          <option value="case_study">Кейсы</option>
          <option value="video">Видео</option>
          <option value="other">Другое</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">Все нозологии</option>
          <option value="hearing">Нарушения слуха</option>
          <option value="vision">Нарушения зрения</option>
          <option value="mobility">Нарушения опорно-двигательного аппарата</option>
          <option value="intellectual">Интеллектуальные нарушения</option>
          <option value="autism">РАС (аутизм)</option>
          <option value="speech">Нарушения речи</option>
        </select>
      </div>

      <div className={styles.grid}>
        {resources.map((resource) => (
          <Link href={`/inclusive-education/${resource.id}`} key={resource.id} className={styles.cardLink}>
            <Card className={styles.card}>
              <CardHeader>
                <div className={styles.cardHeader}>
                  <span className={`${styles.badge} ${styles[resource.resource_type]}`}>
                    {getResourceTypeLabel(resource.resource_type)}
                  </span>
                  <span className={styles.views}>👁 {resource.views}</span>
                </div>
                <h3 className={styles.cardTitle}>{resource.title}</h3>
              </CardHeader>
              <CardContent>
                <p className={styles.description}>
                  {resource.content.substring(0, 150)}...
                </p>
                {resource.disability_type && resource.disability_type.length > 0 && (
                  <div className={styles.tags}>
                    {resource.disability_type.map((type, index) => (
                      <span key={index} className={styles.tag}>{type}</span>
                    ))}
                  </div>
                )}
                <div className={styles.metadata}>
                  {resource.grade_level && (
                    <span className={styles.grade}>🎓 {resource.grade_level}</span>
                  )}
                  {resource.subject && (
                    <span className={styles.subject}>📚 {resource.subject}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {resources.length === 0 && (
        <div className={styles.empty}>
          <p>Материалы не найдены</p>
          <p className={styles.emptyHint}>
            Материалы по инклюзивному образованию будут добавлены в ближайшее время
          </p>
        </div>
      )}
    </div>
  )
}

function getResourceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    article: 'Статья',
    guide: 'Руководство',
    methodology: 'Методика',
    case_study: 'Кейс',
    video: 'Видео',
    other: 'Другое',
  }
  return labels[type] || type
}

export default function InclusiveEducationPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Загрузка...</div>}>
      <InclusiveEducationList />
    </Suspense>
  )
}
