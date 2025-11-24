// app/videos/[id]/page.tsx
import { getVideo } from '@/app/actions/videos'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'

// Функция для получения embed URL из YouTube/Vimeo
function getEmbedUrl(url: string): string | null {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return null
}

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const video = await getVideo(id)

  if (!video) {
    notFound()
  }

  const embedUrl = getEmbedUrl(video.video_url)

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/videos">
          <Button variant="ghost">← Назад к видео</Button>
        </Link>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Card>
          <CardHeader>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{video.title}</h1>
            {video.description && (
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {video.description}
              </p>
            )}
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
              👁 {video.views} просмотров • 📅 {formatDateTime(video.created_at)}
            </div>
          </CardHeader>

          <CardContent>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <source src={video.video_url} type="video/mp4" />
                  Ваш браузер не поддерживает воспроизведение видео.
                </video>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}