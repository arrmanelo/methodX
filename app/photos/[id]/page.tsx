// app/photos/[id]/page.tsx
import { getPhoto } from '@/app/actions/photos'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const photo = await getPhoto(id)

  if (!photo) {
    notFound()
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/photos">
          <Button variant="ghost">← Назад к фото</Button>
        </Link>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Card>
          <img
            src={photo.photo_url}
            alt={photo.title}
            style={{
              width: '100%',
              maxHeight: '600px',
              objectFit: 'contain',
              backgroundColor: 'var(--background-secondary)',
            }}
          />
          <CardHeader>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{photo.title}</h1>
            {photo.description && (
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {photo.description}
              </p>
            )}
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
              👁 {photo.views} просмотров • 📅 {formatDateTime(photo.created_at)}
            </div>
          </CardHeader>

          <CardContent>
            <a href={photo.photo_url} target="_blank" rel="noopener noreferrer">
              <Button>Открыть в полном размере</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}