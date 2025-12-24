// app/npa/[id]/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getNPA } from '@/app/actions/npa'
import styles from './detail.module.css'

interface PageProps {
  params: Promise<{ id: string }>
}

async function NPADetail({ id }: { id: string }) {
  const npa = await getNPA(id)

  if (!npa) {
    notFound()
  }

  return (
    <div className={styles.container}>
      <Link href="/npa" className={styles.backLink}>
        ← Назад к списку НПА
      </Link>

      <Card className={styles.card}>
        <CardHeader>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <span className={`${styles.badge} ${styles[npa.document_type]}`}>
                {getDocumentTypeLabel(npa.document_type)}
              </span>
              <span className={styles.views}>👁 {npa.views} просмотров</span>
            </div>
            <h1 className={styles.title}>{npa.title}</h1>
            <p className={styles.documentNumber}>{npa.document_number}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className={styles.metadata}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Дата утверждения:</span>
              <span className={styles.metadataValue}>
                {new Date(npa.approval_date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Категория:</span>
              <span className={styles.metadataValue}>{npa.category}</span>
            </div>
            {npa.tags && npa.tags.length > 0 && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Теги:</span>
                <div className={styles.tags}>
                  {npa.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {npa.description && (
            <div className={styles.description}>
              <h2>Описание</h2>
              <p>{npa.description}</p>
            </div>
          )}

          <div className={styles.actions}>
            {npa.file_url && (
              <Button asChild>
                <a href={npa.file_url} target="_blank" rel="noopener noreferrer">
                  📄 Скачать документ
                </a>
              </Button>
            )}
            {npa.external_link && (
              <Button variant="secondary" asChild>
                <a href={npa.external_link} target="_blank" rel="noopener noreferrer">
                  🔗 Открыть на внешнем ресурсе
                </a>
              </Button>
            )}
          </div>

          <div className={styles.info}>
            <p className={styles.infoText}>
              💡 <strong>Важно:</strong> Данный документ представлен в информационных целях.
              При использовании в работе рекомендуется проверять актуальность документа
              на официальных государственных ресурсах.
            </p>
          </div>
        </CardContent>
      </Card>
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

export default async function NPADetailPage({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<div className={styles.loading}>Загрузка...</div>}>
      <NPADetail id={id} />
    </Suspense>
  )
}
