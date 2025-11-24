// app/admin/videos/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DeleteButton from '../lectures/DeleteButton'
import { formatDate } from '@/lib/utils'

export default async function AdminVideosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Управление видео</h1>
        <Link href="/admin/videos/new">
          <Button>Добавить видео</Button>
        </Link>
      </div>

      {!videos || videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            У вас пока нет видео
          </p>
          <Link href="/admin/videos/new">
            <Button>Добавить первое видео</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {videos.map((video) => (
            <Card key={video.id}>
              {video.thumbnail_url && (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
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
              <CardFooter>
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <Link href={`/videos/${video.id}`} style={{ flex: 1 }}>
                    <Button variant="secondary" style={{ width: '100%' }}>
                      Просмотр
                    </Button>
                  </Link>
                  <DeleteButton id={video.id} title={video.title} type="video" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}