// app/videos/page.tsx
import { getVideos } from '@/app/actions/videos'
import Link from 'next/link'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'

export default async function VideosPage() {
  const videos = await getVideos()

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Видео</h1>
      </div>

      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
            Пока нет видео
          </p>
        </div>
      ) : (
        <div className="grid grid-3">
          {videos.map((video) => (
            <Link key={video.id} href={`/videos/${video.id}`} style={{ textDecoration: 'none' }}>
              <Card hoverable>
                {video.thumbnail_url && (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <CardHeader>
                  <h3>{video.title}</h3>
                </CardHeader>
                <CardContent>
                  <p>{video.description || 'Без описания'}</p>
                  <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                    👁 {video.views} просмотров • {formatDate(video.created_at)}
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