// app/goso/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { getGOSOs } from '@/app/actions/goso'
import styles from './goso.module.css'

export const metadata = {
  title: 'ГОСО - Государственные образовательные стандарты | MethodX',
  description: 'База государственных образовательных стандартов Казахстана',
}

async function GOSOList() {
  const gosos = await getGOSOs()

  const subjects = Array.from(new Set(gosos.map(g => g.subject)))
  const gradeLevels = Array.from(new Set(gosos.map(g => g.grade_level)))

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Государственные образовательные стандарты (ГОСО)</h1>
        <p className={styles.subtitle}>
          Полная база государственных образовательных стандартов для всех уровней образования
        </p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{gosos.length}</span>
            <span className={styles.statLabel}>стандартов</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{subjects.length}</span>
            <span className={styles.statLabel}>предметов</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{gradeLevels.length}</span>
            <span className={styles.statLabel}>уровней</span>
          </div>
        </div>
      </header>

      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Поиск по стандартам..."
          className={styles.searchInput}
        />
        <select className={styles.filterSelect}>
          <option value="">Все предметы</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        <select className={styles.filterSelect}>
          <option value="">Все уровни</option>
          {gradeLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {gosos.map((goso) => (
          <Link href={`/goso/${goso.id}`} key={goso.id} className={styles.cardLink}>
            <Card className={styles.card}>
              <CardHeader>
                <div className={styles.cardHeader}>
                  <span className={styles.badge}>{goso.subject}</span>
                  <span className={styles.views}>👁 {goso.views}</span>
                </div>
                <h3 className={styles.cardTitle}>{goso.title}</h3>
                <p className={styles.documentNumber}>{goso.document_number}</p>
              </CardHeader>
              <CardContent>
                <p className={styles.description}>
                  {goso.description || 'Нет описания'}
                </p>
                <div className={styles.metadata}>
                  <span className={styles.gradeLevel}>🎓 {goso.grade_level}</span>
                  <span className={styles.date}>
                    📅 {new Date(goso.approval_date).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {gosos.length === 0 && (
        <div className={styles.empty}>
          <p>Стандарты не найдены</p>
          <p className={styles.emptyHint}>
            Государственные образовательные стандарты будут добавлены администратором
          </p>
        </div>
      )}
    </div>
  )
}

export default function GOSOPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Загрузка...</div>}>
      <GOSOList />
    </Suspense>
  )
}
