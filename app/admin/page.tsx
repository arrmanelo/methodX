// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default async function AdminPage() {
  const supabase = await createClient()

  // Проверяем авторизацию и роль
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'teacher') {
    redirect('/')
  }

  // Получаем статистику материалов учителя
  const [lecturesCount, videosCount, photosCount] = await Promise.all([
    supabase
      .from('lectures')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id),
    supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id),
    supabase
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id),
  ])

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Панель управления</h1>

      {/* Статистика */}
      <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
        <Card>
          <CardContent>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {lecturesCount.count || 0}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                Лекций
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {videosCount.count || 0}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                Видео
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {photosCount.count || 0}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                Фото
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Действия */}
      <h2 style={{ marginBottom: '1.5rem' }}>Управление материалами</h2>
      <div className="grid grid-3">
        <Link href="/admin/lectures/new">
          <Card hoverable>
            <CardHeader>
              <h3>📚 Создать лекцию</h3>
            </CardHeader>
            <CardContent>
              <p>Добавить новую лекцию с текстом и файлами</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/videos/new">
          <Card hoverable>
            <CardHeader>
              <h3>🎥 Загрузить видео</h3>
            </CardHeader>
            <CardContent>
              <p>Добавить новое видео для студентов</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/photos/new">
          <Card hoverable>
            <CardHeader>
              <h3>📷 Добавить фото</h3>
            </CardHeader>
            <CardContent>
              <p>Загрузить фотографии и изображения</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Список материалов */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Мои материалы</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/lectures">
            <Button variant="secondary">Управление лекциями</Button>
          </Link>
          <Link href="/admin/videos">
            <Button variant="secondary">Управление видео</Button>
          </Link>
          <Link href="/admin/photos">
            <Button variant="secondary">Управление фото</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}