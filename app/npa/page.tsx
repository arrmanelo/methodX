// app/npa/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { getNPAs } from '@/app/actions/npa'
import styles from './npa.module.css'

export const metadata = {
  title: 'НПА - Нормативно-правовые акты | MethodX',
  description: 'База нормативно-правовых актов в сфере образования Казахстана',
}

async function NPAList() {
  const npas = await getNPAs()

  const categories = Array.from(new Set(npas.map(npa => npa.category)))

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Нормативно-правовые акты</h1>
        <p className={styles.subtitle}>
          Полная база нормативно-правовых актов в сфере образования Республики Казахстан
        </p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{npas.length}</span>
            <span className={styles.statLabel}>документов</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{categories.length}</span>
            <span className={styles.statLabel}>категорий</span>
          </div>
        </div>
      </header>

      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Поиск по документам..."
          className={styles.searchInput}
        />
        <select className={styles.filterSelect}>
          <option value="">Все типы документов</option>
          <option value="law">Законы</option>
          <option value="regulation">Постановления</option>
          <option value="order">Приказы</option>
          <option value="instruction">Инструкции</option>
          <option value="letter">Письма</option>
          <option value="other">Другое</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">Все категории</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {npas.map((npa) => (
          <Link href={`/npa/${npa.id}`} key={npa.id} className={styles.cardLink}>
            <Card className={styles.card}>
              <CardHeader>
                <div className={styles.cardHeader}>
                  <span className={`${styles.badge} ${styles[npa.document_type]}`}>
                    {getDocumentTypeLabel(npa.document_type)}
                  </span>
                  <span className={styles.views}>👁 {npa.views}</span>
                </div>
                <h3 className={styles.cardTitle}>{npa.title}</h3>
                <p className={styles.documentNumber}>{npa.document_number}</p>
              </CardHeader>
              <CardContent>
                <p className={styles.description}>
                  {npa.description || 'Нет описания'}
                </p>
                <div className={styles.metadata}>
                  <span className={styles.category}>📂 {npa.category}</span>
                  <span className={styles.date}>
                    📅 {new Date(npa.approval_date).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                {npa.tags && npa.tags.length > 0 && (
                  <div className={styles.tags}>
                    {npa.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {npas.length === 0 && (
        <div className={styles.empty}>
          <p>Документы не найдены</p>
          <p className={styles.emptyHint}>
            Нормативно-правовые акты будут добавлены администратором
          </p>
        </div>
      )}
    </div>
  )
}

function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    law: 'Закон',
    regulation: 'Постановление',
    order: 'Приказ',
    instruction: 'Инструкция',
    letter: 'Письмо',
    other: 'Другое',
  }
  return labels[type] || type
}

export default function NPAPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Загрузка...</div>}>
      <NPAList />
    </Suspense>
  )
}
