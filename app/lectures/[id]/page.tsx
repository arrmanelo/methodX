// app/lectures/[id]/page.tsx
import { getLecture } from '@/app/actions/lectures'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'


export default async function LectureDetailPage({ params }: { params: { id: string } })
 {
  const { id } = await params
  const lecture = await getLecture(id)

  if (!lecture) {
    notFound()
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/lectures">
          <Button variant="ghost">← Назад к лекциям</Button>
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card>
          <CardHeader>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{lecture.title}</h1>
            {lecture.description && (
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {lecture.description}
              </p>
            )}
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
              👁 {lecture.views} просмотров • 📅 {formatDateTime(lecture.created_at)}
            </div>
          </CardHeader>

          <CardContent>
            {lecture.content && (
              <div
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  marginBottom: lecture.file_url ? '2rem' : '0',
                }}
              >
                {lecture.content}
              </div>
            )}

            {lecture.file_url && (
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--background-secondary)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>📎 Прикрепленный файл</h3>
                <a
                  href={lecture.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block' }}
                >
                  <Button>Скачать файл</Button>
                </a>
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <Link href={`/lectures/${id}/generate-test`}>
                <Button className="w-full text-lg py-3">✨ Сгенерировать тест</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}