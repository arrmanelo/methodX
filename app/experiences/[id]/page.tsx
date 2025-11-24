// app/experiences/[id]/page.tsx
import { getExperience, addComment } from '@/app/actions/experiences'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'
import CommentForm from './CommentForm'

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getExperience(id)

  if (!result) {
    notFound()
  }

  const { experience, comments } = result

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/experiences">
          <Button variant="ghost">← Назад к статьям</Button>
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Статья */}
        <div style={{ marginBottom: '2rem' }}>
          <Card>
            <CardHeader>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{experience.title}</h1>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                👁 {experience.views} просмотров • 📅 {formatDateTime(experience.created_at)}
              </div>
            </CardHeader>

            <CardContent>
              <div
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {experience.content}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Комментарии */}
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.5rem' }}>
              Комментарии ({comments.length})
            </h2>
          </CardHeader>

          <CardContent>
            {/* Форма добавления комментария */}
            <CommentForm experienceId={id} />

            {/* Список комментариев */}
            <div style={{ marginTop: '2rem' }}>
              {comments.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Пока нет комментариев. Будьте первым!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'var(--background-secondary)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <p style={{ marginBottom: '0.5rem' }}>{comment.content}</p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {formatDateTime(comment.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}