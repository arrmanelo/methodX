// app/photos/page.tsx
import { getPhotos } from '@/app/actions/photos'
import Link from 'next/link'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'

export default async function PhotosPage() {
  const photos = await getPhotos()

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Фотогалерея</h1>
      </div>

      {photos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
            Пока нет фото
          </p>
        </div>
      ) : (
        <div className="grid grid-3">
          {photos.map((photo) => (
            <Link key={photo.id} href={`/photos/${photo.id}`} style={{ textDecoration: 'none' }}>
              <Card hoverable>
                {photo.photo_url && (
                  <img
                    src={photo.photo_url}
                    alt={photo.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <CardHeader>
                  <h3>{photo.title}</h3>
                </CardHeader>
                <CardContent>
                  <p>{photo.description || 'Без описания'}</p>
                  <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                    👁 {photo.views} просмотров • {formatDate(photo.created_at)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}